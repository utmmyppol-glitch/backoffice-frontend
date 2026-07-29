"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { CustomerStory, PaginatedResponse } from "@/lib/types";
import DataTable, { Column } from "./DataTable";
import Modal from "./Modal";
import ToggleSwitch from "./ToggleSwitch";
import { useToast } from "./Toast";
import dynamic from "next/dynamic";
import { isValidImageUrl } from "@/lib/url";

const RichEditor = dynamic(() => import("./RichEditor"), { ssr: false });

interface CustomerStoryManagerProps {
  site: "union" | "dataware";
}

interface StoryForm {
  company: string;
  industry: string;
  title: string;
  body_html: string;
  thumbnail_url: string;
  published: boolean;
}

const emptyForm: StoryForm = { company: "", industry: "", title: "", body_html: "", thumbnail_url: "", published: true };

export default function CustomerStoryManager({ site }: CustomerStoryManagerProps) {
  const { toast } = useToast();
  const [data, setData] = useState<CustomerStory[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerStory | null>(null);
  const [form, setForm] = useState<StoryForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CustomerStory | null>(null);

  const pageSize = 15;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
      if (searchQuery) params.set("search", searchQuery);
      const res = await apiFetch<PaginatedResponse<CustomerStory>>(
        `/api/admin/${site}/customer-stories?${params}`
      );
      setData(res.items);
      setTotal(res.total);
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "고객 사례를 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, [site, page, searchQuery, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function openAdd() { setEditing(null); setForm(emptyForm); setModalOpen(true); }

  function openEdit(item: CustomerStory) {
    setEditing(item);
    setForm({
      company: item.company, industry: item.industry, title: item.title,
      body_html: item.body_html, thumbnail_url: item.thumbnail_url || "", published: item.published,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { toast("error", "제목을 입력하세요"); return; }
    if (!form.company.trim()) { toast("error", "회사명을 입력하세요"); return; }
    try {
      setSaving(true);
      if (editing) {
        await apiFetch(`/api/admin/${site}/customer-stories/${editing.id}`, {
          method: "PUT", body: JSON.stringify(form),
        });
        toast("success", "고객 사례가 수정되었습니다");
      } else {
        await apiFetch(`/api/admin/${site}/customer-stories`, {
          method: "POST", body: JSON.stringify(form),
        });
        toast("success", "고객 사례가 추가되었습니다");
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
      await apiFetch(`/api/admin/${site}/customer-stories/${deleteTarget.id}`, { method: "DELETE" });
      toast("success", "고객 사례가 삭제되었습니다");
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "삭제에 실패했습니다");
    }
  }

  async function togglePublished(item: CustomerStory) {
    try {
      await apiFetch(`/api/admin/${site}/customer-stories/${item.id}`, {
        method: "PUT", body: JSON.stringify({ published: !item.published }),
      });
      fetchData();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "변경에 실패했습니다");
    }
  }

  function formatDate(s: string) {
    try { return new Date(s).toLocaleDateString("ko-KR"); } catch { return s; }
  }

  const columns: Column<CustomerStory>[] = [
    {
      key: "title", label: "제목",
      render: (item) => (
        <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline font-medium text-left">
          {item.title}
        </button>
      ),
    },
    { key: "company", label: "회사", width: "130px", render: (item) => item.company },
    { key: "industry", label: "산업", width: "110px", render: (item) => item.industry || "-" },
    {
      key: "published", label: "노출", width: "80px",
      render: (item) => <ToggleSwitch checked={item.published} onChange={() => togglePublished(item)} />,
    },
    { key: "updated_at", label: "수정일", width: "110px", render: (item) => formatDate(item.updated_at) },
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
        title="고객 사례"
        description="고객 성공 사례를 등록하고 관리합니다"
        columns={columns} data={data} total={total} page={page} pageSize={pageSize}
        onPageChange={setPage} searchValue={search} onSearchChange={setSearch}
        onSearch={() => { setPage(1); setSearchQuery(search); }}
        loading={loading} onAdd={openAdd} addLabel="+ 사례 추가"
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "고객 사례 수정" : "고객 사례 추가"} width="max-w-4xl">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">회사명</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">산업 분야</label>
              <input type="text" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}
                placeholder="예: 금융, 제조"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              썸네일 이미지 URL
              <span className="ml-1 text-xs text-gray-400 font-normal">(이미지 업로드 기능은 추후 지원 예정)</span>
            </label>
            <input type="url" value={form.thumbnail_url}
              onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
              placeholder="https://example.com/thumbnail.jpg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            {isValidImageUrl(form.thumbnail_url) && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.thumbnail_url} alt="썸네일 미리보기" className="max-h-24 rounded" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">본문</label>
            <RichEditor value={form.body_html} onChange={(html) => setForm({ ...form, body_html: html })} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">노출 여부</span>
              <ToggleSwitch checked={form.published} onChange={(v) => setForm({ ...form, published: v })} />
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

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="고객 사례 삭제">
        <div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>&ldquo;{deleteTarget?.title}&rdquo;</strong> 사례를 삭제하시겠습니까?
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
