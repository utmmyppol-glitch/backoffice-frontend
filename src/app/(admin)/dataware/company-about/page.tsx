"use client";

import { ToastProvider } from "@/components/Toast";
import PageEditor from "@/components/PageEditor";

const PRESET_PAGES = [
  { label: "기업소개", path: "/company" },
];

const PREVIEW_URL = process.env.NEXT_PUBLIC_DATAWARE_URL || "http://localhost:3100";

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
