"use client";

import EducationManager from "@/components/EducationManager";
import { ToastProvider } from "@/components/Toast";

export default function DatawareEducationsPage() {
  return (
    <ToastProvider>
      <EducationManager />
    </ToastProvider>
  );
}
