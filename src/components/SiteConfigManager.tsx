"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { SiteConfig } from "@/lib/types";
import { useToast } from "./Toast";

interface SiteConfigManagerProps {
  site: "union" | "dataware";
}

export default function SiteConfigManager({ site }: SiteConfigManagerProps) {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<SiteConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch<SiteConfig[]>(`/api/admin/${site}/site-config`);
      setConfigs(data);
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "설정을 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, [site, toast]);

  useEffect(() => { fetchConfigs(); }, [fetchConfigs]);

  function startEdit(config: SiteConfig) {
    setEditingId(config.id);
    setEditValue(config.configValue);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  async function handleSave(id: number, configKey: string) {
    try {
      setSaving(true);
      await apiFetch(`/api/admin/${site}/site-config/${id}`, {
        method: "PUT",
        body: JSON.stringify({ configKey, configValue: editValue }),
      });
      toast("success", "설정이 저장되었습니다");
      setEditingId(null);
      fetchConfigs();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  }

  const isLongValue = (v: string) => v.length > 60 || v.includes("http");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">사이트 설정</h1>
        <p className="text-sm text-gray-500 mt-1">
          대표전화, 주소, 푸터 정보 등 사이트 전역 설정값을 관리합니다
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">불러오는 중...</div>
        ) : configs.length === 0 ? (
          <div className="p-8 text-center text-gray-400">등록된 설정이 없습니다</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {configs.map((config) => (
              <div key={config.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {config.description || config.configKey}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">
                        {config.configKey}
                      </span>
                    </div>

                    {editingId === config.id ? (
                      <div className="mt-2">
                        {isLongValue(editValue) ? (
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSave(config.id, config.configKey)}
                            disabled={saving}
                            className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            {saving ? "저장 중..." : "저장"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 break-all">{config.configValue}</p>
                    )}
                  </div>

                  {editingId !== config.id && (
                    <button
                      onClick={() => startEdit(config)}
                      className="shrink-0 px-3 py-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
                    >
                      수정
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
