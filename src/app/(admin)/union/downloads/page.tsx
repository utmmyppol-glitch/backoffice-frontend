"use client";

import DownloadViewer from "@/components/DownloadViewer";
import { ToastProvider } from "@/components/Toast";

export default function UnionDownloadsPage() {
  return (
    <ToastProvider>
      <DownloadViewer site="union" />
    </ToastProvider>
  );
}
