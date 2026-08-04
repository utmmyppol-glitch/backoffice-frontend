"use client";

import CustomerStoryManager from "@/components/CustomerStoryManager";
import { ToastProvider } from "@/components/Toast";

export default function DatawareCustomerStoriesPage() {
  return (
    <ToastProvider>
      <CustomerStoryManager site="dataware" />
    </ToastProvider>
  );
}
