"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser, clearUser, getAvailableSites, canAccessSite, User } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUserState] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    // 권한 없는 사이트 접근 시 허용된 사이트로 리다이렉트
    const currentSite = pathname.startsWith("/dataware") ? "dataware" : "union";
    if (!canAccessSite(u, currentSite)) {
      const allowed = getAvailableSites(u);
      router.replace(allowed.length > 0 ? `/${allowed[0]}/dashboard` : "/login");
      return;
    }
    setUserState(u);
    setReady(true);
  }, [router, pathname]);

  function handleLogout() {
    clearUser();
    router.replace("/login");
  }

  if (!ready || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  const availableSites = getAvailableSites(user);
  const currentSite = pathname.startsWith("/dataware") ? "dataware" : "union";

  function switchSite(site: string) {
    router.push(`/${site}/dashboard`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg text-gray-900">백오피스</span>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {availableSites.map((site) => (
              <button
                key={site}
                onClick={() => switchSite(site)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentSite === site
                    ? site === "union"
                      ? "bg-red-600 text-white"
                      : "bg-emerald-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {site === "union" ? "유니온시스템즈" : "데이터웨어(엔코아)"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            <span className="font-medium">{user.username}</span>
            <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-500">
              {user.role}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex">{children}</div>
    </div>
  );
}
