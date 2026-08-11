"use client";

export interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onSearch: () => void;
  loading: boolean;
  title: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
  /** 검색 입력 placeholder (기본: "검색어 입력...") */
  searchPlaceholder?: string;
  /** 검색바 옆에 렌더할 추가 필터 (예: 상태 select) */
  filterSlot?: React.ReactNode;
}

export default function DataTable<T>({
  columns,
  data,
  total,
  page,
  pageSize,
  onPageChange,
  searchValue,
  onSearchChange,
  onSearch,
  loading,
  title,
  description,
  onAdd,
  addLabel = "+ 추가",
  searchPlaceholder = "검색어 입력...",
  filterSlot,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {addLabel}
          </button>
        )}
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder={searchPlaceholder}
          className="flex-1 max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {filterSlot}
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
        >
          검색
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  불러오는 중...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-700">
                      {col.render(item)}
                    </td>
                  ))}
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
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                이전
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const p = start + i;
                if (p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
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
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
