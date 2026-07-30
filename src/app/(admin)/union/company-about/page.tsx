"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { useToast, ToastProvider } from "@/components/Toast";

/* ── 타입 ── */
interface ContentResponse {
  id: number;
  regionKey: string;
  bodyHtml: string;
}

interface SectionDef<T> {
  key: string;
  label: string;
  default: T;
}

/* ── 섹션 정의 ── */
const SECTIONS: SectionDef<unknown>[] = [
  {
    key: "company_hero",
    label: "히어로 섹션",
    default: {
      title: "복잡한 기업 IT를",
      accent: "하나로 연결",
      desc: "열정과 전문성을 바탕으로 소프트웨어 유통은 물론, 보안 및 데이터 사업까지 확대하며 제2의 도약을 실현해 가고 있습니다.",
    },
  },
  {
    key: "company_overview",
    label: "회사 개요",
    default: {
      title: "IT Solution & Consulting 전문기업",
      text: "주식회사 유니온시스템즈는 2010년 4월 유니온소프트를 시작으로 기업·공공기관을 대상으로 고객의 IT 환경에 필요한 SW, 솔루션을 공급하여 최적의 IT 인프라를 만들어 온 IT Solution & Consulting 전문기업입니다.",
    },
  },
  {
    key: "company_stats",
    label: "통계 숫자",
    default: [
      { num: "16", label: "년 업력" },
      { num: "200+", label: "고객사" },
      { num: "4", label: "전문 사업부" },
      { num: "50+", label: "파트너사" },
    ],
  },
  {
    key: "company_strengths",
    label: "강점 카드",
    default: [
      { img: "/images/crawl/unionsystems/sub_unionsystems_point_01_24.jpg", title: "보안", desc: "안랩, 이스트소프트, 오피스키퍼 등 기업용 PC 통합보안 전문 솔루션을 구축, 운영합니다." },
      { img: "/images/crawl/unionsystems/sub_unionsystems_point_02_25.jpg", title: "자산관리", desc: "넷클라이언트 등 기업 IT환경에 적합한 SW, HW 자산관리를 지원합니다." },
      { img: "/images/crawl/unionsystems/sub_unionsystems_point_03_26.jpg", title: "데이터", desc: "엔코아의 DA# 공인총판으로 데이터모델링 툴의 유통, 기술지원, 교육을 지원합니다." },
      { img: "/images/crawl/unionsystems/sub_unionsystems_point_04_27.jpg", title: "글로벌 파트너십", desc: "Microsoft, Adobe, Autodesk 등 글로벌 소프트웨어 공식 파트너로서 정품 라이선스를 공급합니다." },
    ],
  },
  {
    key: "company_values",
    label: "핵심 가치",
    default: [
      { num: "01", title: "신뢰", desc: "2010년부터 축적된 경험과 200여 개 고객사의 검증된 파트너십으로 변함없는 신뢰를 드립니다." },
      { num: "02", title: "전문성", desc: "소프트웨어, 보안, 데이터, 자산관리 각 분야 전문가로 구성된 소수정예 팀이 최적의 솔루션을 제공합니다." },
      { num: "03", title: "파트너십", desc: "단순 공급이 아닌 도입부터 운영, 유지보수까지 전 과정을 함께하는 진정한 IT 파트너가 되겠습니다." },
    ],
  },
  {
    key: "company_depts",
    label: "부서 정보",
    default: [
      { name: "솔루션사업부", desc: "DATA / SW / SI 사업팀" },
      { name: "영업부", desc: "공공영업 / 기업영업 / 교육영업" },
      { name: "서비스사업부", desc: "기술지원 팀" },
      { name: "사업지원부", desc: "리뉴얼 / 마케팅 / 영업지원" },
    ],
  },
  {
    key: "company_org",
    label: "조직 섹션",
    default: {
      img: "/images/crawl/unionsystems/about_organization_chart_30.jpg",
      title: "소수정예 전문가 조직",
      text: "각 분야의 전문가들이 고객의 IT 환경을 책임집니다.",
    },
  },
  {
    key: "company_ci",
    label: "CI / CEO 인용",
    default: {
      img: "/images/crawl/unionsystems/about_ci_31.jpg",
      title: "기업 아이덴티티",
      subtitle: "UNION RED는 고객을 향한 열정을 담고 있습니다",
      quote: "고객과 신뢰로 만들어진 유니온시스템즈,\n함께 구축하겠다는 열정을 담고 있습니다.",
      ceo: "CEO 홍민석",
    },
  },
  {
    key: "company_cta",
    label: "CTA 섹션",
    default: {
      title: "유니온시스템즈와 함께 시작하세요",
      desc: "귀사의 IT 환경에 최적화된 솔루션을 제안해 드립니다.",
    },
  },
];

const PREVIEW_URL =
  process.env.NEXT_PUBLIC_UNION_URL || "http://localhost:3000";

/* ── 필드 렌더 ── */
function ObjectFields({
  data,
  onChange,
}: {
  data: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  const LABEL_MAP: Record<string, string> = {
    title: "제목", accent: "강조 텍스트", desc: "설명", text: "본문",
    subtitle: "부제", quote: "인용문", ceo: "CEO", img: "이미지 URL",
    num: "숫자", label: "라벨", name: "이름",
  };
  return (
    <div className="space-y-3">
      {Object.entries(data).map(([k, v]) => (
        <div key={k}>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {LABEL_MAP[k] || k}
          </label>
          {(k === "desc" || k === "text" || k === "quote") ? (
            <textarea
              value={v}
              onChange={(e) => onChange(k, e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          ) : (
            <input
              type="text"
              value={v}
              onChange={(e) => onChange(k, e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ArrayFields({
  data,
  onChange,
}: {
  data: Record<string, string>[];
  onChange: (idx: number, key: string, val: string) => void;
}) {
  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="border border-gray-200 rounded p-3 bg-gray-50">
          <p className="text-xs font-bold text-gray-400 mb-2">#{idx + 1}</p>
          <ObjectFields
            data={item}
            onChange={(k, v) => onChange(idx, k, v)}
          />
        </div>
      ))}
    </div>
  );
}

/* ── 메인 ── */
function CompanyAboutEditor() {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const refreshPreview = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = `${PREVIEW_URL}/company?t=${Date.now()}`;
    }
  }, []);

  // 초기 로딩
  useEffect(() => {
    apiFetch<ContentResponse[]>("/api/admin/union/contents")
      .then((contents) => {
        const map: Record<string, unknown> = {};
        for (const section of SECTIONS) {
          const found = contents.find((c) => c.regionKey === section.key);
          if (found?.bodyHtml) {
            try {
              map[section.key] = JSON.parse(found.bodyHtml);
            } catch {
              map[section.key] = section.default;
            }
          } else {
            map[section.key] = section.default;
          }
        }
        setData(map);
      })
      .catch(() => {
        const map: Record<string, unknown> = {};
        for (const section of SECTIONS) {
          map[section.key] = section.default;
        }
        setData(map);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = useCallback(
    async (sectionKey: string) => {
      setSaving(sectionKey);
      try {
        await apiFetch("/api/admin/union/contents", {
          method: "PUT",
          body: JSON.stringify({
            menuId: 0,
            regionKey: sectionKey,
            title: sectionKey,
            bodyHtml: JSON.stringify(data[sectionKey]),
          }),
        });
        toast("success", "저장되었습니다");
        refreshPreview();
      } catch {
        toast("error", "저장에 실패했습니다");
      } finally {
        setSaving(null);
      }
    },
    [data, toast, refreshPreview]
  );

  const handleSaveAll = useCallback(async () => {
    setSaving("all");
    try {
      for (const section of SECTIONS) {
        await apiFetch("/api/admin/union/contents", {
          method: "PUT",
          body: JSON.stringify({
            menuId: 0,
            regionKey: section.key,
            title: section.key,
            bodyHtml: JSON.stringify(data[section.key]),
          }),
        });
      }
      toast("success", "모든 섹션이 저장되었습니다");
      refreshPreview();
    } catch {
      toast("error", "저장 중 오류가 발생했습니다");
    } finally {
      setSaving(null);
    }
  }, [data, toast, refreshPreview]);

  const updateObject = useCallback(
    (sectionKey: string, fieldKey: string, value: string) => {
      setData((prev) => ({
        ...prev,
        [sectionKey]: { ...(prev[sectionKey] as Record<string, string>), [fieldKey]: value },
      }));
    },
    []
  );

  const updateArray = useCallback(
    (sectionKey: string, idx: number, fieldKey: string, value: string) => {
      setData((prev) => {
        const arr = [...(prev[sectionKey] as Record<string, string>[])];
        arr[idx] = { ...arr[idx], [fieldKey]: value };
        return { ...prev, [sectionKey]: arr };
      });
    },
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="flex" style={{ height: "calc(100vh - 56px)", margin: "-24px" }}>
      {/* ── 왼쪽: 실제 페이지 미리보기 ── */}
      <div className="flex-1 border-r border-gray-200 flex flex-col bg-gray-100">
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-2 text-xs text-gray-400 font-mono">
              {PREVIEW_URL}/company
            </span>
          </div>
          <button
            onClick={refreshPreview}
            className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100"
          >
            ↻ 새로고침
          </button>
        </div>
        <iframe
          ref={iframeRef}
          src={`${PREVIEW_URL}/company`}
          className="flex-1 w-full bg-white"
          style={{ border: "none" }}
          title="회사소개 미리보기"
        />
      </div>

      {/* ── 오른쪽: 편집 폼 ── */}
      <div className="overflow-y-auto" style={{ width: 440 }}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-lg font-bold text-gray-900">회사소개 편집</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                저장하면 왼쪽 미리보기에 즉시 반영
              </p>
            </div>
            <button
              onClick={handleSaveAll}
              disabled={saving !== null}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving === "all" ? "저장 중..." : "전체 저장"}
            </button>
          </div>

          <div className="space-y-4">
            {SECTIONS.map((section) => {
              const value = data[section.key];
              const isArray = Array.isArray(value);

              return (
                <div
                  key={section.key}
                  className="border border-gray-200 rounded-lg bg-white p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-800">
                      {section.label}
                    </h2>
                    <button
                      onClick={() => handleSave(section.key)}
                      disabled={saving !== null}
                      className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                      {saving === section.key ? "..." : "저장"}
                    </button>
                  </div>

                  {isArray ? (
                    <ArrayFields
                      data={value as Record<string, string>[]}
                      onChange={(idx, k, v) => updateArray(section.key, idx, k, v)}
                    />
                  ) : (
                    <ObjectFields
                      data={value as Record<string, string>}
                      onChange={(k, v) => updateObject(section.key, k, v)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
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
