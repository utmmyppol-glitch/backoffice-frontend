"use client";

import ClientLogoManager from "@/components/ClientLogoManager";
import { ToastProvider } from "@/components/Toast";

export default function UnionClientLogosPage() {
  return (
    <ToastProvider>
      <ClientLogoManager site="union" />
    </ToastProvider>
  );
}
