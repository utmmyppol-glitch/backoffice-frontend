import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "백오피스 관리자",
  description: "유니온시스템즈 백오피스 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
