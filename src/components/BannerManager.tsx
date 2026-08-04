"use client";

import { useState } from "react";
import { Banner, BannerPosition } from "@/lib/types";
import useResource from "@/hooks/useResource";
import DataTable, { Column } from "./DataTable";
import Modal from "./Modal";
import ToggleSwitch from "./ToggleSwitch";
import NextImage from "next/image";
import { isValidImageUrl } from "@/lib/url";

interface BannerManagerProps {
  site: "union" | "dataware";
}

interface BannerForm {
  title: string;
  image_url: string;
  link_url: string;
  position: BannerPosition;
  sort_order: number;
  is_active: boolean;
}

const emptyForm: BannerForm = {
  title: "", image_url: "", link_url: "", position: "HERO", sort_order: 0, is_active: true,
};

const POSITION_LABELS: Record<BannerPosition, string> = {
  HERO: "히어로 배너", POPUP: "팝업", PROMOTION: "프로모션",
};

export default function BannerManager({ site }: BannerManagerProps) {
  const res = useResource<Banner>({ endpoint: "banners", site, entityName: "배너" });
  const [form, setForm] = useState<BannerForm>(emptyForm);

  function openAdd() { setForm(emptyForm); res.openAdd(); }

  function openEdit(item: Banner) {
    setForm({
      title: item.title, image_url: item.image_url, link_url: item.link_url,
      position: item.position, sort_order: item.sort_order, is_active: item.is_active,
    });
    res.openEdit(item);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.image_url.trim()) return;
    await res.save(res.editing?.id ?? null, form);
  }

  const columns: Column<Banner>[] = [
    {
      key: "image", label: "이미지", width: "100px",
      render: (item) =>
        item.image_url ? (
          <NextImage src={item.image_url} alt={item.title} width={80} height={48}
            className="w-20 h-12 object-cover rounded border" unoptimized />
        ) : <span className="text-gray-300 text-xs">이미지 없음</span>,
    },
    {
      key: "title", label: "제목",
      render: (item) => (
        <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline font-medium text-left">{item.title}</button>
      ),
    },
    {
      key: "position", label: "위치", width: "110px",
      render: (item) => (
        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
          {POSITION_LABELS[item.position] || item.position}
        </span>
      ),
    },
    { key: "sort_order", label: "순서", width: "70px", render: (item) => item.sort_order },
    {
      key: "is_active", label: "노출", width: "80px",
      render: (item) => <ToggleSwitch checked={item.is_active} onChange={() => res.patch(item.id, { ...item, is_active: !item.is_active })} />,
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

  return (
    <>
      <DataTable
        title="배너 관리" description="사이트 배너를 등록하고 관리합니다"
        columns={columns} data={res.items} total={res.total} page={res.page} pageSize={res.pageSize}
        onPageChange={res.setPage} searchValue={res.search} onSearchChange={res.setSearch}
        onSearch={res.doSearch} loading={res.loading} onAdd={openAdd} addLabel="+ 배너 추가"
      />

      <Modal open={res.modalOpen} onClose={() => res.setModalOpen(false)} title={res.editing ? "배너 수정" : "배너 추가"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">배너 제목 <span className="text-red-500">*</span></label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이미지 URL <span className="text-red-500">*</span>
              <span className="ml-1 text-xs text-gray-400 font-normal">(이미지 업로드 기능은 추후 지원 예정)</span>
            </label>
            <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://example.com/banner.jpg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            {isValidImageUrl(form.image_url) && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image_url} alt="배너 미리보기" className="max-h-40 rounded" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">클릭 시 이동 링크</label>
            <input type="url" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })}
              placeholder="https://example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">위치</label>
              <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value as BannerPosition })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                {(Object.keys(POSITION_LABELS) as BannerPosition[]).map((k) => (
                  <option key={k} value={k}>{POSITION_LABELS[k]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">표시 순서</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">노출 여부</span>
            <ToggleSwitch checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => res.setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
            <button onClick={handleSave} disabled={res.saving} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {res.saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!res.deleteTarget} onClose={() => res.setDeleteTarget(null)} title="배너 삭제">
        <div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>&ldquo;{res.deleteTarget?.title}&rdquo;</strong> 배너를 삭제하시겠습니까?
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
