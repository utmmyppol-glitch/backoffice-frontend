"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { MenuItem, MenuFormData } from "@/lib/types";
import Modal from "./Modal";
import { useToast } from "./Toast";

interface MenuManagerProps {
  site: "union" | "dataware";
}

const MENU_TYPE_LABELS: Record<string, string> = {
  CONTENT: "콘텐츠",
  BOARD: "게시판",
  EXTERNAL: "외부 링크",
};

const emptyForm: MenuFormData = {
  parent_id: null,
  name: "",
  menu_type: "CONTENT",
  url: "",
  visible: true,
};

// Flatten tree → flat list (for parent selector)
function flattenTree(items: MenuItem[], depth = 0): (MenuItem & { depth: number })[] {
  const result: (MenuItem & { depth: number })[] = [];
  for (const item of items) {
    result.push({ ...item, depth });
    if (item.children?.length) {
      result.push(...flattenTree(item.children, depth + 1));
    }
  }
  return result;
}

export default function MenuManager({ site }: MenuManagerProps) {
  const { toast } = useToast();
  const [tree, setTree] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<MenuFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<MenuItem | null>(null);

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch<MenuItem[]>(`/api/admin/${site}/menus`);
      setTree(data);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "메뉴를 불러오지 못했습니다";
      toast("error", msg);
    } finally {
      setLoading(false);
    }
  }, [site, toast]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // ── Open modal ──
  function openAdd(parentId: number | null = null) {
    setEditing(null);
    setForm({ ...emptyForm, parent_id: parentId });
    setModalOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditing(item);
    setForm({
      parent_id: item.parent_id,
      name: item.name,
      menu_type: item.menu_type,
      url: item.url,
      visible: item.visible,
    });
    setModalOpen(true);
  }

  // ── Save ──
  async function handleSave() {
    if (!form.name.trim()) {
      toast("error", "메뉴 이름을 입력하세요");
      return;
    }
    if (form.menu_type === "EXTERNAL" && !form.url.trim()) {
      toast("error", "외부 링크 URL을 입력하세요");
      return;
    }
    try {
      setSaving(true);
      if (editing) {
        await apiFetch(`/api/admin/${site}/menus/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast("success", "메뉴가 수정되었습니다");
      } else {
        await apiFetch(`/api/admin/${site}/menus`, {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast("success", "메뉴가 추가되었습니다");
      }
      setModalOpen(false);
      fetchMenus();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "저장에 실패했습니다";
      toast("error", msg);
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ──
  async function handleDelete() {
    if (!deleteConfirm) return;
    try {
      await apiFetch(`/api/admin/${site}/menus/${deleteConfirm.id}`, { method: "DELETE" });
      toast("success", "메뉴가 삭제되었습니다");
      setDeleteConfirm(null);
      fetchMenus();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "삭제에 실패했습니다";
      toast("error", msg);
    }
  }

  // ── Visibility toggle ──
  async function toggleVisible(item: MenuItem) {
    try {
      await apiFetch(`/api/admin/${site}/menus/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ visible: !item.visible }),
      });
      fetchMenus();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "변경에 실패했습니다";
      toast("error", msg);
    }
  }

  // ── Reorder ──
  async function moveMenu(item: MenuItem, direction: "up" | "down") {
    try {
      await apiFetch(`/api/admin/${site}/menus/${item.id}/reorder`, {
        method: "PUT",
        body: JSON.stringify({ direction }),
      });
      fetchMenus();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "순서 변경에 실패했습니다";
      toast("error", msg);
    }
  }

  // ── Tree rendering ──
  function renderTree(items: MenuItem[], depth = 0) {
    return items.map((item, idx) => (
      <div key={item.id}>
        <div
          className={`flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
            depth > 0 ? "bg-gray-50/50" : ""
          }`}
          style={{ paddingLeft: `${16 + depth * 28}px` }}
        >
          {/* Depth indicator */}
          {depth > 0 && (
            <span className="text-gray-300 text-xs mr-1">└</span>
          )}

          {/* Name & type */}
          <div className="flex-1 min-w-0">
            <span className={`text-sm font-medium ${item.visible ? "text-gray-900" : "text-gray-400 line-through"}`}>
              {item.name}
            </span>
            <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
              {MENU_TYPE_LABELS[item.menu_type]}
            </span>
            {item.url && (
              <span className="ml-2 text-xs text-gray-400 truncate">{item.url}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Reorder buttons */}
            <button
              onClick={() => moveMenu(item, "up")}
              disabled={idx === 0}
              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
              title="위로"
            >
              ▲
            </button>
            <button
              onClick={() => moveMenu(item, "down")}
              disabled={idx === items.length - 1}
              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
              title="아래로"
            >
              ▼
            </button>

            {/* Visibility toggle */}
            <button
              onClick={() => toggleVisible(item)}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                item.visible ? "bg-green-500" : "bg-gray-300"
              }`}
              title={item.visible ? "노출 중" : "숨김"}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  item.visible ? "left-[18px]" : "left-0.5"
                }`}
              />
            </button>

            {/* Add child */}
            <button
              onClick={() => openAdd(item.id)}
              className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
              title="하위 메뉴 추가"
            >
              + 하위
            </button>

            {/* Edit */}
            <button
              onClick={() => openEdit(item)}
              className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
            >
              수정
            </button>

            {/* Delete */}
            <button
              onClick={() => setDeleteConfirm(item)}
              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
            >
              삭제
            </button>
          </div>
        </div>

        {/* Children */}
        {item.children && item.children.length > 0 && renderTree(item.children, depth + 1)}
      </div>
    ));
  }

  const flatItems = flattenTree(tree);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">메뉴 관리</h1>
          <p className="text-sm text-gray-500 mt-1">사이트 메뉴 구조를 관리합니다</p>
        </div>
        <button
          onClick={() => openAdd(null)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 메뉴 추가
        </button>
      </div>

      {/* Tree */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">불러오는 중...</div>
        ) : tree.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            등록된 메뉴가 없습니다. 위 버튼으로 메뉴를 추가하세요.
          </div>
        ) : (
          renderTree(tree)
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "메뉴 수정" : "메뉴 추가"}
      >
        <div className="space-y-4">
          {/* Parent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상위 메뉴</label>
            <select
              value={form.parent_id ?? ""}
              onChange={(e) =>
                setForm({ ...form, parent_id: e.target.value ? Number(e.target.value) : null })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">최상위</option>
              {flatItems
                .filter((fi) => !editing || fi.id !== editing.id)
                .map((fi) => (
                  <option key={fi.id} value={fi.id}>
                    {"─".repeat(fi.depth)} {fi.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">메뉴 이름</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="예: 회사소개"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Menu Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">메뉴 타입</label>
            <div className="flex gap-3">
              {(["CONTENT", "BOARD", "EXTERNAL"] as const).map((t) => (
                <label key={t} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="menu_type"
                    checked={form.menu_type === t}
                    onChange={() => setForm({ ...form, menu_type: t })}
                    className="accent-blue-600"
                  />
                  {MENU_TYPE_LABELS[t]}
                </label>
              ))}
            </div>
          </div>

          {/* URL (for external) */}
          {form.menu_type === "EXTERNAL" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {/* Visible */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">노출 여부</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, visible: !form.visible })}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.visible ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.visible ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="메뉴 삭제"
      >
        <div>
          <p className="text-sm text-gray-700 mb-1">
            <strong>&ldquo;{deleteConfirm?.name}&rdquo;</strong> 메뉴를 삭제하시겠습니까?
          </p>
          <p className="text-xs text-red-600 mb-4">
            하위 메뉴가 있다면 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              취소
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              삭제
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
