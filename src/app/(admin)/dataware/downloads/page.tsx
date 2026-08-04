"use client";

import DownloadViewer from "@/components/DownloadViewer";
import { ToastProvider } from "@/components/Toast";

export default function DatawareDownloadsPage() {
  return (
    <ToastProvider>
      <DownloadViewer site="dataware" />
    </ToastProvider>
  );
}
