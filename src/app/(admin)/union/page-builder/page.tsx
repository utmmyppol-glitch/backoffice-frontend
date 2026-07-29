"use client";

import PageBuilder from "@/components/PageBuilder";
import { ToastProvider } from "@/components/Toast";

export default function UnionPageBuilderPage() {
  return (
    <ToastProvider>
      <PageBuilder site="union" />
    </ToastProvider>
  );
}
