"use client";

import PostManager from "@/components/PostManager";
import { ToastProvider } from "@/components/Toast";

export default function UnionPostsPage() {
  return (
    <ToastProvider>
      <PostManager site="union" />
    </ToastProvider>
  );
}
