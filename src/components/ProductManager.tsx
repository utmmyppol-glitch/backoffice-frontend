"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { Product, PaginatedResponse } from "@/lib/types";
import DataTable, { Column } from "./DataTable";
import Modal from "./Modal";
import ToggleSwitch from "./ToggleSwitch";
import { useToast } from "./Toast";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("./RichEditor"), { ssr: false });

interface ProductForm {
  name: string;
  slug: string;
  subtitle: string;
  category: string;
  description_html: string;
  features: string[];
  certification: string;
  sort_order: number;
  published: boolean;
}

const emptyForm: ProductForm = {
  name: "", slug: "", subtitle: "", category: "", description_html: "",
  features: [], certification: "", sort_order: 0, published: true,
};

export default function ProductManager() {
  const site = "dataware";
  const { toast } = useToast();
  const [data, setData] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [featureInput, setFeatureInput] = useState("");

  const pageSize = 15;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
      if (searchQuery) params.set("search", searchQuery);
      const res = await apiFetch<PaginatedResponse<Product>>(
        `/api/admin/${site}/products?${params}`
      );
      setData(res.items);
      setTotal(res.total);
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "제품을 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function openAdd() { setEditing(null); setForm(emptyForm); setFeatureInput(""); setModalOpen(true); }

  function openEdit(item: Product) {
    setEditing(item);
    setForm({
      name: item.name, slug: item.slug, subtitle: item.subtitle || "",
      category: item.category, description_html: item.description_html,
      features: item.features || [], certification: item.certification || "",
      sort_order: item.sort_order, published: item.published,
    });
    setFeatureInput("");
    setModalOpen(true);
  }

  function addFeature() {
    const v = featureInput.trim();
    if (!v) return;
    setForm({ ...form, features: [...form.features, v] });
    setFeatureInput("");
  }

  function removeFeature(idx: number) {
    setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
  }

  async function handleSave() {
    if (!form.name.trim()) { toast("error", "제품명을 입력하세요"); return; }
    if (!form.slug.trim()) { toast("error", "Slug를 입력하세요"); return; }
    try {
      setSaving(true);
      if (editing) {
        await apiFetch(`/api/admin/${site}/products/${editing.id}`, {
          method: "PUT", body: JSON.stringify(form),
        });
        toast("success", "제품이 수정되었습니다");
      } else {
        await apiFetch(`/api/admin/${site}/products`, {
          method: "POST", body: JSON.stringify(form),
        });
        toast("success", "제품이 추가되었습니다");
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await apiFetch(`/api/admin/${site}/products/${deleteTarget.id}`, { method: "DELETE" });
      toast("success", "제품이 삭제되었습니다");
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "삭제에 실패했습니다");
    }
  }

  async function togglePublished(item: Product) {
    try {
      await apiFetch(`/api/admin/${site}/products/${item.id}`, {
        method: "PUT", body: JSON.stringify({ published: !item.published }),
      });
      fetchData();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "변경에 실패했습니다");
    }
  }

  const columns: Column<Product>[] = [
    {
      key: "name", label: "제품명",
      render: (item) => (
        <div>
          <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline font-medium text-left">
            {item.name}
          </button>
          {item.subtitle && <div className="text-xs text-gray-400 mt-0.5">{item.subtitle}</div>}
        </div>
      ),
    },
    { key: "slug", label: "Slug", width: "140px", render: (item) => <span className="text-gray-500 font-mono text-xs">{item.slug}</span> },
    { key: "category", label: "카테고리", width: "120px", render: (item) => item.category || "-" },
    { key: "sort_order", label: "순서", width: "70px", render: (item) => item.sort_order },
    {
      key: "published", label: "노출", width: "80px",
      render: (item) => <ToggleSwitch checked={item.published} onChange={() => togglePublished(item)} />,
    },
    {
      key: "actions", label: "", width: "100px",
      render: (item) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(item)} className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">수정</button>
          <button onClick={() => setDeleteTarget(item)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded">삭제</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="제품 관리" description="제품 정보를 등록하고 관리합니다"
        columns={columns} data={data} total={total} page={page} pageSize={pageSize}
        onPageChange={setPage} searchValue={search} onSearchChange={setSearch}
        onSearch={() => { setPage(1); setSearchQuery(search); }}
        loading={loading} onAdd={openAdd} addLabel="+ 제품 추가"
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "제품 수정" : "제품 추가"} width="max-w-4xl">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제품명 <span className="text-red-500">*</span></label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-500">*</span>
                <span className="ml-1 text-xs text-gray-400 font-normal">(URL 경로용 영문)</span>
              </label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="예: data-catalog"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="예: 데이터 플랫폼"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">부제</label>
            <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="제품에 대한 간단한 한 줄 설명"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제품 설명</label>
            <RichEditor value={form.description_html} onChange={(html) => setForm({ ...form, description_html: html })} />
          </div>

          {/* Features list input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주요 기능</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
                placeholder="기능을 입력하고 Enter 또는 추가 버튼"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <button type="button" onClick={addFeature}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 shrink-0">
                추가
              </button>
            </div>
            {form.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.features.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                    {f}
                    <button type="button" onClick={() => removeFeature(i)}
                      className="text-blue-400 hover:text-blue-700 ml-0.5">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">인증/인정</label>
              <input type="text" value={form.certification} onChange={(e) => setForm({ ...form, certification: e.target.value })}
                placeholder="예: GS인증 1등급"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">표시 순서</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="flex items-end pb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">노출 여부</span>
                <ToggleSwitch checked={form.published} onChange={(v) => setForm({ ...form, published: v })} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="제품 삭제">
        <div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>&ldquo;{deleteTarget?.name}&rdquo;</strong> 제품을 삭제하시겠습니까?
            <br /><span className="text-xs text-red-600">이 작업은 되돌릴 수 없습니다.</span>
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
            <button onClick={handleDelete} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">삭제</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
