"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { PaginatedResponse } from "@/lib/types";
import { useToast } from "@/components/Toast";

interface UseResourceOptions {
  /** API 경로 세그먼트 (예: "posts", "banners") */
  endpoint: string;
  /** 사이트 (union | dataware) */
  site: string;
  /** 한 페이지 항목 수 (기본 15) */
  pageSize?: number;
  /** 토스트에 표시할 엔티티 이름 (예: "게시글", "배너") */
  entityName: string;
}

export default function useResource<T extends { id: number }>({
  endpoint,
  site,
  pageSize = 15,
  entityName,
}: UseResourceOptions) {
  const { toast } = useToast();

  // ── 목록 ──
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // ── CRUD 상태 ──
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  const basePath = `/api/admin/${site}/${endpoint}`;

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page - 1),
        size: String(pageSize),
      });
      if (searchQuery) params.set("search", searchQuery);
      const res = await apiFetch<PaginatedResponse<T> | T[]>(`${basePath}?${params}`);
      if (Array.isArray(res)) {
        setItems(res);
        setTotal(res.length);
      } else {
        setItems(res.content);
        setTotal(res.totalElements);
      }
    } catch (err) {
      toast(
        "error",
        err instanceof ApiError ? err.message : `${entityName}을(를) 불러오지 못했습니다`
      );
    } finally {
      setLoading(false);
    }
  }, [basePath, page, pageSize, searchQuery, entityName, toast]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  /** 검색 실행 (page를 1로 리셋) */
  function doSearch() {
    setPage(1);
    setSearchQuery(search);
  }

  /** 추가 모달 열기 */
  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  /** 수정 모달 열기 */
  function openEdit(item: T) {
    setEditing(item);
    setModalOpen(true);
  }

  /** 저장 (id가 있으면 PUT, 없으면 POST). 성공 시 true 반환 */
  async function save(id: number | null, body: unknown): Promise<boolean> {
    try {
      setSaving(true);
      if (id) {
        await apiFetch(`${basePath}/${id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        toast("success", `${entityName}이(가) 수정되었습니다`);
      } else {
        await apiFetch(basePath, {
          method: "POST",
          body: JSON.stringify(body),
        });
        toast("success", `${entityName}이(가) 추가되었습니다`);
      }
      setModalOpen(false);
      fetchList();
      return true;
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "저장에 실패했습니다");
      return false;
    } finally {
      setSaving(false);
    }
  }

  /** 삭제 확인 후 실행 */
  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await apiFetch(`${basePath}/${deleteTarget.id}`, { method: "DELETE" });
      toast("success", `${entityName}이(가) 삭제되었습니다`);
      setDeleteTarget(null);
      fetchList();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "삭제에 실패했습니다");
    }
  }

  /** 부분 업데이트 (예: 노출 토글) */
  async function patch(id: number, body: unknown) {
    try {
      await apiFetch(`${basePath}/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      fetchList();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "변경에 실패했습니다");
    }
  }

  return {
    // 목록
    items,
    total,
    page,
    setPage,
    search,
    setSearch,
    doSearch,
    loading,
    pageSize,
    reload: fetchList,

    // CRUD
    save,
    confirmDelete,
    patch,
    saving,

    // 모달
    modalOpen,
    setModalOpen,
    editing,
    openAdd,
    openEdit,
    deleteTarget,
    setDeleteTarget,
  };
}
