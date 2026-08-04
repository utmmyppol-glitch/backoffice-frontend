"use client";

import ProductManager from "@/components/ProductManager";
import { ToastProvider } from "@/components/Toast";

export default function DatawareProductsPage() {
  return (
    <ToastProvider>
      <ProductManager />
    </ToastProvider>
  );
}
