"use client";

import PostManager from "@/components/PostManager";
import { ToastProvider } from "@/components/Toast";

export default function DatawarePostsPage() {
  return (
    <ToastProvider>
      <PostManager site="dataware" />
    </ToastProvider>
  );
}
