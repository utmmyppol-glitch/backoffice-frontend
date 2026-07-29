"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { Inquiry, InquiryStatus, PaginatedResponse } from "@/lib/types";
import { canEdit } from "@/lib/permissions";
import { getUser } from "@/lib/auth";
import { Column } from "./DataTable";
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
  const user = getUser();
  const editable = canEdit(user);

  const [data, setData] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const pageSize = 15;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter) params.set("status", statusFilter);
      const res = await apiFetch<PaginatedResponse<Inquiry>>(
        `/api/admin/${site}/inquiries?${params}`
      );
      setData(res.content);
      setTotal(res.totalElements);
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "문의를 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, [site, page, searchQuery, statusFilter, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function openDetail(item: Inquiry) {
    setSelected(item);
    setDetailOpen(true);
  }

  async function changeStatus(id: number, status: InquiryStatus) {
    try {
      await apiFetch(`/api/admin/${site}/inquiries/${id}`, {
        method: "PUT", body: JSON.stringify({ status }),
      });
      toast("success", "상태가 변경되었습니다");
      fetchData();
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
        method: "PUT", body: JSON.stringify({ assignee }),
      });
      toast("success", "담당자가 지정되었습니다");
      fetchData();
      if (selected?.id === id) setSelected({ ...selected, assignee });
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "담당자 지정에 실패했습니다");
    }
  }

  function formatDate(s: string) {
    try { return new Date(s).toLocaleDateString("ko-KR"); } catch { return s; }
  }

  const columns: Column<Inquiry>[] = [
    {
      key: "name", label: "이름", width: "100px",
      render: (item) => (
        <button onClick={() => openDetail(item)} className="text-blue-600 hover:underline font-medium text-left">
          {item.name}
        </button>
      ),
    },
    { key: "company", label: "회사", width: "130px", render: (item) => item.company || "-" },
    { key: "phone", label: "연락처", width: "130px", render: (item) => item.phone || "-" },
    { key: "product", label: "관심 제품", width: "130px", render: (item) => item.product || "-" },
    {
      key: "status", label: "상태", width: "100px",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "assignee", label: "담당자", width: "100px",
      render: (item) => item.assignee || <span className="text-gray-300">미지정</span>,
    },
    { key: "created_at", label: "접수일", width: "100px", render: (item) => formatDate(item.created_at) },
    {
      key: "actions", label: "", width: "80px",
      render: (item) => (
        <button onClick={() => openDetail(item)} className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">
          상세
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">문의 관리</h1>
        <p className="text-sm text-gray-500 mt-1">고객 문의를 확인하고 처리합니다</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { setPage(1); setSearchQuery(search); } }}
          placeholder="이름, 회사, 제품 검색..."
          className="flex-1 max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">전체 상태</option>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button onClick={() => { setPage(1); setSearchQuery(search); }}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">검색</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  style={col.width ? { width: col.width } : undefined}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">불러오는 중...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">문의가 없습니다</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-700">{col.render(item)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <span className="text-xs text-gray-500">전체 {total}건</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(page - 1)} disabled={page <= 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40">이전</button>
              <button onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(total / pageSize)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40">다음</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="문의 상세" width="max-w-2xl">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500">이름</span>
                <p className="text-sm font-medium">{selected.name}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">회사</span>
                <p className="text-sm font-medium">{selected.company || "-"}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">이메일</span>
                <p className="text-sm">{selected.email || "-"}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">연락처</span>
                <p className="text-sm">{selected.phone || "-"}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">관심 제품</span>
                <p className="text-sm">{selected.product || "-"}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">개인정보 동의</span>
                <p className="text-sm">{selected.privacy_agreed ? "동의함" : "미동의"}</p>
              </div>
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

            <div className="text-xs text-gray-400">
              접수일: {formatDate(selected.created_at)}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
