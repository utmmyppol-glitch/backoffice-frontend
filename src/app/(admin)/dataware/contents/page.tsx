"use client";

import ContentManager from "@/components/ContentManager";
import { ToastProvider } from "@/components/Toast";

export default function DatawareContentsPage() {
  return (
    <ToastProvider>
      <ContentManager site="dataware" />
    </ToastProvider>
  );
}
