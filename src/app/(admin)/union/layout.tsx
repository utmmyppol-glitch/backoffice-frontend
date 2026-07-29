import Sidebar from "@/components/Sidebar";

const unionMenu = [
  { label: "대시보드", href: "/union/dashboard" },
  { label: "메뉴 관리", href: "/union/menus" },
  { label: "콘텐츠 편집", href: "/union/contents" },
  { label: "게시글 관리", href: "/union/posts" },
  { label: "배너 관리", href: "/union/banners" },
  { label: "고객사 로고", href: "/union/client-logos" },
  { label: "고객 사례", href: "/union/customer-stories" },
  { label: "문의 관리", href: "/union/inquiries" },
  { label: "다운로드 조회", href: "/union/downloads" },
];

export default function UnionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar site="union" items={unionMenu} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </>
  );
}
