"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

interface SidebarProps {
  site: "union" | "dataware";
  items: NavItem[];
}

const themeClasses = {
  union: {
    header: "bg-red-700",
    active: "bg-red-50 text-red-700 border-red-600",
    hover: "hover:bg-red-50 hover:text-red-700",
  },
  dataware: {
    header: "bg-emerald-700",
    active: "bg-emerald-50 text-emerald-700 border-emerald-600",
    hover: "hover:bg-emerald-50 hover:text-emerald-700",
  },
};

export default function Sidebar({ site, items }: SidebarProps) {
  const pathname = usePathname();
  const theme = themeClasses[site];

  return (
    <aside className="w-60 bg-white border-r border-gray-200 shrink-0 flex flex-col">
      {/* Site Header */}
      <div className={`${theme.header} text-white px-4 py-3`}>
        <div className="font-bold text-sm">
          {site === "union" ? "유니온시스템즈" : "데이터웨어(엔코아)"}
        </div>
        <div className="text-xs opacity-75 mt-0.5">사이트 관리</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2.5 text-sm transition-colors border-l-3 ${
                isActive
                  ? `${theme.active} border-l-[3px]`
                  : `border-l-[3px] border-transparent text-gray-600 ${theme.hover}`
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
