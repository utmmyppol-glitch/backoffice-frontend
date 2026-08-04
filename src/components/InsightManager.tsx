"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { Insight, InsightStatus, PaginatedResponse } from "@/lib/types";
import { useToast } from "./Toast";

const STATUS_TABS: { value: InsightStatus | ""; label: string }[] = [
  { value: "PENDING", label: "승인대기" },
  { value: "APPROVED", label: "승인됨" },
  { value: "REJECTED", label: "거부됨" },
  { value: "", label: "전체" },
];

export default function InsightManager() {
  const { toast } = useToast();

  const [data, setData] = useState<Insight[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<InsightStatus | "">("PENDING");
  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState(false);

  const pageSize = 15;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page - 1),
        size: String(pageSize),
      });
      if (statusFilter) params.set("status", statusFilter);
      const res = await apiFetch<PaginatedResponse<Insight>>(
        `/api/admin/union/insights?${params}`
      );
      if (Array.isArray(res)) {
        setData(res);
        setTotal(res.length);
      } else {
        setData(res.content);
        setTotal(res.totalElements);
      }
    } catch (err) {
      toast(
        "error",
        err instanceof ApiError ? err.message : "인사이트를 불러오지 못했습니다"
      );
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleApprove(id: number) {
    try {
      await apiFetch(`/api/admin/union/insights/${id}/approve`, {
        method: "PATCH",
      });
      toast("success", "승인되었습니다");
      fetchData();
    } catch (err) {
      toast(
        "error",
        err instanceof ApiError ? err.message : "승인에 실패했습니다"
      );
    }
  }

  async function handleReject(id: number) {
    try {
      await apiFetch(`/api/admin/union/insights/${id}/reject`, {
        method: "PATCH",
      });
      toast("success", "거부되었습니다");
      fetchData();
    } catch (err) {
      toast(
        "error",
        err instanceof ApiError ? err.message : "거부에 실패했습니다"
      );
    }
  }

  async function handleCollect() {
    try {
      setCollecting(true);
      await apiFetch("/api/admin/union/insights/collect", { method: "POST" });
      toast("success", "수집이 시작되었습니다");
      fetchData();
    } catch (err) {
      toast(
        "error",
        err instanceof ApiError ? err.message : "수집 요청에 실패했습니다"
      );
    } finally {
      setCollecting(false);
    }
  }

  function formatDate(s: string | null | undefined): string {
    if (!s) return "";
    const d = new Date(s);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">인사이트 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            수집된 인사이트 기사를 승인하거나 거부합니다
          </p>
        </div>
        <button
          onClick={handleCollect}
          disabled={collecting}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {collecting ? "수집 중..." : "지금 수집"}
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-4">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value as InsightStatus | "");
              setPage(1);
            }}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              statusFilter === tab.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[60px]">
                이미지
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                제목 / 요약
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">
                출처
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">
                날짜
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[60px]">
                원문
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[140px]">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  불러오는 중...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  인사이트가 없습니다
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt=""
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">
                        N/A
                      </div>
                    )}
                  </td>
                  {/* Title + Summary */}
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-md">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-md">
                      {item.summary}
                    </p>
                  </td>
                  {/* Source */}
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.sourceName}
                  </td>
                  {/* Date */}
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(item.publishedAt)}
                  </td>
                  {/* Link */}
                  <td className="px-4 py-3">
                    {item.sourceUrl ? (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        보기
                      </a>
                    ) : null}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    {item.status === "PENDING" ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                        >
                          거부
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded font-medium ${
                          item.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status === "APPROVED" ? "승인됨" : "거부됨"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <span className="text-xs text-gray-500">
              전체 {total}건 (페이지 {page}/{totalPages})
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                이전
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(
                  1,
                  Math.min(page - 2, totalPages - 4)
                );
                const p = start + i;
                if (p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 text-sm border rounded ${
                      p === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
