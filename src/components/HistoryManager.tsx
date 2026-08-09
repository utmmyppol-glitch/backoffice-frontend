"use client";

import { useState } from "react";
import { HistoryItem } from "@/lib/types";
import useResource from "@/hooks/useResource";
import DataTable, { Column } from "./DataTable";
import Modal from "./Modal";
import ToggleSwitch from "./ToggleSwitch";

interface HistoryForm {
  year: string;
  title: string;
  events: string;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm: HistoryForm = {
  year: "", title: "", events: "[]", sortOrder: 0, isActive: true,
};

export default function HistoryManager() {
  const res = useResource<HistoryItem>({ endpoint: "history", site: "union", entityName: "연혁" });
  const [form, setForm] = useState<HistoryForm>(emptyForm);
  const [eventInput, setEventInput] = useState("");

  // events는 JSON 배열 문자열
  function parseEvents(raw: string): string[] {
    try { return JSON.parse(raw || "[]"); } catch { return []; }
  }

  function openAdd() { setForm(emptyForm); setEventInput(""); res.openAdd(); }

  function openEdit(item: HistoryItem) {
    setForm({
      year: item.year || "",
      title: item.title || "",
      events: item.events || "[]",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setEventInput("");
    res.openEdit(item);
  }

  function addEvent() {
    const v = eventInput.trim();
    if (!v) return;
    const arr = parseEvents(form.events);
    arr.push(v);
    setForm({ ...form, events: JSON.stringify(arr) });
    setEventInput("");
  }

  function removeEvent(idx: number) {
    const arr = parseEvents(form.events).filter((_, i) => i !== idx);
    setForm({ ...form, events: JSON.stringify(arr) });
  }

  async function handleSave() {
    if (!form.year.trim() || !form.title.trim()) return;
    await res.save(res.editing?.id ?? null, form);
  }

  const columns: Column<HistoryItem>[] = [
    { key: "year", label: "연도", width: "100px", render: (item) => <span className="font-mono font-bold">{item.year}</span> },
    {
      key: "title", label: "제목",
      render: (item) => (
        <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline font-medium text-left">{item.title}</button>
      ),
    },
    {
      key: "events", label: "이벤트", width: "80px",
      render: (item) => {
        const evts = parseEvents(item.events);
        return <span className="text-gray-500 text-xs">{evts.length}건</span>;
      },
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

  const events = parseEvents(form.events);

  return (
    <>
      <DataTable
        title="연혁 관리" description="회사 연혁 정보를 등록하고 관리합니다"
        columns={columns} data={res.items} total={res.total} page={res.page} pageSize={res.pageSize}
        onPageChange={res.setPage} searchValue={res.search} onSearchChange={res.setSearch}
        onSearch={res.doSearch} loading={res.loading} onAdd={openAdd} addLabel="+ 연혁 추가"
      />

      <Modal open={res.modalOpen} onClose={() => res.setModalOpen(false)} title={res.editing ? "연혁 수정" : "연혁 추가"} width="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연도 <span className="text-red-500">*</span></label>
              <input type="text" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="예: 2024"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목 <span className="text-red-500">*</span></label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="예: 창립 및 성장"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주요 이벤트</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={eventInput} onChange={(e) => setEventInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEvent(); } }}
                placeholder="이벤트를 입력하고 Enter 또는 추가 버튼"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <button type="button" onClick={addEvent}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 shrink-0">추가</button>
            </div>
            {events.length > 0 && (
              <ul className="space-y-1">
                {events.map((ev, i) => (
                  <li key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded text-sm">
                    <span className="text-gray-400 text-xs font-mono">{i + 1}</span>
                    <span className="flex-1">{ev}</span>
                    <button type="button" onClick={() => removeEvent(i)} className="text-red-400 hover:text-red-600 text-xs">&times;</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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

      <Modal open={!!res.deleteTarget} onClose={() => res.setDeleteTarget(null)} title="연혁 삭제">
        <div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>&ldquo;{res.deleteTarget?.year} — {res.deleteTarget?.title}&rdquo;</strong> 연혁을 삭제하시겠습니까?
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
