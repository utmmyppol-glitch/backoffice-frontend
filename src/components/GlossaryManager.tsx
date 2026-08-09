"use client";

import { useState } from "react";
import { GlossaryTerm } from "@/lib/types";
import useResource from "@/hooks/useResource";
import DataTable, { Column } from "./DataTable";
import Modal from "./Modal";
import ToggleSwitch from "./ToggleSwitch";

interface GlossaryForm {
  term: string;
  fullName: string;
  definition: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm: GlossaryForm = {
  term: "", fullName: "", definition: "", category: "", sortOrder: 0, isActive: true,
};

export default function GlossaryManager() {
  const res = useResource<GlossaryTerm>({ endpoint: "glossary", site: "union", entityName: "용어" });
  const [form, setForm] = useState<GlossaryForm>(emptyForm);

  function openAdd() { setForm(emptyForm); res.openAdd(); }

  function openEdit(item: GlossaryTerm) {
    setForm({
      term: item.term || "",
      fullName: item.fullName || "",
      definition: item.definition || "",
      category: item.category || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    res.openEdit(item);
  }

  async function handleSave() {
    if (!form.term.trim()) return;
    await res.save(res.editing?.id ?? null, form);
  }

  const columns: Column<GlossaryTerm>[] = [
    {
      key: "term", label: "용어",
      render: (item) => (
        <div>
          <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline font-medium text-left">{item.term}</button>
          {item.fullName && <div className="text-xs text-gray-400 mt-0.5">{item.fullName}</div>}
        </div>
      ),
    },
    {
      key: "definition", label: "정의", width: "300px",
      render: (item) => <span className="text-gray-600 text-sm line-clamp-2">{item.definition?.slice(0, 80)}{(item.definition?.length ?? 0) > 80 ? "…" : ""}</span>,
    },
    { key: "category", label: "카테고리", width: "120px", render: (item) => item.category || "-" },
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

  return (
    <>
      <DataTable
        title="용어사전 관리" description="IT 용어 정보를 등록하고 관리합니다"
        columns={columns} data={res.items} total={res.total} page={res.page} pageSize={res.pageSize}
        onPageChange={res.setPage} searchValue={res.search} onSearchChange={res.setSearch}
        onSearch={res.doSearch} loading={res.loading} onAdd={openAdd} addLabel="+ 용어 추가"
      />

      <Modal open={res.modalOpen} onClose={() => res.setModalOpen(false)} title={res.editing ? "용어 수정" : "용어 추가"} width="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">용어 <span className="text-red-500">*</span></label>
              <input type="text" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })}
                placeholder="예: DLP"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">전체 이름</label>
              <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="예: Data Loss Prevention"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">정의</label>
            <textarea value={form.definition} onChange={(e) => setForm({ ...form, definition: e.target.value })}
              rows={4} placeholder="용어에 대한 설명을 입력하세요"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="예: 보안"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">표시 순서</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
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

      <Modal open={!!res.deleteTarget} onClose={() => res.setDeleteTarget(null)} title="용어 삭제">
        <div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>&ldquo;{res.deleteTarget?.term}&rdquo;</strong> 용어를 삭제하시겠습니까?
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
