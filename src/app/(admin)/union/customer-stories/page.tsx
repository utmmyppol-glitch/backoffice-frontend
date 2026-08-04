"use client";

import CustomerStoryManager from "@/components/CustomerStoryManager";
import { ToastProvider } from "@/components/Toast";

export default function UnionCustomerStoriesPage() {
  return (
    <ToastProvider>
      <CustomerStoryManager site="union" />
    </ToastProvider>
  );
}
