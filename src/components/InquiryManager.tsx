"use client";

import { useState } from "react";
import { Inquiry, InquiryStatus } from "@/lib/types";
import { canEdit } from "@/lib/permissions";
import { getUser } from "@/lib/auth";
import { apiFetch, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import useResource from "@/hooks/useResource";
import DataTable, { Column } from "./DataTable";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import { useToast } from "./Toast";

interface InquiryManagerProps {
  site: "union" | "dataware";
}

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: "NEW", label: "신규" },
  { value: "IN_PROGRESS", label: "처리 중" },
  { value: "COMPLETED", label: "완료" },
];

export default function InquiryManager({ site }: InquiryManagerProps) {
  const { toast } = useToast();
  const editable = canEdit(getUser());

  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const res = useResource<Inquiry>({
    endpoint: "inquiries",
    site,
    entityName: "문의",
    extraParams: statusFilter ? { status: statusFilter } : undefined,
  });

  async function changeStatus(id: number, status: InquiryStatus) {
    try {
      await apiFetch(`/api/admin/${site}/inquiries/${id}`, {
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

  async function changeAssignee(id: number) {
    const assignee = window.prompt("담당자 이름을 입력하세요:");
    if (assignee === null) return;
    try {
      await apiFetch(`/api/admin/${site}/inquiries/${id}`, {
        method: "PUT",
        body: JSON.stringify({ assignee }),
      });
      toast("success", "담당자가 지정되었습니다");
      res.reload();
      if (selected?.id === id) setSelected({ ...selected, assignee });
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "담당자 지정에 실패했습니다");
    }
  }

  function openDetail(item: Inquiry) {
    setSelected(item);
    setDetailOpen(true);
  }

  const columns: Column<Inquiry>[] = [
    {
      key: "name", label: "이름", width: "100px",
      render: (item) => (
        <button onClick={() => openDetail(item)} className="text-blue-600 hover:underline font-medium text-left">{item.name}</button>
      ),
    },
    { key: "company", label: "회사", width: "120px", render: (item) => item.company || "-" },
    { key: "email", label: "이메일", width: "160px", render: (item) => item.email || "-" },
    { key: "phone", label: "연락처", width: "120px", render: (item) => item.phone || "-" },
    { key: "product", label: "관심 제품", width: "130px", render: (item) => item.product || "-" },
    { key: "status", label: "상태", width: "100px", render: (item) => <StatusBadge status={item.status} /> },
    {
      key: "assignee", label: "담당자", width: "100px",
      render: (item) => item.assignee || <span className="text-gray-300">미지정</span>,
    },
    { key: "createdAt", label: "접수일", width: "100px", render: (item) => formatDate(item.createdAt) },
    {
      key: "actions", label: "", width: "80px",
      render: (item) => (
        <button onClick={() => openDetail(item)} className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">상세</button>
      ),
    },
  ];

  const filterSlot = (
    <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); res.setPage(1); }}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      <option value="">전체 상태</option>
      {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  return (
    <>
      <DataTable
        title="문의 관리" description="고객 문의를 확인하고 처리합니다"
        columns={columns} data={res.items} total={res.total} page={res.page} pageSize={res.pageSize}
        onPageChange={res.setPage} searchValue={res.search} onSearchChange={res.setSearch}
        onSearch={res.doSearch} loading={res.loading}
        searchPlaceholder="이름, 회사, 제품 검색..." filterSlot={filterSlot}
      />

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="문의 상세" width="max-w-2xl">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-xs text-gray-500">이름</span><p className="text-sm font-medium">{selected.name}</p></div>
              <div><span className="text-xs text-gray-500">회사</span><p className="text-sm font-medium">{selected.company || "-"}</p></div>
              <div><span className="text-xs text-gray-500">이메일</span><p className="text-sm">{selected.email || "-"}</p></div>
              <div><span className="text-xs text-gray-500">연락처</span><p className="text-sm">{selected.phone || "-"}</p></div>
              <div><span className="text-xs text-gray-500">관심 제품</span><p className="text-sm">{selected.product || "-"}</p></div>
              <div><span className="text-xs text-gray-500">개인정보 동의</span><p className="text-sm">{selected.consentPrivacy ? "동의함" : "미동의"}</p></div>
            </div>
            <div>
              <span className="text-xs text-gray-500">문의 내용</span>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-800 whitespace-pre-wrap">
                {selected.message || "(내용 없음)"}
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">상태:</span>
                <StatusBadge status={selected.status} />
                {editable && (
                  <select value={selected.status}
                    onChange={(e) => changeStatus(selected.id, e.target.value as InquiryStatus)}
                    className="ml-1 text-sm border border-gray-300 rounded px-2 py-1">
                    {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">담당자:</span>
                <span className="text-sm font-medium">{selected.assignee || "미지정"}</span>
                {editable && (
                  <button onClick={() => changeAssignee(selected.id)}
                    className="text-xs text-blue-600 hover:underline">변경</button>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-400">접수일: {formatDate(selected.createdAt)}</div>
          </div>
        )}
      </Modal>
    </>
  );
}
