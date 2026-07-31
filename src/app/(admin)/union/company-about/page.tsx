"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { useToast, ToastProvider } from "@/components/Toast";
import ImageUploadField from "@/components/ImageUploadField";

/* ── 타입 ── */
interface ContentResponse { id: number; regionKey: string; bodyHtml: string; }
interface HistoryEntry { id: number; contentId: number; bodyHtml: string; editedBy: number; editedAt: string; }

interface SectionDef<T> { key: string; label: string; default: T; itemTemplate?: Record<string, string>; }

/* ── 페이지 정의 ── */
interface PageDef { id: string; label: string; path: string; sections: SectionDef<unknown>[]; }

const COMPANY_SECTIONS: SectionDef<unknown>[] = [
  { key: "company_hero", label: "히어로 섹션", default: { title: "복잡한 기업 IT를", accent: "하나로 연결", desc: "열정과 전문성을 바탕으로 소프트웨어 유통은 물론, 보안 및 데이터 사업까지 확대하며 제2의 도약을 실현해 가고 있습니다." } },
  { key: "company_overview", label: "회사 개요", default: { title: "IT Solution & Consulting 전문기업", text: "주식회사 유니온시스템즈는 2010년 4월 유니온소프트를 시작으로 기업·공공기관을 대상으로 고객의 IT 환경에 필요한 SW, 솔루션을 공급하여 최적의 IT 인프라를 만들어 온 IT Solution & Consulting 전문기업입니다." } },
  { key: "company_stats", label: "통계 숫자", default: [{ num: "16", label: "년 업력" }, { num: "200+", label: "고객사" }, { num: "4", label: "전문 사업부" }, { num: "50+", label: "파트너사" }], itemTemplate: { num: "", label: "" } },
  { key: "company_strengths", label: "강점 카드", default: [
    { img: "/images/crawl/unionsystems/sub_unionsystems_point_01_24.jpg", title: "보안", desc: "안랩, 이스트소프트, 오피스키퍼 등 기업용 PC 통합보안 전문 솔루션을 구축, 운영합니다." },
    { img: "/images/crawl/unionsystems/sub_unionsystems_point_02_25.jpg", title: "자산관리", desc: "넷클라이언트 등 기업 IT환경에 적합한 SW, HW 자산관리를 지원합니다." },
    { img: "/images/crawl/unionsystems/sub_unionsystems_point_03_26.jpg", title: "데이터", desc: "엔코아의 DA# 공인총판으로 데이터모델링 툴의 유통, 기술지원, 교육을 지원합니다." },
    { img: "/images/crawl/unionsystems/sub_unionsystems_point_04_27.jpg", title: "글로벌 파트너십", desc: "Microsoft, Adobe, Autodesk 등 글로벌 소프트웨어 공식 파트너로서 정품 라이선스를 공급합니다." },
  ], itemTemplate: { img: "", title: "", desc: "" } },
  { key: "company_values", label: "핵심 가치", default: [
    { num: "01", title: "신뢰", desc: "2010년부터 축적된 경험과 200여 개 고객사의 검증된 파트너십으로 변함없는 신뢰를 드립니다." },
    { num: "02", title: "전문성", desc: "소프트웨어, 보안, 데이터, 자산관리 각 분야 전문가로 구성된 소수정예 팀이 최적의 솔루션을 제공합니다." },
    { num: "03", title: "파트너십", desc: "단순 공급이 아닌 도입부터 운영, 유지보수까지 전 과정을 함께하는 진정한 IT 파트너가 되겠습니다." },
  ], itemTemplate: { num: "", title: "", desc: "" } },
  { key: "company_depts", label: "부서 정보", default: [{ name: "솔루션사업부", desc: "DATA / SW / SI 사업팀" }, { name: "영업부", desc: "공공영업 / 기업영업 / 교육영업" }, { name: "서비스사업부", desc: "기술지원 팀" }, { name: "사업지원부", desc: "리뉴얼 / 마케팅 / 영업지원" }], itemTemplate: { name: "", desc: "" } },
  { key: "company_org", label: "조직 섹션", default: { img: "/images/crawl/unionsystems/about_organization_chart_30.jpg", title: "소수정예 전문가 조직", text: "각 분야의 전문가들이 고객의 IT 환경을 책임집니다." } },
  { key: "company_ci", label: "CI / CEO 인용", default: { img: "/images/crawl/unionsystems/about_ci_31.jpg", title: "기업 아이덴티티", subtitle: "UNION RED는 고객을 향한 열정을 담고 있습니다", quote: "고객과 신뢰로 만들어진 유니온시스템즈,\n함께 구축하겠다는 열정을 담고 있습니다.", ceo: "CEO 홍민석" } },
  { key: "company_cta", label: "CTA 섹션", default: { title: "유니온시스템즈와 함께 시작하세요", desc: "귀사의 IT 환경에 최적화된 솔루션을 제안해 드립니다." } },
];

const LOCATION_SECTIONS: SectionDef<unknown>[] = [
  { key: "location_hero", label: "히어로 섹션", default: { title: "오시는 길", subtitle: "서울 성수동에서 여러분을 기다리고 있습니다." } },
  { key: "location_address", label: "주소", default: { line1: "서울시 성동구 아차산로17길 49", line2: "1209~1210호 (성수동2가, 생각공장데시앙플렉스)", mapNote: "성수역 3번 출구 도보 5분" } },
  { key: "location_contact", label: "연락처 / 운영시간", default: { tel: "02-706-8999", fax: "02-706-8990", emailSales: "sales@unionsystems.co.kr", emailGeneral: "ud@unionsystems.co.kr", hours: "09:00 – 18:00", hoursNote: "평일 운영 · 점심 12:00–13:00 · 주말/공휴일 휴무" } },
  { key: "location_subway", label: "교통 — 지하철", default: [{ line: "2호선 성수역", desc: "3번 출구 도보 5분" }, { line: "수인분당선 서울숲역", desc: "4번 출구 도보 10분" }], itemTemplate: { line: "", desc: "" } },
  { key: "location_bus", label: "교통 — 버스", default: [{ type: "간선버스", routes: "141, 148, 302, 421" }, { type: "지선버스", routes: "2016, 2224, 2413" }], itemTemplate: { type: "", routes: "" } },
  { key: "location_parking", label: "교통 — 주차", default: { title: "건물 내 지하주차장", desc: "방문 시 안내데스크 문의" } },
  { key: "location_cta", label: "CTA 문구", default: { text: "방문 전 사전 연락을 부탁드립니다." } },
];

const PAGES: PageDef[] = [
  { id: "company", label: "기업소개", path: "/company", sections: COMPANY_SECTIONS },
  { id: "location", label: "오시는 길", path: "/company/location", sections: LOCATION_SECTIONS },
];

const IMAGE_FIELDS = new Set(["img"]);
const TEXTAREA_FIELDS = new Set(["desc", "text", "quote"]);
const LABEL_MAP: Record<string, string> = {
  title: "제목", accent: "강조 텍스트", desc: "설명", text: "본문",
  subtitle: "부제", quote: "인용문", ceo: "CEO", img: "이미지",
  num: "숫자", label: "라벨", name: "이름",
  line1: "주소 1줄", line2: "주소 2줄", mapNote: "지도 안내문",
  tel: "전화", fax: "팩스", emailSales: "영업 이메일", emailGeneral: "대표 이메일",
  hours: "운영시간", hoursNote: "운영 안내", line: "노선", type: "종류", routes: "노선번호",
};
const PREVIEW_URL = process.env.NEXT_PUBLIC_UNION_URL || "http://localhost:3000";

/* ── 이력 모달 ── */
function HistoryModal({ contentId, onRevert, onClose }: {
  contentId: number; onRevert: (data: unknown) => void; onClose: () => void;
}) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<HistoryEntry[]>(`/api/admin/union/contents/${contentId}/history`)
      .then(setHistory).catch(() => setHistory([])).finally(() => setLoading(false));
  }, [contentId]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[520px] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">수정 이력</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? <p className="text-gray-400 text-center py-8">불러오는 중...</p> :
           history.length === 0 ? <p className="text-gray-400 text-center py-8">아직 수정 이력이 없습니다</p> :
           <div className="space-y-3">
            {history.map((h) => {
              let parsed: unknown;
              try { parsed = JSON.parse(h.bodyHtml); } catch { parsed = h.bodyHtml; }
              const summary = JSON.stringify(parsed, null, 2).slice(0, 200);
              return (
                <div key={h.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {new Date(h.editedAt).toLocaleString("ko-KR")}
                    </span>
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

/* ── 필드 렌더 ── */
function ObjectFields({ data, defaultData, sectionKey, onChange }: {
  data: Record<string, string>; defaultData?: Record<string, string>;
  sectionKey: string; onChange: (key: string, val: string) => void;
}) {
  return (
    <div className="space-y-3">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} data-field-id={`${sectionKey}.${k}`}>
          <label className="block text-xs font-medium text-gray-500 mb-1">{LABEL_MAP[k] || k}</label>
          {IMAGE_FIELDS.has(k) ? (
            <>
              <ImageUploadField value={v} onChange={(url) => onChange(k, url)} site="union" />
              {defaultData?.[k] && v !== defaultData[k] && (
                <button onClick={() => onChange(k, defaultData[k])} className="mt-1 text-xs text-blue-600 hover:text-blue-800">↩ 기존 이미지로 되돌리기</button>
              )}
            </>
          ) : TEXTAREA_FIELDS.has(k) ? (
            <textarea value={v} onChange={(e) => onChange(k, e.target.value)} rows={2}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
          ) : (
            <input type="text" value={v} onChange={(e) => onChange(k, e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
          )}
        </div>
      ))}
    </div>
  );
}

function ArrayFields({ data, defaultData, sectionKey, onChange, onAdd, onDelete, onMove }: {
  data: Record<string, string>[]; defaultData?: Record<string, string>[];
  sectionKey: string;
  onChange: (idx: number, key: string, val: string) => void;
  onAdd: () => void; onDelete: (idx: number) => void; onMove: (idx: number, dir: -1 | 1) => void;
}) {
  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="border border-gray-200 rounded p-3 bg-gray-50 relative">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-400">#{idx + 1}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => onMove(idx, -1)} disabled={idx === 0}
                className="text-xs px-1.5 py-0.5 text-gray-500 hover:bg-gray-200 rounded disabled:opacity-30" title="위로">▲</button>
              <button onClick={() => onMove(idx, 1)} disabled={idx === data.length - 1}
                className="text-xs px-1.5 py-0.5 text-gray-500 hover:bg-gray-200 rounded disabled:opacity-30" title="아래로">▼</button>
              <button onClick={() => { if (confirm(`#${idx + 1} 항목을 삭제할까요?`)) onDelete(idx); }}
                className="text-xs px-1.5 py-0.5 text-red-500 hover:bg-red-50 rounded" title="삭제">✕</button>
            </div>
          </div>
          <ObjectFields data={item} defaultData={defaultData?.[idx]} sectionKey={`${sectionKey}.${idx}`} onChange={(k, v) => onChange(idx, k, v)} />
        </div>
      ))}
      <button onClick={onAdd}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors">
        + 항목 추가
      </button>
    </div>
  );
}

/* ── 메인 ── */
function CompanyAboutEditor() {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(PAGES[0]);
  const [data, setData] = useState<Record<string, unknown>>({});
  const [contentIds, setContentIds] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [historyTarget, setHistoryTarget] = useState<string | null>(null);
  const [codeView, setCodeView] = useState<Set<string>>(new Set());

  const SECTIONS = activePage.sections;

  const toggleCode = useCallback((key: string) => {
    setCodeView((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const sendToPreview = useCallback((section: string, newData: unknown) => {
    iframeRef.current?.contentWindow?.postMessage({ type: "content-update", section, data: newData }, "*");
  }, []);

  const handleCodeEdit = useCallback((sectionKey: string, raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      setData((prev) => ({ ...prev, [sectionKey]: parsed }));
      sendToPreview(sectionKey, parsed);
    } catch { /* 유효한 JSON이 아니면 무시 */ }
  }, [sendToPreview]);

  // 초기 로딩 — 모든 페이지의 섹션을 한 번에 불러옴
  const allSections = PAGES.flatMap((p) => p.sections);
  useEffect(() => {
    apiFetch<ContentResponse[]>("/api/admin/union/contents")
      .then((contents) => {
        const map: Record<string, unknown> = {};
        const ids: Record<string, number> = {};
        for (const section of allSections) {
          const found = contents.find((c) => c.regionKey === section.key);
          if (found) {
            ids[section.key] = found.id;
            if (found.bodyHtml) {
              try { map[section.key] = JSON.parse(found.bodyHtml); } catch { map[section.key] = section.default; }
            } else { map[section.key] = section.default; }
          } else { map[section.key] = section.default; }
        }
        setData(map);
        setContentIds(ids);
      })
      .catch(() => {
        const map: Record<string, unknown> = {};
        for (const s of allSections) map[s.key] = s.default;
        setData(map);
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // field-click 수신
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "field-click" && e.data.id) {
        const fieldEl = formRef.current?.querySelector(`[data-field-id="${e.data.id}"]`);
        if (fieldEl) {
          fieldEl.scrollIntoView({ behavior: "smooth", block: "center" });
          (fieldEl as HTMLElement).style.outline = "2px solid #36c88a";
          (fieldEl as HTMLElement).style.outlineOffset = "4px";
          setTimeout(() => { (fieldEl as HTMLElement).style.outline = ""; (fieldEl as HTMLElement).style.outlineOffset = ""; }, 2000);
          const input = fieldEl.querySelector("input, textarea") as HTMLElement;
          if (input) input.focus();
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleSave = useCallback(async (sectionKey: string) => {
    setSaving(sectionKey);
    try {
      const res = await apiFetch<ContentResponse>("/api/admin/union/contents", {
        method: "PUT",
        body: JSON.stringify({ menuId: null, regionKey: sectionKey, title: sectionKey, bodyHtml: JSON.stringify(data[sectionKey]) }),
      });
      setContentIds((prev) => ({ ...prev, [sectionKey]: res.id }));
      toast("success", "저장되었습니다");
    } catch { toast("error", "저장에 실패했습니다"); }
    finally { setSaving(null); }
  }, [data, toast]);

  const handleSaveAll = useCallback(async () => {
    setSaving("all");
    try {
      for (const s of SECTIONS) {
        const res = await apiFetch<ContentResponse>("/api/admin/union/contents", {
          method: "PUT",
          body: JSON.stringify({ menuId: null, regionKey: s.key, title: s.key, bodyHtml: JSON.stringify(data[s.key]) }),
        });
        setContentIds((prev) => ({ ...prev, [s.key]: res.id }));
      }
      toast("success", "모든 섹션이 저장되었습니다");
    } catch { toast("error", "저장 중 오류가 발생했습니다"); }
    finally { setSaving(null); }
  }, [data, toast, SECTIONS]);

  const updateObject = useCallback((sectionKey: string, fieldKey: string, value: string) => {
    setData((prev) => {
      const updated = { ...(prev[sectionKey] as Record<string, string>), [fieldKey]: value };
      setTimeout(() => sendToPreview(sectionKey, updated), 0);
      return { ...prev, [sectionKey]: updated };
    });
  }, [sendToPreview]);

  const updateArray = useCallback((sectionKey: string, idx: number, fieldKey: string, value: string) => {
    setData((prev) => {
      const arr = [...(prev[sectionKey] as Record<string, string>[])];
      arr[idx] = { ...arr[idx], [fieldKey]: value };
      setTimeout(() => sendToPreview(sectionKey, arr), 0);
      return { ...prev, [sectionKey]: arr };
    });
  }, [sendToPreview]);

  const addArrayItem = useCallback((sectionKey: string, template: Record<string, string>) => {
    setData((prev) => {
      const arr = [...(prev[sectionKey] as Record<string, string>[]), { ...template }];
      setTimeout(() => sendToPreview(sectionKey, arr), 0);
      return { ...prev, [sectionKey]: arr };
    });
  }, [sendToPreview]);

  const deleteArrayItem = useCallback((sectionKey: string, idx: number) => {
    setData((prev) => {
      const arr = [...(prev[sectionKey] as Record<string, string>[])];
      arr.splice(idx, 1);
      setTimeout(() => sendToPreview(sectionKey, arr), 0);
      return { ...prev, [sectionKey]: arr };
    });
  }, [sendToPreview]);

  const moveArrayItem = useCallback((sectionKey: string, idx: number, dir: -1 | 1) => {
    setData((prev) => {
      const arr = [...(prev[sectionKey] as Record<string, string>[])];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      setTimeout(() => sendToPreview(sectionKey, arr), 0);
      return { ...prev, [sectionKey]: arr };
    });
  }, [sendToPreview]);

  const resetToDefault = useCallback((sectionKey: string) => {
    const section = SECTIONS.find((s) => s.key === sectionKey);
    if (!section || !confirm("기본값으로 되돌릴까요? (저장 전까지는 DB에 반영되지 않습니다)")) return;
    const defaultCopy = JSON.parse(JSON.stringify(section.default));
    setData((prev) => ({ ...prev, [sectionKey]: defaultCopy }));
    sendToPreview(sectionKey, defaultCopy);
  }, [sendToPreview, SECTIONS]);

  const handleHistoryRevert = useCallback((sectionKey: string, historyData: unknown) => {
    setData((prev) => ({ ...prev, [sectionKey]: historyData }));
    sendToPreview(sectionKey, historyData);
    toast("success", "이전 버전을 불러왔습니다. 저장하면 적용됩니다.");
  }, [sendToPreview, toast]);

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-gray-400">불러오는 중...</div>;
  }

  return (
    <div className="flex" style={{ height: "calc(100vh - 56px)", margin: "-24px" }}>
      {/* ── 왼쪽: 미리보기 ── */}
      <div className="flex-1 border-r border-gray-200 flex flex-col bg-gray-100">
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-2 text-xs text-gray-400 font-mono">{PREVIEW_URL}{activePage.path}</span>
          </div>
          <button onClick={() => { if (iframeRef.current) iframeRef.current.src = `${PREVIEW_URL}${activePage.path}?_edit=1&t=${Date.now()}`; }}
            className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100">↻ 새로고침</button>
        </div>
        <iframe ref={iframeRef} src={`${PREVIEW_URL}${activePage.path}?_edit=1`} className="flex-1 w-full bg-white" style={{ border: "none" }} title={`${activePage.label} 미리보기`} />
      </div>

      {/* ── 오른쪽: 편집 폼 ── */}
      <div ref={formRef} className="overflow-y-auto" style={{ width: 460 }}>
        <div className="p-5">
          {/* 페이지 선택 탭 */}
          <div className="flex gap-1 mb-4 border-b border-gray-200 pb-0">
            {PAGES.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  setActivePage(page);
                  setCodeView(new Set());
                  if (iframeRef.current) iframeRef.current.src = `${PREVIEW_URL}${page.path}?_edit=1&t=${Date.now()}`;
                }}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activePage.id === page.id
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{activePage.label} 편집</h1>
              <p className="text-xs text-gray-500 mt-0.5">실시간 미리보기 · 클릭→스크롤 · 이력 관리</p>
            </div>
            <button onClick={handleSaveAll} disabled={saving !== null}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50">
              {saving === "all" ? "저장 중..." : "전체 저장"}
            </button>
          </div>

          <div className="space-y-4">
            {SECTIONS.map((section) => {
              const value = data[section.key];
              const isArray = Array.isArray(value);
              const cId = contentIds[section.key];
              return (
                <div key={section.key} id={`section-${section.key}`} className="border border-gray-200 rounded-lg bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-800">{section.label}</h2>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleCode(section.key)} title="코드 보기"
                        className={`px-2 py-1 text-xs rounded ${codeView.has(section.key) ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                        &lt;/&gt;
                      </button>
                      <button onClick={() => resetToDefault(section.key)} title="기본값으로 되돌리기"
                        className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded">↩ 기본값</button>
                      {cId && (
                        <button onClick={() => setHistoryTarget(section.key)} title="수정 이력"
                          className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded">📋 이력</button>
                      )}
                      <button onClick={() => handleSave(section.key)} disabled={saving !== null}
                        className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100 disabled:opacity-50 font-medium">
                        {saving === section.key ? "..." : "저장"}
                      </button>
                    </div>
                  </div>
                  {codeView.has(section.key) ? (
                    /* ── 코드 보기 모드 ── */
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">저장될 값 (JSON)</span>
                        <span className="text-[10px] text-emerald-600">직접 편집 가능</span>
                      </div>
                      <textarea
                        value={JSON.stringify(value, null, 2)}
                        onChange={(e) => handleCodeEdit(section.key, e.target.value)}
                        spellCheck={false}
                        className="w-full font-mono text-xs leading-5 bg-gray-900 text-emerald-300 rounded-lg p-4 border-0 focus:ring-2 focus:ring-emerald-500 resize-y"
                        style={{ minHeight: 120, tabSize: 2 }}
                      />
                    </div>
                  ) : (
                    /* ── 폼 편집 모드 ── */
                    <>
                      {isArray ? (
                        <ArrayFields
                          data={value as Record<string, string>[]}
                          defaultData={section.default as Record<string, string>[]}
                          sectionKey={section.key}
                          onChange={(idx, k, v) => updateArray(section.key, idx, k, v)}
                          onAdd={() => addArrayItem(section.key, section.itemTemplate || {})}
                          onDelete={(idx) => deleteArrayItem(section.key, idx)}
                          onMove={(idx, dir) => moveArrayItem(section.key, idx, dir)}
                        />
                      ) : (
                        <ObjectFields data={value as Record<string, string>} defaultData={section.default as Record<string, string>}
                          sectionKey={section.key} onChange={(k, v) => updateObject(section.key, k, v)} />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 이력 모달 ── */}
      {historyTarget && contentIds[historyTarget] && (
        <HistoryModal
          contentId={contentIds[historyTarget]}
          onRevert={(d) => handleHistoryRevert(historyTarget, d)}
          onClose={() => setHistoryTarget(null)}
        />
      )}
    </div>
  );
}

export default function CompanyAboutPage() {
  return (
    <ToastProvider>
      <CompanyAboutEditor />
    </ToastProvider>
  );
}
