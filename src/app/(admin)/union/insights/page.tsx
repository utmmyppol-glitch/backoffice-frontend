"use client";

import InsightManager from "@/components/InsightManager";
import { ToastProvider } from "@/components/Toast";

export default function UnionInsightsPage() {
  return (
    <ToastProvider>
      <InsightManager />
    </ToastProvider>
  );
}
