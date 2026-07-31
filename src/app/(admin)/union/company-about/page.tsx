"use client";

import { ToastProvider } from "@/components/Toast";
import PageEditor from "@/components/PageEditor";

const PRESET_PAGES = [
  { label: "기업소개", path: "/company" },
  { label: "오시는 길", path: "/company/location" },
];

const PREVIEW_URL = process.env.NEXT_PUBLIC_UNION_SITE_URL || "http://localhost:3000";

export default function UnionPageEditorPage() {
  return (
    <ToastProvider>
      <PageEditor
        site="union"
        presetPages={PRESET_PAGES}
        previewBaseUrl={PREVIEW_URL}
      />
    </ToastProvider>
  );
}
