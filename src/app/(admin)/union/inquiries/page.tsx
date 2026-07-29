"use client";

import InquiryManager from "@/components/InquiryManager";
import { ToastProvider } from "@/components/Toast";

export default function UnionInquiriesPage() {
  return (
    <ToastProvider>
      <InquiryManager site="union" />
    </ToastProvider>
  );
}
