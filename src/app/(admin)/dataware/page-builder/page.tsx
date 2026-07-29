"use client";

import { useState, useEffect, useCallback } from "react";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/puck/config";
import { apiFetch, ApiError } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { ToastProvider } from "@/components/Toast";

const PAGE_KEY = "about"; // POC: dataware 회사소개 페이지

function PageBuilderInner() {
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState<string>("DRAFT");
  const [loading, setLoading] = useState(true);

  // 불러오기
  useEffect(() => {
    apiFetch<{ layoutJson: string; status: string }>(
      `/api/admin/dataware/page-layout/${PAGE_KEY}`
    )
      .then((res) => {
        try {
          const parsed = JSON.parse(res.layoutJson);
          setInitialData(parsed);
          setStatus(res.status);
        } catch {
          setInitialData({});
        }
      })
      .catch(() => setInitialData({}))
      .finally(() => setLoading(false));
  }, []);

  // 저장
  const handleSave = useCallback(
    async (data: Record<string, unknown>, publishStatus: string) => {
      try {
        await apiFetch(`/api/admin/dataware/page-layout/${PAGE_KEY}`, {
          method: "PUT",
          body: JSON.stringify({
            title: "회사소개",
            layoutJson: JSON.stringify(data),
            status: publishStatus,
          }),
        });
        setStatus(publishStatus);
        toast(
          "success",
          publishStatus === "PUBLISHED"
            ? "발행되었습니다 — 실제 사이트에 반영됩니다"
            : "임시 저장되었습니다"
        );
      } catch (err) {
        toast(
          "error",
          err instanceof ApiError ? err.message : "저장에 실패했습니다"
        );
      }
    },
    [toast]
  );

  if (loading || initialData === null) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400">
        불러오는 중...
      </div>
    );
  }

  return (
    <div style={{ height: "calc(100vh - 56px)" }}>
      <Puck
        config={puckConfig}
        data={initialData as Parameters<typeof Puck>[0]["data"]}
        onPublish={async (data) => {
          await handleSave(data as Record<string, unknown>, "PUBLISHED");
        }}
        headerTitle="dataware 회사소개"
        overrides={{
          headerActions: ({ children }) => (
            <>
              <button
                onClick={() => {
                  // Puck의 현재 데이터를 가져올 수 없으므로 draft 저장은 publish 버튼으로
                }}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 mr-2"
                style={{ display: "none" }}
              >
                임시저장
              </button>
              {children}
            </>
          ),
        }}
      />
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 flex items-center gap-3">
        <span className="text-xs text-gray-500">
          상태:{" "}
          <span
            className={`font-semibold ${
              status === "PUBLISHED" ? "text-green-600" : "text-amber-600"
            }`}
          >
            {status === "PUBLISHED" ? "발행됨" : "임시저장"}
          </span>
        </span>
        <span className="text-xs text-gray-400">
          | 오른쪽 상단 &quot;Publish&quot; 버튼으로 저장+발행
        </span>
      </div>
    </div>
  );
}

export default function PageBuilderPage() {
  return (
    <ToastProvider>
      <PageBuilderInner />
    </ToastProvider>
  );
}
