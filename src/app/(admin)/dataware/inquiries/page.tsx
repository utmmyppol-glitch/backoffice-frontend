"use client";

import InquiryManager from "@/components/InquiryManager";
import { ToastProvider } from "@/components/Toast";

export default function DatawareInquiriesPage() {
  return (
    <ToastProvider>
      <InquiryManager site="dataware" />
    </ToastProvider>
  );
}
