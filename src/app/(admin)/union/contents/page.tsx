"use client";

import ContentManager from "@/components/ContentManager";
import { ToastProvider } from "@/components/Toast";

export default function UnionContentsPage() {
  return (
    <ToastProvider>
      <ContentManager site="union" />
    </ToastProvider>
  );
}
