"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/puck/config";
import { apiFetch, ApiError } from "@/lib/api";
import { useToast } from "@/components/Toast";
import type { MenuItem } from "@/lib/types";

/* ── 타입 ── */
interface PageLayout {
  layoutJson: string;
  status: string;
}

interface FlatPage {
  key: string;
  label: string;
  depth: number;
}

/* ── 메뉴 트리 → 편집가능 페이지 플래트 리스트 ── */
function flattenMenuPages(items: MenuItem[], depth = 0): FlatPage[] {
  const result: FlatPage[] = [];
  for (const item of items) {
    // CONTENT 타입만 페이지 편집 대상
    if (item.menuType === "CONTENT") {
      const key = item.url?.replace(/^\//, "") || `menu-${item.id}`;
      result.push({
        key,
        label: "\u00A0".repeat(depth * 3) + item.name,
        depth,
      });
    }
    if (item.children?.length) {
      result.push(...flattenMenuPages(item.children, depth + 1));
    }
  }
  return result;
}

/* ── 코드 뷰 패널 ── */
function CodeViewPanel({ data }: { data: unknown }) {
  const json = useMemo(() => JSON.stringify(data, null, 2), [data]);
  return (
    <div
      style={{
        width: 420,
        borderLeft: "1px solid #e5e7eb",
        background: "#1e1e2e",
        color: "#cdd6f4",
        fontSize: 12,
        fontFamily: "'Fira Code', 'Consolas', monospace",
        overflow: "auto",
        padding: "16px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#89b4fa",
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        Puck JSON (읽기 전용)
      </div>
      {json}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function PageBuilder({ site }: { site: "dataware" | "union" }) {
  const { toast } = useToast();

  /* 상태 */
  const [pages, setPages] = useState<FlatPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [initialData, setInitialData] = useState<Record<string, unknown> | null>(null);
  const [currentData, setCurrentData] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState<string>("DRAFT");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const siteName = site === "dataware" ? "데이터웨어" : "유니온시스템즈";

  /* 1) 메뉴 목록 불러오기 */
  useEffect(() => {
    apiFetch<MenuItem[]>(`/api/admin/${site}/menus`)
      .then((menus) => {
        const flat = flattenMenuPages(menus);
        setPages(flat);
        // 첫 번째 페이지 자동 선택
        if (flat.length > 0) {
          setSelectedPage(flat[0].key);
        }
      })
      .catch(() => {
        setPages([]);
      })
      .finally(() => setLoading(false));
  }, [site]);

  /* 2) 선택된 페이지 레이아웃 불러오기 */
  useEffect(() => {
    if (!selectedPage) {
      setInitialData(null);
      return;
    }
    setLoading(true);
    apiFetch<PageLayout>(`/api/admin/${site}/page-layout/${selectedPage}`)
      .then((res) => {
        try {
          const parsed = JSON.parse(res.layoutJson);
          setInitialData(parsed);
          setCurrentData(parsed);
          setStatus(res.status);
        } catch {
          setInitialData({});
          setCurrentData({});
          setStatus("DRAFT");
        }
      })
      .catch(() => {
        // 아직 레이아웃 없는 페이지
        setInitialData({});
        setCurrentData({});
        setStatus("DRAFT");
      })
      .finally(() => setLoading(false));
  }, [selectedPage, site]);

  /* 저장 / 발행 */
  const handleSave = useCallback(
    async (data: Record<string, unknown>, publishStatus: string) => {
      if (!selectedPage || saving) return;
      setSaving(true);
      try {
        await apiFetch(`/api/admin/${site}/page-layout/${selectedPage}`, {
          method: "PUT",
          body: JSON.stringify({
            title: selectedPage,
            layoutJson: JSON.stringify(data),
            status: publishStatus,
          }),
        });
        setStatus(publishStatus);
        setCurrentData(data);
        toast(
          "success",
          publishStatus === "PUBLISHED"
            ? "발행되었습니다 — 실제 사이트에 반영됩니다"
            : "임시 저장되었습니다"
        );
      } catch (err) {
        toast(
          "error",
          err instanceof ApiError ? err.message : "저장에 실패했습니다"
        );
      } finally {
        setSaving(false);
      }
    },
    [selectedPage, site, saving, toast]
  );

  /* 로딩 */
  if (loading && !initialData) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400">
        불러오는 중...
      </div>
    );
  }

  /* 메뉴가 없는 경우 */
  if (pages.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400 gap-4">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium">편집할 페이지가 없습니다</p>
        <p className="text-sm">먼저 &quot;메뉴 관리&quot;에서 CONTENT 타입 메뉴를 추가하세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
      {/* ── 상단 도구 바 ── */}
      <div
        className="flex items-center gap-3 px-4 py-2 border-b border-gray-200 bg-white shrink-0"
        style={{ zIndex: 50 }}
      >
        {/* 사이트 표시 */}
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          {siteName}
        </span>
        <span className="text-gray-300">|</span>

        {/* 페이지 선택 */}
        <label className="text-sm text-gray-600 font-medium whitespace-nowrap">
          편집할 페이지:
        </label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-[200px]"
        >
          {pages.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>

        {/* 상태 뱃지 */}
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            status === "PUBLISHED"
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {status === "PUBLISHED" ? "발행됨" : "임시저장"}
        </span>

        <div className="flex-1" />

        {/* 코드 보기 토글 */}
        <button
          onClick={() => setShowCode((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            showCode
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          코드 보기
        </button>
      </div>

      {/* ── 에디터 영역 ── */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              레이아웃 불러오는 중...
            </div>
          ) : initialData && Object.keys(initialData).length === 0 ? (
            /* 빈 캔버스 안내 — Puck은 빈 data({})도 받음 */
            <Puck
              config={puckConfig}
              data={initialData as Parameters<typeof Puck>[0]["data"]}
              onPublish={async (data) => {
                await handleSave(data as Record<string, unknown>, "PUBLISHED");
              }}
              onChange={(data) => {
                setCurrentData(data as Record<string, unknown>);
              }}
              headerTitle={`${siteName} — ${selectedPage}`}
              overrides={{
                headerActions: ({ children }) => (
                  <>
                    <button
                      onClick={async () => {
                        if (currentData) {
                          await handleSave(currentData, "DRAFT");
                        }
                      }}
                      disabled={saving}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 mr-2 disabled:opacity-50"
                    >
                      {saving ? "저장 중..." : "임시저장"}
                    </button>
                    {children}
                  </>
                ),
              }}
            />
          ) : initialData ? (
            <Puck
              config={puckConfig}
              data={initialData as Parameters<typeof Puck>[0]["data"]}
              onPublish={async (data) => {
                await handleSave(data as Record<string, unknown>, "PUBLISHED");
              }}
              onChange={(data) => {
                setCurrentData(data as Record<string, unknown>);
              }}
              headerTitle={`${siteName} — ${selectedPage}`}
              overrides={{
                headerActions: ({ children }) => (
                  <>
                    <button
                      onClick={async () => {
                        if (currentData) {
                          await handleSave(currentData, "DRAFT");
                        }
                      }}
                      disabled={saving}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 mr-2 disabled:opacity-50"
                    >
                      {saving ? "저장 중..." : "임시저장"}
                    </button>
                    {children}
                  </>
                ),
              }}
            />
          ) : null}
        </div>

        {/* 코드 보기 패널 */}
        {showCode && currentData && <CodeViewPanel data={currentData} />}
      </div>
    </div>
  );
}
