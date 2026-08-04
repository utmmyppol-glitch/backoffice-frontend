"use client";

import SiteConfigManager from "@/components/SiteConfigManager";
import { ToastProvider } from "@/components/Toast";

export default function DatawareSiteConfigPage() {
  return (
    <ToastProvider>
      <SiteConfigManager site="dataware" />
    </ToastProvider>
  );
}
