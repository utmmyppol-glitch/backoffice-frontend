"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/Toast";
import ImageUploadField from "@/components/ImageUploadField";

/* ── 타입 ── */
interface ContentResponse { id: number; regionKey: string; bodyHtml: string; }
interface HistoryEntry { id: number; contentId: number; bodyHtml: string; editedBy: number; editedAt: string; }
interface ManifestField { id: string; type: "text" | "image"; value: string; }
interface SectionGroup { key: string; fields: ManifestField[]; }

interface MenuItemRaw {
  id: number;
  name: string;
  url: string;
  menuType: "CONTENT" | "BOARD" | "LINK";
  isExposed: boolean;
  children?: MenuItemRaw[];
}

interface PageEditorProps {
  site: "union" | "dataware";
  presetPages: { label: string; path: string }[];
  previewBaseUrl: string;
}

/* ── 사이트별 테마 클래스 (Tailwind JIT 안전) ── */
const THEME = {
  union: {
    btnPrimary: "bg-red-600 hover:bg-red-700 text-white",
    btnSave: "bg-red-50 text-red-700 hover:bg-red-100",
    focusRing: "focus:ring-red-500 focus:border-red-500",
    spinner: "border-t-red-600",
    tabActive: "bg-red-600 text-white",
    highlightColor: "#dc2626",
  },
  dataware: {
    btnPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white",
    btnSave: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    focusRing: "focus:ring-emerald-500 focus:border-emerald-500",
    spinner: "border-t-emerald-600",
    tabActive: "bg-emerald-600 text-white",
    highlightColor: "#36c88a",
  },
};

/* ── 메뉴 트리 → 페이지 목록 플래튼 ── */
function flattenMenuPages(items: MenuItemRaw[]): { label: string; path: string }[] {
  const result: { label: string; path: string }[] = [];
  for (const item of items) {
    if (item.url && item.isExposed && item.menuType !== "LINK") {
      result.push({ label: item.name, path: item.url });
    }
    if (item.children?.length) {
      result.push(...flattenMenuPages(item.children));
    }
  }
  return result;
}

const TEXTAREA_HINTS = new Set(["desc", "text", "quote", "hoursNote"]);
const LABEL_MAP: Record<string, string> = {
  title: "제목", accent: "강조 텍스트", desc: "설명", text: "본문",
  subtitle: "부제", quote: "인용문", ceo: "CEO", img: "이미지",
  num: "숫자", label: "라벨", name: "이름",
  line1: "주소 1줄", line2: "주소 2줄", mapNote: "지도 안내문",
  tel: "전화", fax: "팩스", emailSales: "영업 이메일", emailGeneral: "대표 이메일",
  hours: "운영시간", hoursNote: "운영 안내", line: "노선", type: "종류", routes: "노선번호",
};

/* ── 유틸 ── */
function deepGet(obj: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    const k: string | number = /^\d+$/.test(p) ? Number(p) : p;
    cur = (cur as Record<string | number, unknown>)[k];
  }
  return typeof cur === "string" ? cur : (cur != null ? String(cur) : undefined);
}

function deepSet(obj: unknown, path: string, value: string): unknown {
  const clone = JSON.parse(JSON.stringify(obj));
  const parts = path.split(".");
  let cur: Record<string | number, unknown> = clone as Record<string | number, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    const k: string | number = /^\d+$/.test(parts[i]) ? Number(parts[i]) : parts[i];
    cur = cur[k] as Record<string | number, unknown>;
  }
  const last: string | number = /^\d+$/.test(parts[parts.length - 1]) ? Number(parts[parts.length - 1]) : parts[parts.length - 1];
  cur[last] = value;
  return clone;
}

function buildSectionFromManifest(sectionKey: string, fields: ManifestField[]): unknown {
  const sectionFields = fields.filter(f => f.id.startsWith(sectionKey + "."));
  const paths = sectionFields.map(f => f.id.slice(sectionKey.length + 1));
  const isArray = paths.some(p => /^\d+/.test(p));

  if (isArray) {
    const items: Record<number, Record<string, string>> = {};
    for (const f of sectionFields) {
      const path = f.id.slice(sectionKey.length + 1);
      const match = path.match(/^(\d+)\.(.+)$/);
      if (match) {
        const idx = Number(match[1]);
        if (!items[idx]) items[idx] = {};
        items[idx][match[2]] = f.value;
      }
    }
    return Object.keys(items).sort((a, b) => Number(a) - Number(b)).map(k => items[Number(k)]);
  }

  const obj: Record<string, string> = {};
  for (const f of sectionFields) {
    const path = f.id.slice(sectionKey.length + 1);
    obj[path] = f.value;
  }
  return obj;
}

function formatSectionKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function fieldLabel(path: string): string {
  const last = path.split(".").pop() || path;
  return LABEL_MAP[last] || last;
}

/* ── 이력 모달 ── */
function HistoryModal({ site, contentId, onRevert, onClose }: {
  site: string; contentId: number; onRevert: (data: unknown) => void; onClose: () => void;
}) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<HistoryEntry[]>(`/api/admin/${site}/contents/${contentId}/history`)
      .then(setHistory).catch(() => setHistory([])).finally(() => setLoading(false));
  }, [site, contentId]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[520px] max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">수정 이력</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? <p className="text-gray-400 text-center py-8">불러오는 중...</p> :
           history.length === 0 ? <p className="text-gray-400 text-center py-8">수정 이력이 없습니다</p> :
           <div className="space-y-3">
            {history.map(h => {
              let parsed: unknown;
              try { parsed = JSON.parse(h.bodyHtml); } catch { parsed = h.bodyHtml; }
              const summary = JSON.stringify(parsed, null, 2).slice(0, 200);
              return (
                <div key={h.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{new Date(h.editedAt).toLocaleString("ko-KR")}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setPreview(preview === String(h.id) ? null : String(h.id))}
                        className="text-xs text-gray-500 hover:text-gray-800 px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-50">
                        {preview === String(h.id) ? "접기" : "미리보기"}
                      </button>
                      <button onClick={() => { onRevert(parsed); onClose(); }}
                        className="text-xs text-blue-600 hover:text-blue-800 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-50">
                        이 버전으로 되돌리기
                      </button>
                    </div>
                  </div>
                  {preview === String(h.id) && (
                    <pre className="text-xs text-gray-600 bg-gray-50 rounded p-2 mt-2 overflow-x-auto whitespace-pre-wrap break-all max-h-40">{summary}...</pre>
                  )}
                </div>
              );
            })}
           </div>
          }
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   메인 — 제네릭 페이지 편집기 (사이트 공용)
   ══════════════════════════════════════════════════ */
export default function PageEditor({ site, presetPages, previewBaseUrl }: PageEditorProps) {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  const t = THEME[site];

  const [menuPages, setMenuPages] = useState<{ label: string; path: string }[]>([]);
  const pages = (() => {
    const src = menuPages.length > 0 ? menuPages : presetPages;
    const seen = new Set<string>();
    return src.filter(p => { if (seen.has(p.path)) return false; seen.add(p.path); return true; });
  })();

  const [pageUrl, setPageUrl] = useState(presetPages[0].path);
  const [urlInput, setUrlInput] = useState(presetPages[0].path);

  const [manifest, setManifest] = useState<ManifestField[]>([]);
  const [sectionData, setSectionData] = useState<Record<string, unknown>>({});
  const [contentIds, setContentIds] = useState<Record<string, number>>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [historyTarget, setHistoryTarget] = useState<string | null>(null);

  const sections = useMemo<SectionGroup[]>(() => {
    const map = new Map<string, ManifestField[]>();
    for (const f of manifest) {
      const key = f.id.split(".")[0];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    }
    return Array.from(map.entries()).map(([key, fields]) => ({ key, fields }));
  }, [manifest]);

  const loadPage = useCallback((path: string) => {
    setPageUrl(path);
    setUrlInput(path);
    setManifest([]);
    setLoaded(false);
    loadedRef.current = false;
    setDirty(new Set());
    if (iframeRef.current) {
      iframeRef.current.src = `${previewBaseUrl}${path}?_edit=1&t=${Date.now()}`;
    }
  }, [previewBaseUrl]);

  /* ── DB 메뉴에서 페이지 목록 자동 로드 ── */
  useEffect(() => {
    let cancelled = false;
    apiFetch<MenuItemRaw[]>(`/api/admin/${site}/menus`)
      .then(data => {
        if (cancelled) return;
        const items = flattenMenuPages(data);
        if (items.length > 0) {
          setMenuPages(items);
          // 첫 페이지가 현재와 다르면 자동 전환
          if (items[0].path !== pageUrl) {
            loadPage(items[0].path);
          }
        }
      })
      .catch(() => { /* 메뉴 로드 실패 시 preset fallback 사용 */ });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site]);

  const loadSectionData = useCallback(async (keys: string[]) => {
    try {
      const contents = await apiFetch<ContentResponse[]>(`/api/admin/${site}/contents`);
      const data: Record<string, unknown> = {};
      const ids: Record<string, number> = {};
      for (const key of keys) {
        const found = contents.find(c => c.regionKey === key);
        if (found) {
          ids[key] = found.id;
          try { data[key] = JSON.parse(found.bodyHtml); } catch { /* ignore */ }
        }
      }
      setSectionData(prev => ({ ...prev, ...data }));
      setContentIds(prev => ({ ...prev, ...ids }));
    } catch { /* 오류 시 매니페스트에서 구성 */ }
  }, [site]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "editable-manifest") {
        const fields = e.data.fields as ManifestField[];
        const newPath = e.data.path as string | undefined;
        if (newPath) {
          setPageUrl(newPath);
          setUrlInput(newPath);
        }
        setSectionData({});
        setContentIds({});
        setDirty(new Set());
        setManifest(fields);
        setLoaded(true);
        loadedRef.current = true;
        const keys = Array.from(new Set(fields.map(f => f.id.split(".")[0])));
        loadSectionData(keys);
      }
      if (e.data?.type === "field-click" && e.data.id) {
        const fieldEl = panelRef.current?.querySelector(`[data-field-id="${e.data.id}"]`);
        if (fieldEl) {
          fieldEl.scrollIntoView({ behavior: "smooth", block: "center" });
          (fieldEl as HTMLElement).style.outline = `2px solid ${t.highlightColor}`;
          (fieldEl as HTMLElement).style.outlineOffset = "4px";
          setTimeout(() => { (fieldEl as HTMLElement).style.outline = ""; (fieldEl as HTMLElement).style.outlineOffset = ""; }, 2000);
          const input = fieldEl.querySelector("input, textarea") as HTMLElement;
          if (input) input.focus();
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [loadSectionData, t.highlightColor]);

  /* iframe 로드 완료 시 manifest 재요청 (반복 폴링으로 타이밍 문제 방지) */
  const handleIframeLoad = useCallback(() => {
    let attempts = 0;
    const maxAttempts = 8;
    const poll = () => {
      if (!iframeRef.current || attempts >= maxAttempts || loadedRef.current) return;
      attempts++;
      try {
        iframeRef.current.contentWindow?.postMessage({ type: "request-manifest" }, "*");
      } catch { /* cross-origin 접근 실패 무시 */ }
      setTimeout(poll, 500);
    };
    setTimeout(poll, 600);
  }, []);

  const getFieldValue = useCallback((fieldId: string): string => {
    const sectionKey = fieldId.split(".")[0];
    const path = fieldId.slice(sectionKey.length + 1);
    const data = sectionData[sectionKey];
    if (data) {
      const v = deepGet(data, path);
      if (v !== undefined) return v;
    }
    return manifest.find(f => f.id === fieldId)?.value ?? "";
  }, [sectionData, manifest]);

  const updateField = useCallback((fieldId: string, newValue: string) => {
    const sectionKey = fieldId.split(".")[0];
    const fieldPath = fieldId.slice(sectionKey.length + 1);

    setSectionData(prev => {
      let current = prev[sectionKey];
      if (!current) {
        current = buildSectionFromManifest(sectionKey, manifest);
      }
      const updated = deepSet(current, fieldPath, newValue);
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "content-update", section: sectionKey, data: updated }, "*"
        );
      }, 0);
      return { ...prev, [sectionKey]: updated };
    });

    setManifest(prev => prev.map(f => f.id === fieldId ? { ...f, value: newValue } : f));
    setDirty(prev => new Set(prev).add(sectionKey));
  }, [manifest]);

  const saveSection = useCallback(async (sectionKey: string) => {
    const data = sectionData[sectionKey];
    if (!data) return;
    setSaving(sectionKey);
    try {
      const res = await apiFetch<ContentResponse>(`/api/admin/${site}/contents`, {
        method: "PUT",
        body: JSON.stringify({ menuId: null, regionKey: sectionKey, title: sectionKey, bodyHtml: JSON.stringify(data) }),
      });
      setContentIds(prev => ({ ...prev, [sectionKey]: res.id }));
      setDirty(prev => { const n = new Set(prev); n.delete(sectionKey); return n; });
      toast("success", `${formatSectionKey(sectionKey)} 저장됨`);
    } catch { toast("error", "저장 실패"); }
    finally { setSaving(null); }
  }, [site, sectionData, toast]);

  const saveAll = useCallback(async () => {
    const dirtyKeys = Array.from(dirty);
    if (dirtyKeys.length === 0) { toast("success", "변경사항이 없습니다"); return; }
    setSaving("all");
    try {
      for (const key of dirtyKeys) {
        const data = sectionData[key];
        if (!data) continue;
        const res = await apiFetch<ContentResponse>(`/api/admin/${site}/contents`, {
          method: "PUT",
          body: JSON.stringify({ menuId: null, regionKey: key, title: key, bodyHtml: JSON.stringify(data) }),
        });
        setContentIds(prev => ({ ...prev, [key]: res.id }));
      }
      setDirty(new Set());
      toast("success", "모든 변경사항 저장됨");
    } catch { toast("error", "저장 중 오류 발생"); }
    finally { setSaving(null); }
  }, [site, dirty, sectionData, toast]);

  const handleHistoryRevert = useCallback((sectionKey: string, historyData: unknown) => {
    setSectionData(prev => ({ ...prev, [sectionKey]: historyData }));
    iframeRef.current?.contentWindow?.postMessage(
      { type: "content-update", section: sectionKey, data: historyData }, "*"
    );
    setDirty(prev => new Set(prev).add(sectionKey));
    toast("success", "이전 버전 불러옴 — 저장하면 적용됩니다.");
  }, [toast]);

  const renderField = useCallback((field: ManifestField) => {
    const path = field.id.split(".").slice(1).join(".");
    const value = getFieldValue(field.id);
    const lastSegment = field.id.split(".").pop() || "";
    const isTextarea = TEXTAREA_HINTS.has(lastSegment) || value.length > 60;

    return (
      <div key={field.id} data-field-id={field.id} className="mb-3">
        <label className="block text-xs font-medium text-gray-500 mb-1">{fieldLabel(path)}</label>
        {field.type === "image" ? (
          <ImageUploadField value={value} onChange={url => updateField(field.id, url)} site={site} />
        ) : isTextarea ? (
          <textarea value={value} onChange={e => updateField(field.id, e.target.value)} rows={2}
            className={`w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 ${t.focusRing}`} />
        ) : (
          <input type="text" value={value} onChange={e => updateField(field.id, e.target.value)}
            className={`w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 ${t.focusRing}`} />
        )}
      </div>
    );
  }, [site, t.focusRing, getFieldValue, updateField]);

  const renderSection = useCallback((section: SectionGroup) => {
    const paths = section.fields.map(f => f.id.slice(section.key.length + 1));
    const isArray = paths.some(p => /^\d+\./.test(p));

    if (isArray) {
      const items = new Map<number, ManifestField[]>();
      for (const f of section.fields) {
        const path = f.id.slice(section.key.length + 1);
        const match = path.match(/^(\d+)\.(.*)/);
        if (match) {
          const idx = Number(match[1]);
          if (!items.has(idx)) items.set(idx, []);
          items.get(idx)!.push(f);
        } else {
          if (!items.has(-1)) items.set(-1, []);
          items.get(-1)!.push(f);
        }
      }
      return (
        <div className="space-y-2">
          {Array.from(items.entries()).sort(([a], [b]) => a - b).map(([idx, fields]) => (
            <div key={idx} className="border border-gray-200 rounded p-3 bg-gray-50">
              {idx >= 0 && <p className="text-xs font-bold text-gray-400 mb-2">#{idx + 1}</p>}
              {fields.map(f => renderField(f))}
            </div>
          ))}
        </div>
      );
    }

    return <div>{section.fields.map(f => renderField(f))}</div>;
  }, [renderField]);

  return (
    <div className="flex" style={{ height: "calc(100vh - 56px)", margin: "-24px" }}>
      {/* 왼쪽: 미리보기 */}
      <div className="flex-1 border-r border-gray-200 flex flex-col bg-gray-100" style={{ minWidth: 0, overflow: "hidden" }}>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex items-center gap-2 ml-2">
            <span className="text-xs text-gray-400 font-mono shrink-0">{previewBaseUrl}</span>
            <input
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") loadPage(urlInput); }}
              className={`flex-1 text-xs font-mono border border-gray-200 rounded px-2 py-1 focus:ring-1 ${t.focusRing}`}
              placeholder="/company"
            />
            <button onClick={() => loadPage(urlInput)}
              className={`text-xs px-3 py-1 rounded font-medium shrink-0 ${t.btnPrimary}`}>열기</button>
          </div>
          <button onClick={() => loadPage(pageUrl)}
            className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100 shrink-0">↻</button>
        </div>
        <div className="flex items-center gap-1 px-4 py-1.5 bg-gray-50 border-b border-gray-200 shrink-0 overflow-x-auto">
          {pages.map(p => (
            <button key={p.path} onClick={() => loadPage(p.path)}
              className={`text-xs px-3 py-1 rounded transition-colors whitespace-nowrap ${pageUrl === p.path ? t.tabActive : "text-gray-600 hover:bg-gray-200"}`}>
              {p.label}
            </button>
          ))}
        </div>
        <iframe ref={iframeRef} src={`${previewBaseUrl}${pageUrl}?_edit=1`}
          className="flex-1 w-full bg-white" style={{ border: "none" }} title="미리보기"
          onLoad={handleIframeLoad} />
      </div>

      {/* 오른쪽: 편집 패널 */}
      <div ref={panelRef} className="overflow-y-auto" style={{ width: 460, minWidth: 460, flexShrink: 0 }}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-lg font-bold text-gray-900">페이지 편집</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {loaded ? `${sections.length}개 섹션 · ${manifest.length}개 필드` : "페이지 로딩 중..."}
                {dirty.size > 0 && <span className="ml-2 text-amber-600">· {dirty.size}개 미저장</span>}
              </p>
            </div>
            {dirty.size > 0 && (
              <button onClick={saveAll} disabled={saving !== null}
                className={`px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50 ${t.btnPrimary}`}>
                {saving === "all" ? "저장 중..." : "전체 저장"}
              </button>
            )}
          </div>

          {!loaded && (
            <div className="text-center py-16">
              <div className={`w-8 h-8 border-2 border-gray-300 ${t.spinner} rounded-full animate-spin mx-auto mb-4`} />
              <p className="text-sm text-gray-500">페이지에서 편집 가능한 필드를 감지하는 중...</p>
              <p className="text-xs text-gray-400 mt-1">페이지에 EditableText가 없으면 필드가 표시되지 않습니다</p>
            </div>
          )}

          {loaded && sections.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">이 페이지에 편집 가능한 필드가 없습니다</p>
              <p className="text-xs text-gray-400">프론트에서 E / OptImg 컴포넌트로 마킹된 영역만 표시됩니다</p>
            </div>
          )}

          {loaded && sections.length > 0 && (
            <div className="space-y-4">
              {sections.map(section => (
                <div key={section.key} className="border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-gray-800">{formatSectionKey(section.key)}</h2>
                      <span className="text-[10px] text-gray-400 font-mono">{section.key}</span>
                      {dirty.has(section.key) && <span className="w-2 h-2 rounded-full bg-amber-400" title="미저장" />}
                    </div>
                    <div className="flex items-center gap-1">
                      {contentIds[section.key] && (
                        <button onClick={() => setHistoryTarget(section.key)} title="수정 이력"
                          className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded">이력</button>
                      )}
                      <button onClick={() => saveSection(section.key)} disabled={saving !== null || !dirty.has(section.key)}
                        className={`px-2.5 py-1 text-xs rounded disabled:opacity-40 font-medium ${t.btnSave}`}>
                        {saving === section.key ? "..." : "저장"}
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    {renderSection(section)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {historyTarget && contentIds[historyTarget] && (
        <HistoryModal
          site={site}
          contentId={contentIds[historyTarget]}
          onRevert={d => handleHistoryRevert(historyTarget, d)}
          onClose={() => setHistoryTarget(null)}
        />
      )}
    </div>
  );
}
