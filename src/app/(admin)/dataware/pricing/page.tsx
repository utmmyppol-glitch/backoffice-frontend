"use client";

import PricingManager from "@/components/PricingManager";
import { ToastProvider } from "@/components/Toast";

export default function DatawarePricingPage() {
  return (
    <ToastProvider>
      <PricingManager />
    </ToastProvider>
  );
}
