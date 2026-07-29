"use client";

import BannerManager from "@/components/BannerManager";
import { ToastProvider } from "@/components/Toast";

export default function UnionBannersPage() {
  return (
    <ToastProvider>
      <BannerManager site="union" />
    </ToastProvider>
  );
}
