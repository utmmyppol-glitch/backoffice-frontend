"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { Download, PaginatedResponse } from "@/lib/types";
import { useToast } from "./Toast";

interface DownloadViewerProps {
  site: "union" | "dataware";
}

export default function DownloadViewer({ site }: DownloadViewerProps) {
  const { toast } = useToast();
  const [data, setData] = useState<Download[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Download | null>(null);

  const pageSize = 20;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page - 1), size: String(pageSize) });
      if (searchQuery) params.set("search", searchQuery);
      const res = await apiFetch<PaginatedResponse<Download>>(
        `/api/admin/${site}/downloads?${params}`
      );
      if (Array.isArray(res)) { setData(res); setTotal(res.length); } else { setData(res.content); setTotal(res.totalElements); }
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "다운로드 이력을 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, [site, page, searchQuery, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function formatDateTime(s: string | undefined | null) {
    if (!s) return "-";
    try {
      const d = new Date(s);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleString("ko-KR", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return "-"; }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">다운로드 조회</h1>
        <p className="text-sm text-gray-500 mt-1">자료 다운로드 이력을 조회합니다 (읽기 전용)</p>
      </div>

      <div className="flex gap-2 mb-4">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { setPage(1); setSearchQuery(search); } }}
          placeholder="이름, 회사, 자료명 검색..."
          className="flex-1 max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        <button onClick={() => { setPage(1); setSearchQuery(search); }}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">검색</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" style={{ width: "100px" }}>이름</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" style={{ width: "130px" }}>회사</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" style={{ width: "130px" }}>연락처</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">다운로드 자료</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" style={{ width: "70px" }}>동의</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" style={{ width: "150px" }}>일시</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">불러오는 중...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">다운로드 이력이 없습니다</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(item)}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.company || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.phone || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.resourceName || "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    {item.privacyAgreed ? (
                      <span className="text-green-600 text-xs font-medium">동의</span>
                    ) : (
                      <span className="text-gray-400 text-xs">미동의</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(item.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <span className="text-xs text-gray-500">전체 {total}건 (페이지 {page}/{totalPages})</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(page - 1)} disabled={page <= 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40">이전</button>
              <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40">다음</button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">다운로드 상세</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <DetailRow label="이름" value={selected.name} />
              <DetailRow label="회사" value={selected.company} />
              <DetailRow label="이메일" value={selected.email} />
              <DetailRow label="연락처" value={selected.phone} />
              <DetailRow label="다운로드 자료" value={selected.resourceName} />
              <DetailRow label="개인정보 동의" value={selected.privacyAgreed ? "동의" : "미동의"} />
              <DetailRow label="다운로드 일시" value={formatDateTime(selected.createdAt)} />
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button onClick={() => setSelected(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div className="flex">
      <span className="w-28 shrink-0 text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value || "-"}</span>
    </div>
  );
}
