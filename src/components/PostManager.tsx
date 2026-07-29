"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { Post, PaginatedResponse } from "@/lib/types";
import DataTable, { Column } from "./DataTable";
import Modal from "./Modal";
import ToggleSwitch from "./ToggleSwitch";
import { useToast } from "./Toast";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("./RichEditor"), { ssr: false });

interface PostManagerProps {
  site: "union" | "dataware";
}

const CATEGORY_OPTIONS: Record<string, { value: string; label: string }[]> = {
  union: [
    { value: "NOTICE", label: "공지사항" },
    { value: "INSIGHT", label: "인사이트" },
    { value: "EVENT", label: "이벤트" },
    { value: "NEWS", label: "뉴스" },
  ],
  dataware: [
    { value: "NOTICE", label: "공지사항" },
    { value: "INSIGHT", label: "인사이트" },
    { value: "EVENT", label: "이벤트" },
    { value: "TECH", label: "기술 블로그" },
    { value: "NEWS", label: "뉴스" },
  ],
};

interface PostForm {
  title: string;
  category: string;
  body_html: string;
  thumbnail_url: string;
  published: boolean;
}

const emptyForm: PostForm = {
  title: "",
  category: "",
  body_html: "",
  thumbnail_url: "",
  published: true,
};

export default function PostManager({ site }: PostManagerProps) {
  const { toast } = useToast();
  const [data, setData] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

  const pageSize = 15;
  const categories = CATEGORY_OPTIONS[site] || CATEGORY_OPTIONS.union;
  const categoryMap = Object.fromEntries(categories.map((c) => [c.value, c.label]));

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
      if (searchQuery) params.set("search", searchQuery);
      const res = await apiFetch<PaginatedResponse<Post>>(
        `/api/admin/${site}/posts?${params}`
      );
      setData(res.items);
      setTotal(res.total);
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "게시글을 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, [site, page, searchQuery, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyForm, category: categories[0]?.value ?? "" });
    setModalOpen(true);
  }

  function openEdit(item: Post) {
    setEditing(item);
    setForm({
      title: item.title, category: item.category, body_html: item.body_html,
      thumbnail_url: item.thumbnail_url, published: item.published,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { toast("error", "제목을 입력하세요"); return; }
    if (!form.category) { toast("error", "카테고리를 선택하세요"); return; }
    try {
      setSaving(true);
      if (editing) {
        await apiFetch(`/api/admin/${site}/posts/${editing.id}`, {
          method: "PUT", body: JSON.stringify(form),
        });
        toast("success", "게시글이 수정되었습니다");
      } else {
        await apiFetch(`/api/admin/${site}/posts`, {
          method: "POST", body: JSON.stringify(form),
        });
        toast("success", "게시글이 추가되었습니다");
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
      await apiFetch(`/api/admin/${site}/posts/${deleteTarget.id}`, { method: "DELETE" });
      toast("success", "게시글이 삭제되었습니다");
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "삭제에 실패했습니다");
    }
  }

  async function togglePublished(item: Post) {
    try {
      await apiFetch(`/api/admin/${site}/posts/${item.id}`, {
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

  const columns: Column<Post>[] = [
    {
      key: "title", label: "제목",
      render: (item) => (
        <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline font-medium text-left">
          {item.title}
        </button>
      ),
    },
    {
      key: "category", label: "카테고리", width: "120px",
      render: (item) => (
        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
          {categoryMap[item.category] || item.category || "-"}
        </span>
      ),
    },
    {
      key: "published", label: "노출", width: "80px",
      render: (item) => <ToggleSwitch checked={item.published} onChange={() => togglePublished(item)} />,
    },
    { key: "created_at", label: "작성일", width: "110px", render: (item) => formatDate(item.created_at) },
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
        title="게시글 관리" description="게시글을 등록하고 관리합니다"
        columns={columns} data={data} total={total} page={page} pageSize={pageSize}
        onPageChange={setPage} searchValue={search} onSearchChange={setSearch}
        onSearch={() => { setPage(1); setSearchQuery(search); }}
        loading={loading} onAdd={openAdd} addLabel="+ 게시글 추가"
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "게시글 수정" : "게시글 추가"} width="max-w-4xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목 <span className="text-red-500">*</span></label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 <span className="text-red-500">*</span></label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">선택하세요</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              썸네일 이미지 URL
              <span className="ml-1 text-xs text-gray-400">(이미지 업로드 기능은 추후 지원 예정)</span>
            </label>
            <input type="url" value={form.thumbnail_url}
              onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            {form.thumbnail_url && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.thumbnail_url} alt="썸네일 미리보기" className="max-h-32 rounded" />
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

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="게시글 삭제">
        <div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>&ldquo;{deleteTarget?.title}&rdquo;</strong> 게시글을 삭제하시겠습니까?
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
