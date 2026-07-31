"use client";

import Sidebar from "@/components/Sidebar";
import { getUser } from "@/lib/auth";
import { filterMenuForUser } from "@/lib/permissions";

const datawareMenu = [
  { label: "대시보드", href: "/dataware/dashboard" },
  { label: "메뉴 관리", href: "/dataware/menus" },
  // { label: "콘텐츠 편집", href: "/dataware/contents" }, // 페이지 편집으로 대체
  { label: "페이지 편집", href: "/dataware/company-about" },
  { label: "게시글 관리", href: "/dataware/posts" },
  { label: "배너 관리", href: "/dataware/banners" },
  { label: "고객사 로고", href: "/dataware/client-logos" },
  { label: "고객 사례", href: "/dataware/customer-stories" },
  { label: "제품 관리", href: "/dataware/products" },
  { label: "문의 관리", href: "/dataware/inquiries" },
  { label: "다운로드 조회", href: "/dataware/downloads" },
  { label: "교육 신청", href: "/dataware/educations" },
  { label: "세미나 신청", href: "/dataware/seminars" },
  { label: "사이트 설정", href: "/dataware/site-config" },
];

export default function DatawareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getUser();
  const filteredMenu = filterMenuForUser(user, "dataware", datawareMenu);

  return (
    <>
      <Sidebar site="dataware" items={filteredMenu} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </>
  );
}
