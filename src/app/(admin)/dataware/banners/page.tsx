"use client";

import BannerManager from "@/components/BannerManager";
import { ToastProvider } from "@/components/Toast";

export default function DatawareBannersPage() {
  return (
    <ToastProvider>
      <BannerManager site="dataware" />
    </ToastProvider>
  );
}
