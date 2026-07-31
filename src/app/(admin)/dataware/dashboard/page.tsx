"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getUser } from "@/lib/auth";
import Link from "next/link";

interface Paged<T> { content: T[]; totalElements: number }
function normalize<T>(res: Paged<T> | T[]): Paged<T> {
  if (Array.isArray(res)) return { content: res, totalElements: res.length };
  return { content: res.content ?? [], totalElements: res.totalElements ?? 0 };
}

interface DashboardData {
  totalInquiries: number;
  newInquiries: number;
  totalPosts: number;
  totalProducts: number;
  totalEducations: number;
  totalSeminars: number;
  totalDownloads: number;
  totalStories: number;
  recentInquiries: { id: number; name: string; company: string; message: string; status: string; created_at: string }[];
  recentPosts: { id: number; title: string; category: string; created_at: string }[];
}

const INITIAL: DashboardData = {
  totalInquiries: 0, newInquiries: 0, totalPosts: 0, totalProducts: 0,
  totalEducations: 0, totalSeminars: 0, totalDownloads: 0, totalStories: 0,
  recentInquiries: [], recentPosts: [],
};

export default function DatawareDashboard() {
  const [data, setData] = useState<DashboardData>(INITIAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = getUser();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        type InqItem = { id: number; name: string; company: string; message: string; status: string; created_at: string };
        type PostItem = { id: number; title: string; category: string; created_at: string };

        const [inquiriesRaw, postsRaw, productsRaw, educationsRaw, seminarsRaw, downloadsRaw, storiesRaw] = await Promise.all([
          apiFetch<Paged<InqItem> | InqItem[]>("/api/admin/dataware/inquiries?page=0&size=5&sort=created_at,desc").catch(() => [] as InqItem[]),
          apiFetch<Paged<PostItem> | PostItem[]>("/api/admin/dataware/posts?page=0&size=5&sort=created_at,desc").catch(() => [] as PostItem[]),
          apiFetch<Paged<unknown> | unknown[]>("/api/admin/dataware/products?page=0&size=1").catch(() => []),
          apiFetch<Paged<unknown> | unknown[]>("/api/admin/dataware/educations?page=0&size=1").catch(() => []),
          apiFetch<Paged<unknown> | unknown[]>("/api/admin/dataware/seminars?page=0&size=1").catch(() => []),
          apiFetch<Paged<unknown> | unknown[]>("/api/admin/dataware/downloads?page=0&size=1").catch(() => []),
          apiFetch<Paged<unknown> | unknown[]>("/api/admin/dataware/customer-stories?page=0&size=1").catch(() => []),
        ]);

        if (cancelled) return;

        const inquiries = normalize(inquiriesRaw);
        const posts = normalize(postsRaw);
        const products = normalize(productsRaw);
        const educations = normalize(educationsRaw);
        const seminars = normalize(seminarsRaw);
        const downloads = normalize(downloadsRaw);
        const stories = normalize(storiesRaw);

        let totalNew = inquiries.content.filter(i => i.status === "NEW").length;
        if (inquiries.totalElements > 5 && totalNew > 0) {
          try {
            const allInqRaw = await apiFetch<Paged<{ status: string }> | { status: string }[]>("/api/admin/dataware/inquiries?page=0&size=100");
            const allInq = normalize(allInqRaw);
            totalNew = allInq.content.filter(i => i.status === "NEW").length;
          } catch { /* keep estimate */ }
        }

        setData({
          totalInquiries: inquiries.totalElements,
          newInquiries: totalNew,
          totalPosts: posts.totalElements,
          totalProducts: products.totalElements,
          totalEducations: educations.totalElements,
          totalSeminars: seminars.totalElements,
          totalDownloads: downloads.totalElements,
          totalStories: stories.totalElements,
          recentInquiries: inquiries.content.slice(0, 5),
          recentPosts: posts.content.slice(0, 5),
        });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "데이터 로딩 실패");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 font-medium mb-2">데이터를 불러올 수 없습니다</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  const kpiCards = [
    { label: "총 문의", value: data.totalInquiries, icon: "📩", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { label: "미처리 문의 (NEW)", value: data.newInquiries, icon: "🔔", color: "bg-orange-50 border-orange-200 text-orange-700" },
    { label: "게시글 수", value: data.totalPosts, icon: "📝", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { label: "제품 수", value: data.totalProducts, icon: "📦", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { label: "교육 신청", value: data.totalEducations, icon: "🎓", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { label: "세미나 신청", value: data.totalSeminars, icon: "🎤", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { label: "다운로드 수", value: data.totalDownloads, icon: "📥", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { label: "고객 사례", value: data.totalStories, icon: "🏢", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  ];

  const quickActions = [
    { label: "페이지 편집", href: "/dataware/company-about", icon: "🖊️" },
    { label: "새 게시글", href: "/dataware/posts", icon: "➕" },
    { label: "문의 관리", href: "/dataware/inquiries", icon: "💬" },
    { label: "배너 관리", href: "/dataware/banners", icon: "🖼️" },
  ];

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">데이터웨어(엔코아) 관리</h1>
        <p className="text-gray-500 mt-1">
          안녕하세요, <span className="font-medium text-gray-700">{user?.username ?? "관리자"}</span>님.
        </p>
      </div>

      {/* 미처리 알림 */}
      {data.newInquiries > 0 && (
        <Link href="/dataware/inquiries"
          className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 hover:bg-orange-100 transition-colors">
          <span className="text-2xl">🔔</span>
          <div>
            <p className="text-sm font-semibold text-orange-800">
              답변 대기 문의 {data.newInquiries}건
            </p>
            <p className="text-xs text-orange-600 mt-0.5">클릭하여 확인하기</p>
          </div>
        </Link>
      )}

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpiCards.map(card => (
          <div key={card.label} className={`${card.color} border rounded-xl p-4 flex flex-col items-center text-center`}>
            <span className="text-2xl mb-2">{card.icon}</span>
            <p className="text-2xl font-bold">{(card.value ?? 0).toLocaleString()}</p>
            <p className="text-xs font-medium mt-1 opacity-80">{card.label}</p>
          </div>
        ))}
      </div>

      {/* 빠른 작업 */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">빠른 작업</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(action => (
            <Link key={action.label} href={action.href}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-emerald-300 hover:bg-emerald-50 transition-colors group">
              <span className="text-xl">{action.icon}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 문의 */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">최근 문의</h2>
            <Link href="/dataware/inquiries" className="text-xs text-emerald-600 hover:text-emerald-800 font-medium">전체 보기</Link>
          </div>
          {data.recentInquiries.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">문의가 없습니다</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.recentInquiries.map(inq => (
                <li key={inq.id} className="px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {inq.name} <span className="text-gray-400 font-normal">· {inq.company}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{inq.message}</p>
                    </div>
                    <div className="ml-3 flex flex-col items-end shrink-0">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        inq.status === "NEW" ? "bg-orange-100 text-orange-700" :
                        inq.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {inq.status === "NEW" ? "새 문의" : inq.status === "IN_PROGRESS" ? "처리 중" : "완료"}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">{new Date(inq.created_at).toLocaleDateString("ko-KR")}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 최근 게시글 */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">최근 게시글</h2>
            <Link href="/dataware/posts" className="text-xs text-emerald-600 hover:text-emerald-800 font-medium">전체 보기</Link>
          </div>
          {data.recentPosts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">게시글이 없습니다</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.recentPosts.map(post => (
                <li key={post.id} className="px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                    </div>
                    <div className="ml-3 flex flex-col items-end shrink-0">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
