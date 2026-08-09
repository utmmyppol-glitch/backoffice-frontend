"use client";

import GlossaryManager from "@/components/GlossaryManager";
import { ToastProvider } from "@/components/Toast";

export default function UnionGlossaryPage() {
  return (
    <ToastProvider>
      <GlossaryManager />
    </ToastProvider>
  );
}
