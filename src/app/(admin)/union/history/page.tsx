"use client";

import HistoryManager from "@/components/HistoryManager";
import { ToastProvider } from "@/components/Toast";

export default function UnionHistoryPage() {
  return (
    <ToastProvider>
      <HistoryManager />
    </ToastProvider>
  );
}
