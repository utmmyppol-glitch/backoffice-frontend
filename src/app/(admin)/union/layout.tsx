"use client";

import Sidebar from "@/components/Sidebar";
import { getUser } from "@/lib/auth";
import { filterMenuForUser } from "@/lib/permissions";

const unionMenu = [
  { label: "대시보드", href: "/union/dashboard" },
  { label: "메뉴 관리", href: "/union/menus" },
  // { label: "콘텐츠 편집", href: "/union/contents" }, // 페이지 편집으로 대체
  { label: "페이지 편집", href: "/union/company-about" },
  { label: "게시글 관리", href: "/union/posts" },
  { label: "배너 관리", href: "/union/banners" },
  { label: "고객사 로고", href: "/union/client-logos" },
  { label: "고객 사례", href: "/union/customer-stories" },
  { label: "문의 관리", href: "/union/inquiries" },
  { label: "인사이트 관리", href: "/union/insights" },
  { label: "다운로드 조회", href: "/union/downloads" },
  { label: "사이트 설정", href: "/union/site-config" },
];

export default function UnionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getUser();
  const filteredMenu = filterMenuForUser(user, "union", unionMenu);

  return (
    <>
      <Sidebar site="union" items={filteredMenu} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </>
  );
}
