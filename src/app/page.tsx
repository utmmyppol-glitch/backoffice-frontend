"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getAvailableSites } from "@/lib/auth";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    const sites = getAvailableSites(user);
    router.replace(`/${sites[0]}/dashboard`);
  }, [router]);

  return null;
}
