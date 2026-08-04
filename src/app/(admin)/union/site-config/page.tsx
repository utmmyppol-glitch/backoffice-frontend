"use client";

import SiteConfigManager from "@/components/SiteConfigManager";
import { ToastProvider } from "@/components/Toast";

export default function UnionSiteConfigPage() {
  return (
    <ToastProvider>
      <SiteConfigManager site="union" />
    </ToastProvider>
  );
}
