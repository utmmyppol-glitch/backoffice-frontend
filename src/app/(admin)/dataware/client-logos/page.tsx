"use client";

import ClientLogoManager from "@/components/ClientLogoManager";
import { ToastProvider } from "@/components/Toast";

export default function DatawareClientLogosPage() {
  return (
    <ToastProvider>
      <ClientLogoManager site="dataware" />
    </ToastProvider>
  );
}
