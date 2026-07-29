"use client";

import SeminarManager from "@/components/SeminarManager";
import { ToastProvider } from "@/components/Toast";

export default function DatawareSeminarsPage() {
  return (
    <ToastProvider>
      <SeminarManager />
    </ToastProvider>
  );
}
