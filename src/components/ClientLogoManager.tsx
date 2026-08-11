"use client";

import { useState } from "react";
import { ClientLogo } from "@/lib/types";
import useResource from "@/hooks/useResource";
import DataTable, { Column } from "./DataTable";
import Modal from "./Modal";
import ToggleSwitch from "./ToggleSwitch";
import ImageUploadField from "./ImageUploadField";

interface ClientLogoManagerProps {
  site: "union" | "dataware";
}

interface LogoForm {
  name: string;
  logoUrl: string;
  sortOrder: number;
  isActive: boolean;
  showOnHome: boolean;
}

const emptyForm: LogoForm = { name: "", logoUrl: "", sortOrder: 0, isActive: true, showOnHome: false };

export default function ClientLogoManager({ site }: ClientLogoManagerProps) {
  const res = useResource<ClientLogo>({ endpoint: "client-logos", site, pageSize: 20, entityName: "로고" });
  const [form, setForm] = useState<LogoForm>(emptyForm);

  function openAdd() { setForm(emptyForm); res.openAdd(); }

  function openEdit(item: ClientLogo) {
    setForm({ name: item.name, logoUrl: item.logoUrl || "", sortOrder: item.sortOrder, isActive: item.isActive, showOnHome: item.showOnHome ?? false });
    res.openEdit(item);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    await res.save(res.editing?.id ?? null, form);
  }

  const columns: Column<ClientLogo>[] = [
    {
      key: "image", label: "로고", width: "80px",
      render: (item) =>
        item.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={item.logoUrl} alt={item.name}
            className="w-14 h-10 object-contain rounded border bg-white p-1" />
        ) : (
          <div className="w-14 h-10 flex items-center justify-center rounded border bg-gray-100 text-gray-400 text-sm font-semibold">
            {item.name?.charAt(0) || "?"}
          </div>
        ),
    },
    {
      key: "name", label: "고객사",
      render: (item) => (
        <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline font-medium text-left">{item.name}</button>
      ),
    },
    { key: "sortOrder", label: "순서", width: "70px", render: (item) => item.sortOrder },
    {
      key: "isActive", label: "노출", width: "80px",
      render: (item) => <ToggleSwitch checked={item.isActive} onChange={() => res.patch(item.id, { ...item, isActive: !item.isActive })} />,
    },
    ...(site === "dataware" ? [{
      key: "showOnHome" as const, label: "홈", width: "60px",
      render: (item: ClientLogo) => <ToggleSwitch checked={item.showOnHome ?? false} onChange={() => res.patch(item.id, { ...item, showOnHome: !(item.showOnHome ?? false) })} />,
    }] : []),
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
        title="고객사 로고" description="고객사 로고를 등록하고 관리합니다"
        columns={columns} data={res.items} total={res.total} page={res.page} pageSize={res.pageSize}
        onPageChange={res.setPage} searchValue={res.search} onSearchChange={res.setSearch}
        onSearch={res.doSearch} loading={res.loading} onAdd={openAdd} addLabel="+ 로고 추가"
      />

      <Modal open={res.modalOpen} onClose={() => res.setModalOpen(false)} title={res.editing ? "로고 수정" : "로고 추가"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">고객사 이름 <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">로고 이미지</label>
            <ImageUploadField value={form.logoUrl} onChange={(url) => setForm({ ...form, logoUrl: url })} site={site} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">표시 순서</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">노출 여부</span>
            <ToggleSwitch checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} />
          </div>
          {site === "dataware" && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">홈에 노출</span>
              <ToggleSwitch checked={form.showOnHome} onChange={(v) => setForm({ ...form, showOnHome: v })} />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => res.setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
            <button onClick={handleSave} disabled={res.saving} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {res.saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!res.deleteTarget} onClose={() => res.setDeleteTarget(null)} title="로고 삭제">
        <div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>&ldquo;{res.deleteTarget?.name}&rdquo;</strong> 로고를 삭제하시겠습니까?
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
