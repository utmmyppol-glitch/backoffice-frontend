"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { Seminar, SeminarStatus, PaginatedResponse } from "@/lib/types";
import { canEdit } from "@/lib/permissions";
import { getUser } from "@/lib/auth";
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
  const user = getUser();
  const editable = canEdit(user);

  const [data, setData] = useState<Seminar[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Seminar | null>(null);

  const pageSize = 15;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter) params.set("status", statusFilter);
      const res = await apiFetch<PaginatedResponse<Seminar>>(
        `/api/admin/${site}/seminars?${params}`
      );
      if (Array.isArray(res)) { setData(res); setTotal(res.length); } else { setData(res.content); setTotal(res.totalElements); }
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "세미나 신청을 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function changeStatus(id: number, status: SeminarStatus) {
    try {
      await apiFetch(`/api/admin/${site}/seminars/${id}`, {
        method: "PUT", body: JSON.stringify({ status }),
      });
      toast("success", "상태가 변경되었습니다");
      fetchData();
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "상태 변경에 실패했습니다");
    }
  }

  function formatDate(s: string) {
    try { return new Date(s).toLocaleDateString("ko-KR"); } catch { return s; }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">세미나 신청 관리</h1>
        <p className="text-sm text-gray-500 mt-1">세미나 신청을 확인하고 처리합니다</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { setPage(1); setSearchQuery(search); } }}
          placeholder="이름, 회사, 세미나명 검색..."
          className="flex-1 max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">전체 상태</option>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button onClick={() => { setPage(1); setSearchQuery(search); }}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">검색</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" style={{ width: "100px" }}>이름</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" style={{ width: "120px" }}>회사</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">세미나</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" style={{ width: "100px" }}>세미나 일자</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" style={{ width: "60px" }}>인원</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" style={{ width: "90px" }}>상태</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" style={{ width: "100px" }}>신청일</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" style={{ width: "60px" }}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">불러오는 중...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">세미나 신청이 없습니다</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">
                    <button onClick={() => { setSelected(item); setDetailOpen(true); }}
                      className="text-blue-600 hover:underline text-left">{item.name}</button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.company || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.seminar_title}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.seminar_date || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.participants}명</td>
                  <td className="px-4 py-3 text-sm"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(item.created_at)}</td>
                  <td className="px-4 py-3 text-sm">
                    <button onClick={() => { setSelected(item); setDetailOpen(true); }}
                      className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">상세</button>
                  </td>
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
              <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40">다음</button>
            </div>
          </div>
        )}
      </div>

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="세미나 신청 상세" width="max-w-2xl">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-xs text-gray-500">이름</span><p className="text-sm font-medium">{selected.name}</p></div>
              <div><span className="text-xs text-gray-500">회사</span><p className="text-sm font-medium">{selected.company || "-"}</p></div>
              <div><span className="text-xs text-gray-500">이메일</span><p className="text-sm">{selected.email || "-"}</p></div>
              <div><span className="text-xs text-gray-500">연락처</span><p className="text-sm">{selected.phone || "-"}</p></div>
              <div><span className="text-xs text-gray-500">세미나명</span><p className="text-sm font-medium">{selected.seminar_title}</p></div>
              <div><span className="text-xs text-gray-500">세미나 일자</span><p className="text-sm">{selected.seminar_date || "-"}</p></div>
              <div><span className="text-xs text-gray-500">참가 인원</span><p className="text-sm">{selected.participants}명</p></div>
              <div><span className="text-xs text-gray-500">개인정보 동의</span><p className="text-sm">{selected.privacy_agreed ? "동의함" : "미동의"}</p></div>
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
            </div>
            <div className="text-xs text-gray-400">신청일: {formatDate(selected.created_at)}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
