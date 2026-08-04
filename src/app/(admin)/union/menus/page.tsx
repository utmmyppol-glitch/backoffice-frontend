"use client";

import MenuManager from "@/components/MenuManager";
import { ToastProvider } from "@/components/Toast";

export default function UnionMenusPage() {
  return (
    <ToastProvider>
      <MenuManager site="union" />
    </ToastProvider>
  );
}
