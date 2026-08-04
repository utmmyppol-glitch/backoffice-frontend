"use client";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  NEW: { bg: "bg-blue-100", text: "text-blue-700", label: "신규" },
  IN_PROGRESS: { bg: "bg-amber-100", text: "text-amber-700", label: "처리 중" },
  CONFIRMED: { bg: "bg-indigo-100", text: "text-indigo-700", label: "확인됨" },
  COMPLETED: { bg: "bg-green-100", text: "text-green-700", label: "완료" },
  CANCELLED: { bg: "bg-gray-100", text: "text-gray-500", label: "취소" },
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || { bg: "bg-gray-100", text: "text-gray-600", label: status };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}
