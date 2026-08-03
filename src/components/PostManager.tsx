"use client";

import { useState } from "react";
import { Post } from "@/lib/types";
import useResource from "@/hooks/useResource";
import DataTable, { Column } from "./DataTable";
import Modal from "./Modal";
import ToggleSwitch from "./ToggleSwitch";
import { isValidImageUrl } from "@/lib/url";
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
  title: "", category: "", body_html: "", thumbnail_url: "", published: true,
};

export default function PostManager({ site }: PostManagerProps) {
  const res = useResource<Post>({ endpoint: "posts", site, entityName: "게시글" });
  const [form, setForm] = useState<PostForm>(emptyForm);

  const categories = CATEGORY_OPTIONS[site] || CATEGORY_OPTIONS.union;
  const categoryMap = Object.fromEntries(categories.map((c) => [c.value, c.label]));

  function openAdd() {
    setForm({ ...emptyForm, category: categories[0]?.value ?? "" });
    res.openAdd();
  }

  function openEdit(item: Post) {
    setForm({
      title: item.title, category: item.category, body_html: item.body_html,
      thumbnail_url: item.thumbnail_url, published: item.published,
    });
    res.openEdit(item);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    if (!form.category) return;
    await res.save(res.editing?.id ?? null, form);
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
      render: (item) => <ToggleSwitch checked={item.published} onChange={() => res.patch(item.id, { ...item, published: !item.published })} />,
    },
    { key: "created_at", label: "작성일", width: "110px", render: (item) => formatDate(item.created_at) },
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
        title="게시글 관리" description="게시글을 등록하고 관리합니다"
        columns={columns} data={res.items} total={res.total} page={res.page} pageSize={res.pageSize}
        onPageChange={res.setPage} searchValue={res.search} onSearchChange={res.setSearch}
        onSearch={res.doSearch} loading={res.loading} onAdd={openAdd} addLabel="+ 게시글 추가"
      />

      <Modal open={res.modalOpen} onClose={() => res.setModalOpen(false)} title={res.editing ? "게시글 수정" : "게시글 추가"} width="max-w-4xl">
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
                {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              썸네일 이미지 URL <span className="ml-1 text-xs text-gray-400">(이미지 업로드 기능은 추후 지원 예정)</span>
            </label>
            <input type="url" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            {isValidImageUrl(form.thumbnail_url) && (
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

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">노출 여부</span>
            <ToggleSwitch checked={form.published} onChange={(v) => setForm({ ...form, published: v })} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => res.setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
            <button onClick={handleSave} disabled={res.saving} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {res.saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!res.deleteTarget} onClose={() => res.setDeleteTarget(null)} title="게시글 삭제">
        <div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>&ldquo;{res.deleteTarget?.title}&rdquo;</strong> 게시글을 삭제하시겠습니까?
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
