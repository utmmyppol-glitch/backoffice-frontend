"use client";

import MenuManager from "@/components/MenuManager";
import { ToastProvider } from "@/components/Toast";

export default function DatawareMenusPage() {
  return (
    <ToastProvider>
      <MenuManager site="dataware" />
    </ToastProvider>
  );
}
