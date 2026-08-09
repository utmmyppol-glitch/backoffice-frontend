"use client";

import { useState } from "react";
import { CustomerStory } from "@/lib/types";
import useResource from "@/hooks/useResource";
import DataTable, { Column } from "./DataTable";
import Modal from "./Modal";
import ToggleSwitch from "./ToggleSwitch";
import ImageUploadField from "./ImageUploadField";
import CustomerStoryPreview from "./CustomerStoryPreview";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("./RichEditor"), { ssr: false });

interface CustomerStoryManagerProps {
  site: "union" | "dataware";
}

export interface StoryForm {
  company: string;
  industry: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  published: boolean;
  slug: string;
  logoUrl: string;
  companyDesc: string;
  pageHeading: string;
  background: string[];
  features: string[];
  effects: string[];
  quote: string;
  quoteSource: string;
  mainImage: string;
  detailImage: string;
  metaDate: string;
  metaIndustry: string;
  metaPurpose: string;
}

const emptyForm: StoryForm = {
  company: "", industry: "", title: "", content: "", thumbnailUrl: "", published: true,
  slug: "", logoUrl: "",
  companyDesc: "", pageHeading: "", background: [""], features: [""], effects: [""],
  quote: "", quoteSource: "", mainImage: "", detailImage: "",
  metaDate: "", metaIndustry: "", metaPurpose: "",
};

interface DetailJson {
  companyDesc?: string;
  pageHeading?: string;
  background?: string[];
  features?: string[];
  effects?: string[];
  quote?: string;
  quoteSource?: string;
  mainImage?: string;
  detailImage?: string;
  meta?: { date?: string; industry?: string; purpose?: string };
}

function parseDetailJson(raw: string | null | undefined): Partial<StoryForm> {
  if (!raw) return {};
  try {
    const d: DetailJson = JSON.parse(raw);
    return {
      companyDesc: d.companyDesc || "",
      pageHeading: d.pageHeading || "",
      background: d.background?.length ? d.background : [""],
      features: d.features?.length ? d.features : [""],
      effects: d.effects?.length ? d.effects : [""],
      quote: d.quote || "",
      quoteSource: d.quoteSource || "",
      mainImage: d.mainImage || "",
      detailImage: d.detailImage || "",
      metaDate: d.meta?.date || "",
      metaIndustry: d.meta?.industry || "",
      metaPurpose: d.meta?.purpose || "",
    };
  } catch {
    return {};
  }
}

function buildDetailJson(form: StoryForm): string | null {
  const clean = (arr: string[]) => arr.map(s => s.trim()).filter(Boolean);
  const bg = clean(form.background);
  const ft = clean(form.features);
  const ef = clean(form.effects);
  const hasMeta = form.metaDate || form.metaIndustry || form.metaPurpose;
  const hasAny = form.companyDesc || form.pageHeading || bg.length || ft.length || ef.length
    || form.quote || form.quoteSource || form.mainImage || form.detailImage || hasMeta;

  if (!hasAny) return null;

  const obj: DetailJson = {};
  if (form.companyDesc) obj.companyDesc = form.companyDesc;
  if (form.pageHeading) obj.pageHeading = form.pageHeading;
  if (bg.length) obj.background = bg;
  if (ft.length) obj.features = ft;
  if (ef.length) obj.effects = ef;
  if (form.quote) obj.quote = form.quote;
  if (form.quoteSource) obj.quoteSource = form.quoteSource;
  if (form.mainImage) obj.mainImage = form.mainImage;
  if (form.detailImage) obj.detailImage = form.detailImage;
  if (hasMeta) {
    obj.meta = {};
    if (form.metaDate) obj.meta.date = form.metaDate;
    if (form.metaIndustry) obj.meta.industry = form.metaIndustry;
    if (form.metaPurpose) obj.meta.purpose = form.metaPurpose;
  }
  return JSON.stringify(obj);
}

/* ── 리피터 UI 컴포넌트 ── */
function RepeaterField({ label, items, onChange }: {
  label: string; items: string[]; onChange: (items: string[]) => void;
}) {
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";
  const filled = items.filter(s => s.trim()).length;
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        <span className="text-xs text-gray-400">{filled}개</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="w-5 text-right text-xs text-gray-400 shrink-0">{i + 1}.</span>
            <input type="text" value={item} onChange={e => {
              const next = [...items]; next[i] = e.target.value; onChange(next);
            }} className={inputCls} placeholder="내용을 입력하세요" />
            <button type="button" onClick={() => {
              const next = items.filter((_, j) => j !== i);
              onChange(next.length ? next : [""]);
            }} className="w-7 h-7 flex items-center justify-center rounded-md text-red-400 hover:text-white hover:bg-red-500 transition-colors shrink-0" title="삭제">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, ""])}
        className="mt-3 w-full py-2 rounded-lg border border-dashed border-emerald-400 text-emerald-600 text-sm font-medium hover:bg-emerald-50 transition-colors">
        + 항목 추가
      </button>
    </div>
  );
}

export default function CustomerStoryManager({ site }: CustomerStoryManagerProps) {
  const res = useResource<CustomerStory>({ endpoint: "customer-stories", site, entityName: "고객 사례" });
  const [form, setForm] = useState<StoryForm>(emptyForm);
  const [detailOpen, setDetailOpen] = useState(false);

  const DETAIL_FIELDS = new Set(["detail","slug","logoUrl","pageHeading","companyDesc","background","features","effects","quote","quoteSource","mainImage","detailImage","metaDate","metaIndustry","metaPurpose"]);
  function jumpToField(field: string) {
    const detailF = DETAIL_FIELDS.has(field);
    if (detailF) setDetailOpen(true);
    const target = detailF ? "detail" : field;
    setTimeout(() => {
      const el = document.querySelector(`[data-field="${target}"]`) as HTMLElement | null;
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      (el?.querySelector("input, textarea") as HTMLElement | null)?.focus();
    }, 60);
  }

  function openAdd() { setForm(emptyForm); setDetailOpen(false); res.openAdd(); }

  function openEdit(item: CustomerStory) {
    const detail = parseDetailJson(item.detailJson);
    setForm({
      company: item.company, industry: item.industry, title: item.title,
      content: item.content, thumbnailUrl: item.thumbnailUrl || "", published: item.published,
      slug: item.slug || "", logoUrl: item.logoUrl || "",
      companyDesc: "", pageHeading: "", background: [""], features: [""], effects: [""],
      quote: "", quoteSource: "", mainImage: "", detailImage: "",
      metaDate: "", metaIndustry: "", metaPurpose: "",
      ...detail,
    });
    setDetailOpen(!!item.detailJson);
    res.openEdit(item);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.company.trim()) return;
    const detailJson = buildDetailJson(form);
    const body = {
      company: form.company,
      industry: form.industry,
      title: form.title,
      content: form.content,
      thumbnailUrl: form.thumbnailUrl,
      published: form.published,
      slug: form.slug.trim() || null,
      logoUrl: form.logoUrl || null,
      detailJson,
    };
    await res.save(res.editing?.id ?? null, body);
  }

  function formatDate(s: string | undefined | null) {
    if (!s) return "-";
    try {
      const d = new Date(s);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleDateString("ko-KR");
    } catch { return "-"; }
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const columns: Column<CustomerStory>[] = [
    {
      key: "title", label: "제목",
      render: (item) => (
        <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline font-medium text-left">{item.title}</button>
      ),
    },
    { key: "company", label: "회사", width: "130px", render: (item) => item.company },
    { key: "industry", label: "산업", width: "110px", render: (item) => item.industry || "-" },
    {
      key: "published", label: "노출", width: "80px",
      render: (item) => <ToggleSwitch checked={item.published} onChange={() => res.patch(item.id, { ...item, published: !item.published })} />,
    },
    { key: "updatedAt", label: "수정일", width: "110px", render: (item) => formatDate(item.updatedAt) },
    {
      key: "actions", label: "", width: "100px",
      render: (item) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(item)} className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">수정</button>
          <button onClick={() => res.setDeleteTarget(item)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded">삭제</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="고객 사례" description="고객 성공 사례를 등록하고 관리합니다"
        columns={columns} data={res.items} total={res.total} page={res.page} pageSize={res.pageSize}
        onPageChange={res.setPage} searchValue={res.search} onSearchChange={res.setSearch}
        onSearch={res.doSearch} loading={res.loading} onAdd={openAdd} addLabel="+ 사례 추가"
      />

      <Modal open={res.modalOpen} onClose={() => res.setModalOpen(false)} title={res.editing ? "고객 사례 수정" : "고객 사례 추가"} width="max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 max-h-[78vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-3 gap-4">
            <div data-field="company">
              <label className="block text-sm font-medium text-gray-700 mb-1">회사명 <span className="text-red-500">*</span></label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">산업 분야</label>
              <input type="text" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="예: 금융, 제조" className={inputCls} />
            </div>
            <div data-field="title">
              <label className="block text-sm font-medium text-gray-700 mb-1">제목 <span className="text-red-500">*</span></label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">썸네일 이미지</label>
            <ImageUploadField value={form.thumbnailUrl} onChange={(url) => setForm({ ...form, thumbnailUrl: url })} site={site} />
          </div>

          <div data-field="content">
            <label className="block text-sm font-medium text-gray-700 mb-1">본문</label>
            <RichEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} site={site} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">노출 여부</span>
            <ToggleSwitch checked={form.published} onChange={(v) => setForm({ ...form, published: v })} />
          </div>

          {/* ── 상세 페이지 편집 (접이식) ── */}
          <div data-field="detail" className="border border-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => setDetailOpen(!detailOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>{detailOpen ? "▾" : "▸"} 상세 페이지 편집 (선택)</span>
              <span className="text-xs text-gray-400">dataware 고객사례 상세</span>
            </button>

            {detailOpen && (
              <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 bg-blue-50 rounded-lg px-3 py-2">
                  상세 페이지를 풍부하게 구성하려면 아래를 채우세요. 비워두면 위 &lsquo;본문&rsquo;이 상세에 표시됩니다.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      slug (URL 주소)
                      <span className="ml-1 text-xs text-gray-400 font-normal">비우면 번호(id)로 연결</span>
                    </label>
                    <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="예: hyundai-card" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">로고 이미지</label>
                    <ImageUploadField value={form.logoUrl} onChange={(url) => setForm({ ...form, logoUrl: url })} site={site} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상세 대제목</label>
                  <input type="text" value={form.pageHeading} onChange={(e) => setForm({ ...form, pageHeading: e.target.value })}
                    placeholder="비우면 위 제목 사용" className={inputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">회사 소개</label>
                  <textarea value={form.companyDesc} onChange={(e) => setForm({ ...form, companyDesc: e.target.value })}
                    rows={3} placeholder="회사에 대한 간략한 소개" className={inputCls} />
                </div>

                <div className="space-y-4">
                  <RepeaterField label="도입 배경" items={form.background}
                    onChange={(items) => setForm({ ...form, background: items })} />
                  <RepeaterField label="적용 솔루션" items={form.features}
                    onChange={(items) => setForm({ ...form, features: items })} />
                  <RepeaterField label="도입 효과" items={form.effects}
                    onChange={(items) => setForm({ ...form, effects: items })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">메인 이미지</label>
                    <ImageUploadField value={form.mainImage} onChange={(url) => setForm({ ...form, mainImage: url })} site={site} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상세 이미지 (시스템 구성도 등)</label>
                    <ImageUploadField value={form.detailImage} onChange={(url) => setForm({ ...form, detailImage: url })} site={site} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">고객 인용문</label>
                    <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })}
                      rows={3} placeholder="데이터웨어 도입 후 업무 효율이 크게 향상되었습니다." className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">인용 출처</label>
                    <input type="text" value={form.quoteSource} onChange={(e) => setForm({ ...form, quoteSource: e.target.value })}
                      placeholder="예: 홍길동 팀장" className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                    <input type="text" value={form.metaDate} onChange={(e) => setForm({ ...form, metaDate: e.target.value })}
                      placeholder="2025년 3월" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">업종</label>
                    <input type="text" value={form.metaIndustry} onChange={(e) => setForm({ ...form, metaIndustry: e.target.value })}
                      placeholder="금융" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">목적/효과</label>
                    <input type="text" value={form.metaPurpose} onChange={(e) => setForm({ ...form, metaPurpose: e.target.value })}
                      placeholder="데이터 품질 관리 체계 구축" className={inputCls} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => res.setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
            <button onClick={handleSave} disabled={res.saving} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {res.saving ? "저장 중..." : "저장"}
            </button>
          </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-0 max-h-[78vh] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-3">실시간 미리보기</p>
              <CustomerStoryPreview form={form} onJump={jumpToField} />
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={!!res.deleteTarget} onClose={() => res.setDeleteTarget(null)} title="고객 사례 삭제">
        <div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>&ldquo;{res.deleteTarget?.title}&rdquo;</strong> 사례를 삭제하시겠습니까?
            <br /><span className="text-xs text-red-600">이 작업은 되돌릴 수 없습니다.</span>
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => res.setDeleteTarget(null)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
            <button onClick={res.confirmDelete} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">삭제</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
