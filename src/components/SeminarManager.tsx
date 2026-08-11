"use client";

import { useState } from "react";
import { Seminar, SeminarStatus } from "@/lib/types";
import { canEdit } from "@/lib/permissions";
import { getUser } from "@/lib/auth";
import { apiFetch, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import useResource from "@/hooks/useResource";
import DataTable, { Column } from "./DataTable";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import { useToast } from "./Toast";

const STATUS_OPTIONS: { value: SeminarStatus; label: string }[] = [
  { value: "NEW", label: "신규" },
  { value: "CONFIRMED", label: "확인됨" },
  { value: "COMPLETED", label: "완료" },
  { value: "CANCELLED", label: "취소" },
];

export default function SeminarManager() {
  const site = "dataware";
  const { toast } = useToast();
  const editable = canEdit(getUser());

  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Seminar | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const res = useResource<Seminar>({
    endpoint: "seminars",
    site,
    entityName: "세미나 신청",
    extraParams: statusFilter ? { status: statusFilter } : undefined,
  });

  async function changeStatus(id: number, status: SeminarStatus) {
    try {
      await apiFetch(`/api/admin/${site}/seminars/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      toast("success", "상태가 변경되었습니다");
      res.reload();
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "상태 변경에 실패했습니다");
    }
  }

  async function remove(id: number) {
    if (!confirm("이 세미나 신청을 삭제할까요? 되돌릴 수 없습니다.")) return;
    try {
      await apiFetch(`/api/admin/${site}/seminars/${id}`, { method: "DELETE" });
      toast("success", "삭제되었습니다");
      if (selected?.id === id) setDetailOpen(false);
      res.reload();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "삭제에 실패했습니다");
    }
  }

  function openDetail(item: Seminar) {
    setSelected(item);
    setDetailOpen(true);
  }

  const columns: Column<Seminar>[] = [
    {
      key: "name", label: "이름", width: "100px",
      render: (item) => (
        <button onClick={() => openDetail(item)} className="text-blue-600 hover:underline font-medium text-left">{item.name}</button>
      ),
    },
    { key: "company", label: "회사", width: "120px", render: (item) => item.company || "-" },
    { key: "seminarTitle", label: "세미나", render: (item) => item.seminarTitle },
    { key: "seminarDate", label: "세미나 일자", width: "100px", render: (item) => item.seminarDate || "-" },
    { key: "participants", label: "인원", width: "60px", render: (item) => `${item.participants}명` },
    { key: "status", label: "상태", width: "90px", render: (item) => <StatusBadge status={item.status} /> },
    { key: "createdAt", label: "신청일", width: "100px", render: (item) => formatDate(item.createdAt) },
    {
      key: "actions", label: "", width: "60px",
      render: (item) => (
        <button onClick={() => openDetail(item)} className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">상세</button>
      ),
    },
  ];

  const filterSlot = (
    <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); res.setPage(1); }}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
      <option value="">전체 상태</option>
      {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  return (
    <>
      <DataTable
        title="세미나 신청 관리" description="세미나 신청을 확인하고 처리합니다"
        columns={columns} data={res.items} total={res.total} page={res.page} pageSize={res.pageSize}
        onPageChange={res.setPage} searchValue={res.search} onSearchChange={res.setSearch}
        onSearch={res.doSearch} loading={res.loading}
        searchPlaceholder="이름, 회사, 세미나명 검색..." filterSlot={filterSlot}
      />

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="세미나 신청 상세" width="max-w-2xl">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-xs text-gray-500">이름</span><p className="text-sm font-medium">{selected.name}</p></div>
              <div><span className="text-xs text-gray-500">회사</span><p className="text-sm font-medium">{selected.company || "-"}</p></div>
              <div><span className="text-xs text-gray-500">이메일</span><p className="text-sm">{selected.email || "-"}</p></div>
              <div><span className="text-xs text-gray-500">연락처</span><p className="text-sm">{selected.phone || "-"}</p></div>
              <div><span className="text-xs text-gray-500">세미나명</span><p className="text-sm font-medium">{selected.seminarTitle}</p></div>
              <div><span className="text-xs text-gray-500">세미나 일자</span><p className="text-sm">{selected.seminarDate || "-"}</p></div>
              <div><span className="text-xs text-gray-500">참가 인원</span><p className="text-sm">{selected.participants}명</p></div>
              <div><span className="text-xs text-gray-500">개인정보 동의</span><p className="text-sm">{selected.privacyAgreed ? "동의함" : "미동의"}</p></div>
            </div>
            {selected.message && (
              <div>
                <span className="text-xs text-gray-500">요청사항</span>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">{selected.message}</div>
              </div>
            )}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">상태:</span>
              <StatusBadge status={selected.status} />
              {editable && (
                <select value={selected.status}
                  onChange={(e) => changeStatus(selected.id, e.target.value as SeminarStatus)}
                  className="text-sm border border-gray-300 rounded px-2 py-1">
                  {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              )}
              {editable && (
                <button onClick={() => remove(selected.id)}
                  className="ml-auto px-3 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50">삭제</button>
              )}
            </div>
            <div className="text-xs text-gray-400">신청일: {formatDate(selected.createdAt)}</div>
          </div>
        )}
      </Modal>
    </>
  );
}
