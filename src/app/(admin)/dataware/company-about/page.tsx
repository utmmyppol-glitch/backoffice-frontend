"use client";

import { ToastProvider } from "@/components/Toast";
import PageEditor from "@/components/PageEditor";

const PRESET_PAGES = [
  { label: "홈", path: "/" },
  { label: "제품소개", path: "/products" },
  { label: "고객사", path: "/customers" },
  { label: "문의", path: "/contact" },
];

const PREVIEW_URL = process.env.NEXT_PUBLIC_DATAWARE_SITE_URL || "http://localhost:3001";

export default function DatawarePageEditorPage() {
  return (
    <ToastProvider>
      <PageEditor
        site="dataware"
        presetPages={PRESET_PAGES}
        previewBaseUrl={PREVIEW_URL}
      />
    </ToastProvider>
  );
}
