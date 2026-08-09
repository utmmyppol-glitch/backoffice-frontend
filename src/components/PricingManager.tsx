"use client";

import { useState } from "react";
import { PricingPlan } from "@/lib/types";
import useResource from "@/hooks/useResource";
import DataTable, { Column } from "./DataTable";
import Modal from "./Modal";
import ToggleSwitch from "./ToggleSwitch";

interface PricingForm {
  name: string;
  licenseType: string;
  price: number | null;
  originalPrice: number | null;
  priceDisplay: string;
  features: string;
  badge: string;
  isPopular: boolean;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm: PricingForm = {
  name: "", licenseType: "", price: null, originalPrice: null,
  priceDisplay: "", features: "[]", badge: "", isPopular: false,
  sortOrder: 0, isActive: true,
};

export default function PricingManager() {
  const res = useResource<PricingPlan>({ endpoint: "pricing", site: "dataware", entityName: "가격표" });
  const [form, setForm] = useState<PricingForm>(emptyForm);
  const [featureInput, setFeatureInput] = useState("");

  function parseFeatures(raw: string): string[] {
    try { return JSON.parse(raw || "[]"); } catch { return []; }
  }

  function openAdd() { setForm(emptyForm); setFeatureInput(""); res.openAdd(); }

  function openEdit(item: PricingPlan) {
    setForm({
      name: item.name || "",
      licenseType: item.licenseType || "",
      price: item.price,
      originalPrice: item.originalPrice,
      priceDisplay: item.priceDisplay || "",
      features: item.features || "[]",
      badge: item.badge || "",
      isPopular: item.isPopular ?? false,
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setFeatureInput("");
    res.openEdit(item);
  }

  function addFeature() {
    const v = featureInput.trim();
    if (!v) return;
    const arr = parseFeatures(form.features);
    arr.push(v);
    setForm({ ...form, features: JSON.stringify(arr) });
    setFeatureInput("");
  }

  function removeFeature(idx: number) {
    const arr = parseFeatures(form.features).filter((_, i) => i !== idx);
    setForm({ ...form, features: JSON.stringify(arr) });
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    await res.save(res.editing?.id ?? null, form);
  }

  const columns: Column<PricingPlan>[] = [
    {
      key: "name", label: "플랜명",
      render: (item) => (
        <div>
          <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline font-medium text-left">{item.name}</button>
          {item.badge && <span className="ml-2 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded">{item.badge}</span>}
        </div>
      ),
    },
    { key: "licenseType", label: "라이선스", width: "120px", render: (item) => item.licenseType || "-" },
    {
      key: "price", label: "가격", width: "120px",
      render: (item) => item.priceDisplay || (item.price != null ? `₩${item.price.toLocaleString()}` : "-"),
    },
    {
      key: "isPopular", label: "인기", width: "70px",
      render: (item) => item.isPopular ? <span className="text-emerald-600 font-bold text-xs">★</span> : <span className="text-gray-300 text-xs">—</span>,
    },
    { key: "sortOrder", label: "순서", width: "70px", render: (item) => item.sortOrder },
    {
      key: "isActive", label: "노출", width: "80px",
      render: (item) => <ToggleSwitch checked={item.isActive} onChange={() => res.patchField(item.id, "isActive", { isActive: !item.isActive })} />,
    },
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

  const features = parseFeatures(form.features);

  return (
    <>
      <DataTable
        title="가격표 관리" description="가격 플랜을 등록하고 관리합니다"
        columns={columns} data={res.items} total={res.total} page={res.page} pageSize={res.pageSize}
        onPageChange={res.setPage} searchValue={res.search} onSearchChange={res.setSearch}
        onSearch={res.doSearch} loading={res.loading} onAdd={openAdd} addLabel="+ 플랜 추가"
      />

      <Modal open={res.modalOpen} onClose={() => res.setModalOpen(false)} title={res.editing ? "플랜 수정" : "플랜 추가"} width="max-w-3xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">플랜명 <span className="text-red-500">*</span></label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="예: Enterprise"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">라이선스 유형</label>
              <input type="text" value={form.licenseType} onChange={(e) => setForm({ ...form, licenseType: e.target.value })}
                placeholder="예: SaaS"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가격 (원)</label>
              <input type="number" value={form.price ?? ""} onChange={(e) => setForm({ ...form, price: e.target.value ? Number(e.target.value) : null })}
                placeholder="예: 990000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">원래 가격 (원)</label>
              <input type="number" value={form.originalPrice ?? ""} onChange={(e) => setForm({ ...form, originalPrice: e.target.value ? Number(e.target.value) : null })}
                placeholder="할인 전 가격"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가격 표시 텍스트</label>
              <input type="text" value={form.priceDisplay} onChange={(e) => setForm({ ...form, priceDisplay: e.target.value })}
                placeholder="예: 월 99,000원~"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주요 기능 / 특징</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
                placeholder="기능을 입력하고 Enter 또는 추가 버튼"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <button type="button" onClick={addFeature}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 shrink-0">추가</button>
            </div>
            {features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {features.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                    {f}
                    <button type="button" onClick={() => removeFeature(i)} className="text-blue-400 hover:text-blue-700 ml-0.5">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">배지</label>
              <input type="text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="예: BEST"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">표시 순서</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="flex items-end pb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">인기 플랜</span>
                <ToggleSwitch checked={form.isPopular} onChange={(v) => setForm({ ...form, isPopular: v })} />
              </div>
            </div>
            <div className="flex items-end pb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">노출 여부</span>
                <ToggleSwitch checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => res.setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
            <button onClick={handleSave} disabled={res.saving} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {res.saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!res.deleteTarget} onClose={() => res.setDeleteTarget(null)} title="플랜 삭제">
        <div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>&ldquo;{res.deleteTarget?.name}&rdquo;</strong> 플랜을 삭제하시겠습니까?
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
