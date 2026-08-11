"use client";

import { useState } from "react";
import { Download } from "@/lib/types";
import { canEdit } from "@/lib/permissions";
import { getUser } from "@/lib/auth";
import { apiFetch, ApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import useResource from "@/hooks/useResource";
import DataTable, { Column } from "./DataTable";
import Modal from "./Modal";
import { useToast } from "./Toast";

interface DownloadViewerProps {
  site: "union" | "dataware";
}

export default function DownloadViewer({ site }: DownloadViewerProps) {
  const { toast } = useToast();
  const editable = canEdit(getUser());

  const [selected, setSelected] = useState<Download | null>(null);

  const res = useResource<Download>({
    endpoint: "downloads",
    site,
    pageSize: 20,
    entityName: "다운로드 신청",
  });

  async function remove(id: number) {
    if (!confirm("이 다운로드 신청을 삭제할까요? 되돌릴 수 없습니다.")) return;
    try {
      await apiFetch(`/api/admin/${site}/downloads/${id}`, { method: "DELETE" });
      toast("success", "삭제되었습니다");
      setSelected(null);
      res.reload();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "삭제에 실패했습니다");
    }
  }

  const columns: Column<Download>[] = [
    {
      key: "name", label: "이름", width: "100px",
      render: (item) => (
        <button onClick={() => setSelected(item)} className="text-blue-600 hover:underline font-medium text-left">{item.name}</button>
      ),
    },
    { key: "company", label: "회사", width: "130px", render: (item) => item.company || "-" },
    { key: "phone", label: "연락처", width: "130px", render: (item) => item.phone || "-" },
    { key: "resourceName", label: "다운로드 자료", render: (item) => item.resourceName || "-" },
    {
      key: "privacyAgreed", label: "동의", width: "70px",
      render: (item) => item.privacyAgreed
        ? <span className="text-green-600 text-xs font-medium">동의</span>
        : <span className="text-gray-400 text-xs">미동의</span>,
    },
    { key: "createdAt", label: "일시", width: "150px", render: (item) => formatDateTime(item.createdAt) },
  ];

  return (
    <>
      <DataTable
        title="다운로드 신청" description="자료 다운로드 신청 내역입니다"
        columns={columns} data={res.items} total={res.total} page={res.page} pageSize={res.pageSize}
        onPageChange={res.setPage} searchValue={res.search} onSearchChange={res.setSearch}
        onSearch={res.doSearch} loading={res.loading}
        searchPlaceholder="이름, 회사, 자료명 검색..."
      />

      <Modal open={!!selected} onClose={() => setSelected(null)} title="다운로드 상세">
        {selected && (
          <div className="space-y-3">
            <DetailRow label="이름" value={selected.name} />
            <DetailRow label="회사" value={selected.company} />
            <DetailRow label="이메일" value={selected.email} />
            <DetailRow label="연락처" value={selected.phone} />
            <DetailRow label="다운로드 자료" value={selected.resourceName} />
            <DetailRow label="개인정보 동의" value={selected.privacyAgreed ? "동의" : "미동의"} />
            <DetailRow label="신청 일시" value={formatDateTime(selected.createdAt)} />
            <div className="flex justify-between pt-3 border-t border-gray-200">
              {editable ? (
                <button onClick={() => remove(selected.id)}
                  className="px-4 py-2 text-red-600 border border-red-200 text-sm rounded-lg hover:bg-red-50">삭제</button>
              ) : <span />}
              <button onClick={() => setSelected(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">닫기</button>
            </div>
          </div>
        )}
      </Modal>
    </>
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
