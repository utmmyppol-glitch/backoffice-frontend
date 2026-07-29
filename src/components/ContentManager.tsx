"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import DOMPurify from "dompurify";
import { apiFetch, ApiError } from "@/lib/api";
import { ContentRegion, ContentHistory } from "@/lib/types";
import Modal from "./Modal";
import { useToast } from "./Toast";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with TipTap
const RichEditor = dynamic(() => import("./RichEditor"), { ssr: false });

interface ContentManagerProps {
  site: "union" | "dataware";
}

export default function ContentManager({ site }: ContentManagerProps) {
  const { toast } = useToast();
  const [regions, setRegions] = useState<ContentRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContentRegion | null>(null);
  const [editHtml, setEditHtml] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // History
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<ContentHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  // Track dirty for beforeunload
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty;

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // Fetch regions
  const fetchRegions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch<ContentRegion[]>(`/api/admin/${site}/contents`);
      setRegions(data);
      // Auto-select first region if none selected
      if (data.length > 0 && !selected) {
        setSelected(data[0]);
        setEditHtml(data[0].body_html);
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "콘텐츠를 불러오지 못했습니다";
      toast("error", msg);
    } finally {
      setLoading(false);
    }
  }, [site, toast, selected]);

  useEffect(() => {
    fetchRegions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site]);

  // Select region (with unsaved warning)
  function selectRegion(region: ContentRegion) {
    if (dirty) {
      const ok = window.confirm("저장하지 않은 변경사항이 있습니다. 이동하시겠습니까?");
      if (!ok) return;
    }
    setSelected(region);
    setEditHtml(region.body_html);
    setDirty(false);
  }

  // Save
  async function handleSave() {
    if (!selected) return;
    try {
      setSaving(true);
      await apiFetch(`/api/admin/${site}/contents/${selected.id}`, {
        method: "PUT",
        body: JSON.stringify({ body_html: editHtml }),
      });
      toast("success", "저장되었습니다");
      setDirty(false);
      // Refresh
      const data = await apiFetch<ContentRegion[]>(`/api/admin/${site}/contents`);
      setRegions(data);
      const updated = data.find((r) => r.id === selected.id);
      if (updated) {
        setSelected(updated);
        setEditHtml(updated.body_html);
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "저장에 실패했습니다";
      toast("error", msg);
    } finally {
      setSaving(false);
    }
  }

  // History
  async function openHistory() {
    if (!selected) return;
    try {
      setHistoryLoading(true);
      setHistoryOpen(true);
      const data = await apiFetch<ContentHistory[]>(
        `/api/admin/${site}/contents/${selected.id}/history`
      );
      setHistory(data);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "이력을 불러오지 못했습니다";
      toast("error", msg);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleRevert(historyId: number) {
    if (!selected) return;
    const ok = window.confirm("이 버전으로 되돌리시겠습니까? 현재 내용이 교체됩니다.");
    if (!ok) return;
    try {
      await apiFetch(`/api/admin/${site}/contents/${selected.id}/revert`, {
        method: "POST",
        body: JSON.stringify({ history_id: historyId }),
      });
      toast("success", "되돌리기가 완료되었습니다");
      setHistoryOpen(false);
      setPreviewHtml(null);
      // Refresh
      const data = await apiFetch<ContentRegion[]>(`/api/admin/${site}/contents`);
      setRegions(data);
      const updated = data.find((r) => r.id === selected.id);
      if (updated) {
        setSelected(updated);
        setEditHtml(updated.body_html);
        setDirty(false);
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "되돌리기에 실패했습니다";
      toast("error", msg);
    }
  }

  function formatDate(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        불러오는 중...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">콘텐츠 편집</h1>
        <p className="text-sm text-gray-500 mt-1">페이지 콘텐츠를 편집합니다</p>
      </div>

      <div className="flex gap-6">
        {/* Region selector (sidebar) */}
        <div className="w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">편집 영역</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {regions.length === 0 ? (
                <div className="p-4 text-sm text-gray-400">등록된 콘텐츠가 없습니다</div>
              ) : (
                regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => selectRegion(region)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      selected?.id === region.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">{region.display_name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {formatDate(region.updated_at)}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Editor area */}
        <div className="flex-1 min-w-0">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Editor header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {selected.display_name}
                  </h2>
                  <p className="text-xs text-gray-400">
                    마지막 수정: {formatDate(selected.updated_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={openHistory}
                    className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    수정 이력
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !dirty}
                    className="px-4 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? "저장 중..." : "저장"}
                  </button>
                </div>
              </div>

              {/* Dirty indicator */}
              {dirty && (
                <div className="px-6 py-1.5 bg-amber-50 border-b border-amber-200 text-xs text-amber-700">
                  변경사항이 있습니다. 저장 버튼을 눌러 반영하세요.
                </div>
              )}

              {/* RichEditor */}
              <div className="p-6">
                <RichEditor
                  value={editHtml}
                  onChange={(html) => {
                    setEditHtml(html);
                    setDirty(true);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
              왼쪽에서 편집할 콘텐츠를 선택하세요
            </div>
          )}
        </div>
      </div>

      {/* History Modal */}
      <Modal
        open={historyOpen}
        onClose={() => {
          setHistoryOpen(false);
          setPreviewHtml(null);
        }}
        title={`수정 이력 — ${selected?.display_name ?? ""}`}
        width="max-w-3xl"
      >
        {historyLoading ? (
          <div className="py-8 text-center text-gray-400">불러오는 중...</div>
        ) : history.length === 0 ? (
          <div className="py-8 text-center text-gray-400">수정 이력이 없습니다</div>
        ) : (
          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">{h.edited_by}</span>
                    <span className="ml-2 text-gray-400">{formatDate(h.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setPreviewHtml(previewHtml === h.body_html ? null : h.body_html)
                      }
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {previewHtml === h.body_html ? "미리보기 닫기" : "미리보기"}
                    </button>
                    <button
                      onClick={() => handleRevert(h.id)}
                      className="text-xs text-white bg-amber-500 hover:bg-amber-600 px-2.5 py-1 rounded"
                    >
                      되돌리기
                    </button>
                  </div>
                </div>
                {previewHtml === h.body_html && (
                  <div
                    className="p-4 text-sm prose prose-sm max-w-none border-t border-gray-200"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(h.body_html) }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
