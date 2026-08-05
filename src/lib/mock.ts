/**
 * Central mock data for backoffice-frontend.
 * When NEXT_PUBLIC_USE_MOCK=true, apiFetch returns mock data instead of calling the real API.
 */

import type {
  Banner,
  ClientLogo,
  ContentRegion,
  ContentHistory,
  CustomerStory,
  Download,
  Education,
  Inquiry,
  Insight,
  MenuItem,
  PaginatedResponse,
  Post,
  Product,
  Seminar,
  SiteConfig,
} from "./types";

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/* ── Helper: paginate an array ── */
function paginate<T>(items: T[], params: URLSearchParams): PaginatedResponse<T> {
  const page = Number(params.get("page") ?? 0);
  const size = Number(params.get("size") ?? 15);
  const search = params.get("search")?.toLowerCase();
  const status = params.get("status");

  let filtered = items;
  if (search) {
    filtered = filtered.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search)
    );
  }
  if (status) {
    filtered = filtered.filter(
      (item) => (item as Record<string, unknown>).status === status
    );
  }
  const start = page * size;
  return {
    content: filtered.slice(start, start + size),
    totalElements: filtered.length,
    number: page,
    size,
  };
}

/* ══════════════════════════════════════════
   Mock Data
   ══════════════════════════════════════════ */

const mockPosts: Post[] = [
  {
    id: 1, title: "유니온시스템즈 2024년 하반기 신제품 출시 안내", category: "공지사항",
    body_html: "<p>하반기 신제품 라인업을 소개합니다.</p>", thumbnail_url: "",
    published: true, created_at: "2024-12-01T09:00:00", updated_at: "2024-12-01T09:00:00",
  },
  {
    id: 2, title: "시스템 정기 점검 안내 (12/15)", category: "공지사항",
    body_html: "<p>12월 15일 시스템 정기 점검이 예정되어 있습니다.</p>", thumbnail_url: "",
    published: true, created_at: "2024-12-03T10:00:00", updated_at: "2024-12-03T10:00:00",
  },
  {
    id: 3, title: "클라우드 전환 성공 사례 발표", category: "뉴스",
    body_html: "<p>고객사의 클라우드 전환 성공 사례를 공유합니다.</p>", thumbnail_url: "",
    published: true, created_at: "2024-11-28T14:00:00", updated_at: "2024-11-28T14:00:00",
  },
  {
    id: 4, title: "보안 업데이트 v3.2 릴리즈 노트", category: "기술",
    body_html: "<p>보안 취약점 패치 및 성능 개선 내역입니다.</p>", thumbnail_url: "",
    published: false, created_at: "2024-11-25T11:00:00", updated_at: "2024-11-25T11:00:00",
  },
  {
    id: 5, title: "2025년 IT 트렌드 전망", category: "인사이트",
    body_html: "<p>AI, 보안, 클라우드 등 2025년 주요 IT 트렌드를 분석합니다.</p>", thumbnail_url: "",
    published: true, created_at: "2024-11-20T16:00:00", updated_at: "2024-11-20T16:00:00",
  },
];

const mockBanners: Banner[] = [
  {
    id: 1, title: "메인 히어로 배너", image_url: "/uploads/hero-banner.jpg",
    link_url: "/products", position: "HERO", sort_order: 1, is_active: true,
    created_at: "2024-12-01T09:00:00",
  },
  {
    id: 2, title: "연말 프로모션 팝업", image_url: "/uploads/promo-popup.jpg",
    link_url: "/promotion", position: "POPUP", sort_order: 1, is_active: true,
    created_at: "2024-12-05T10:00:00",
  },
  {
    id: 3, title: "신제품 프로모션", image_url: "/uploads/promo-banner.jpg",
    link_url: "/new-products", position: "PROMOTION", sort_order: 2, is_active: false,
    created_at: "2024-11-15T08:00:00",
  },
];

const mockClientLogos: ClientLogo[] = [
  { id: 1, name: "삼성전자", image_url: "/uploads/logo-samsung.png", sort_order: 1, is_active: true },
  { id: 2, name: "LG전자", image_url: "/uploads/logo-lg.png", sort_order: 2, is_active: true },
  { id: 3, name: "SK텔레콤", image_url: "/uploads/logo-skt.png", sort_order: 3, is_active: true },
  { id: 4, name: "현대자동차", image_url: "/uploads/logo-hyundai.png", sort_order: 4, is_active: true },
  { id: 5, name: "카카오", image_url: "/uploads/logo-kakao.png", sort_order: 5, is_active: false },
];

const mockCustomerStories: CustomerStory[] = [
  {
    id: 1, company: "삼성전자", industry: "전자/반도체", title: "데이터 분석 플랫폼 구축 사례",
    body_html: "<p>삼성전자의 데이터 분석 플랫폼 구축 과정을 공유합니다.</p>",
    thumbnail_url: "/uploads/story-samsung.jpg", published: true,
    created_at: "2024-11-01T09:00:00", updated_at: "2024-11-01T09:00:00",
  },
  {
    id: 2, company: "현대자동차", industry: "자동차", title: "스마트 팩토리 전환 프로젝트",
    body_html: "<p>현대자동차 스마트 팩토리 도입 사례입니다.</p>",
    thumbnail_url: "/uploads/story-hyundai.jpg", published: true,
    created_at: "2024-10-15T14:00:00", updated_at: "2024-10-15T14:00:00",
  },
];

const mockInquiries: Inquiry[] = [
  {
    id: 1, name: "김철수", company: "ABC솔루션", email: "kim@abc.com", phone: "010-1234-5678",
    product: "데이터 분석 플랫폼", message: "도입 비용과 일정 문의드립니다.",
    consentPrivacy: true, status: "NEW", assignee: "", createdAt: "2024-12-10T09:00:00", updatedAt: "2024-12-10T09:00:00",
  },
  {
    id: 2, name: "이영희", company: "XYZ테크", email: "lee@xyz.com", phone: "010-9876-5432",
    product: "클라우드 보안", message: "PoC 진행이 가능한지 문의합니다.",
    consentPrivacy: true, status: "IN_PROGRESS", assignee: "박담당", createdAt: "2024-12-08T14:00:00", updatedAt: "2024-12-09T10:00:00",
  },
  {
    id: 3, name: "박민수", company: "테스트코프", email: "park@test.com", phone: "010-5555-1234",
    product: "ERP 시스템", message: "기존 시스템 마이그레이션 관련 상담 요청합니다.",
    consentPrivacy: true, status: "NEW", assignee: "", createdAt: "2024-12-09T11:00:00", updatedAt: "2024-12-09T11:00:00",
  },
  {
    id: 4, name: "최지은", company: "스마트솔루션", email: "choi@smart.com", phone: "010-7777-8888",
    product: "AI 플랫폼", message: "AI 기반 자동화 솔루션 견적을 요청합니다.",
    consentPrivacy: true, status: "COMPLETED", assignee: "김담당", createdAt: "2024-12-05T10:00:00", updatedAt: "2024-12-07T15:00:00",
  },
];

const mockDownloads: Download[] = [
  {
    id: 1, name: "정현우", company: "테크스타", email: "jung@ts.com", phone: "010-1111-2222",
    resource_name: "제품 카탈로그 2024", privacy_agreed: true, created_at: "2024-12-10T14:30:00",
  },
  {
    id: 2, name: "한소영", company: "데이터코리아", email: "han@dk.com", phone: "010-3333-4444",
    resource_name: "클라우드 전환 가이드", privacy_agreed: true, created_at: "2024-12-09T11:00:00",
  },
  {
    id: 3, name: "오성민", company: "IT플러스", email: "oh@itp.com", phone: "010-5555-6666",
    resource_name: "보안 백서 v2.0", privacy_agreed: true, created_at: "2024-12-08T16:45:00",
  },
];

const mockMenus: MenuItem[] = [
  {
    id: 1, parentId: null, name: "회사소개", menuType: "CONTENT", url: "/company", sortOrder: 1, isExposed: true,
    children: [
      { id: 2, parentId: 1, name: "CEO 인사말", menuType: "CONTENT", url: "/company/ceo", sortOrder: 1, isExposed: true },
      { id: 3, parentId: 1, name: "연혁", menuType: "CONTENT", url: "/company/history", sortOrder: 2, isExposed: true },
    ],
  },
  {
    id: 4, parentId: null, name: "제품/솔루션", menuType: "BOARD", url: "/products", sortOrder: 2, isExposed: true,
    children: [],
  },
  {
    id: 5, parentId: null, name: "고객사례", menuType: "BOARD", url: "/stories", sortOrder: 3, isExposed: true,
    children: [],
  },
  {
    id: 6, parentId: null, name: "문의하기", menuType: "LINK", url: "/contact", sortOrder: 4, isExposed: true,
    children: [],
  },
];

const mockContentRegions: ContentRegion[] = [
  {
    id: 1, region_key: "hero", display_name: "메인 히어로",
    body_html: JSON.stringify({ title: "혁신적인 IT 솔루션", desc: "비즈니스 성장을 위한 파트너" }),
    updated_at: "2024-12-01T09:00:00",
  },
  {
    id: 2, region_key: "about", display_name: "회사소개",
    body_html: JSON.stringify({ title: "유니온시스템즈", desc: "1995년 설립 이래 대한민국 IT 산업을 선도하고 있습니다." }),
    updated_at: "2024-11-20T14:00:00",
  },
  {
    id: 3, region_key: "footer", display_name: "푸터 정보",
    body_html: JSON.stringify({ company: "유니온시스템즈", tel: "02-1234-5678", email: "info@union.co.kr" }),
    updated_at: "2024-11-15T10:00:00",
  },
];

const mockContentHistory: ContentHistory[] = [
  {
    id: 1, content_id: 1, body_html: "<p>이전 버전 히어로 섹션</p>",
    edited_by: "admin", created_at: "2024-11-28T10:00:00",
  },
  {
    id: 2, content_id: 1, body_html: "<p>더 이전 버전 히어로 섹션</p>",
    edited_by: "admin", created_at: "2024-11-25T15:00:00",
  },
];

const mockSiteConfigs: SiteConfig[] = [
  { id: 1, configKey: "company_name", configValue: "유니온시스템즈", description: "회사명", updatedAt: "2024-12-01T00:00:00" },
  { id: 2, configKey: "phone", configValue: "02-1234-5678", description: "대표전화", updatedAt: "2024-12-01T00:00:00" },
  { id: 3, configKey: "address", configValue: "서울특별시 강남구 테헤란로 123", description: "회사 주소", updatedAt: "2024-12-01T00:00:00" },
  { id: 4, configKey: "footer_copyright", configValue: "© 2024 UnionSystems. All rights reserved.", description: "푸터 저작권 문구", updatedAt: "2024-12-01T00:00:00" },
  { id: 5, configKey: "email_general", configValue: "info@union.co.kr", description: "대표 이메일", updatedAt: "2024-12-01T00:00:00" },
];

const mockInsights: Insight[] = [
  {
    id: 1, title: "2025년 AI 트렌드: 생성형 AI의 기업 도입 가속화",
    summary: "생성형 AI가 기업 생산성을 혁신적으로 변화시키고 있습니다.",
    sourceUrl: "https://example.com/ai-trends", sourceName: "TechCrunch",
    publishedAt: "2024-12-10T08:00:00", thumbnailUrl: null,
    status: "PENDING", approvedAt: null, approvedBy: null,
  },
  {
    id: 2, title: "클라우드 네이티브 보안의 새로운 패러다임",
    summary: "제로트러스트 아키텍처가 클라우드 보안의 표준이 되고 있습니다.",
    sourceUrl: "https://example.com/cloud-security", sourceName: "ZDNet Korea",
    publishedAt: "2024-12-09T10:00:00", thumbnailUrl: null,
    status: "APPROVED", approvedAt: "2024-12-09T14:00:00", approvedBy: "admin",
  },
  {
    id: 3, title: "디지털 전환 성공 기업의 5가지 공통점",
    summary: "성공적인 DX를 이끈 기업들의 전략을 분석합니다.",
    sourceUrl: "https://example.com/dx-success", sourceName: "디지털타임스",
    publishedAt: "2024-12-08T09:00:00", thumbnailUrl: null,
    status: "REJECTED", approvedAt: null, approvedBy: null,
  },
  {
    id: 4, title: "엣지 컴퓨팅과 IoT의 미래",
    summary: "엣지 컴퓨팅이 산업 현장에서 어떻게 활용되고 있는지 살펴봅니다.",
    sourceUrl: "https://example.com/edge-iot", sourceName: "전자신문",
    publishedAt: "2024-12-07T11:00:00", thumbnailUrl: null,
    status: "PENDING", approvedAt: null, approvedBy: null,
  },
];

const mockEducations: Education[] = [
  {
    id: 1, name: "김교육", company: "러닝센터", email: "kim@learn.com", phone: "010-1234-0001",
    course_name: "데이터 분석 기초", preferred_date: "2025-01-15", participants: 10,
    message: "실습 환경 준비 가능한지 문의합니다.", privacy_agreed: true,
    status: "NEW", created_at: "2024-12-10T09:00:00", updated_at: "2024-12-10T09:00:00",
  },
  {
    id: 2, name: "이학습", company: "테크아카데미", email: "lee@tech.com", phone: "010-1234-0002",
    course_name: "클라우드 운영 실무", preferred_date: "2025-02-01", participants: 5,
    message: "", privacy_agreed: true,
    status: "CONFIRMED", created_at: "2024-12-08T14:00:00", updated_at: "2024-12-09T10:00:00",
  },
];

const mockSeminars: Seminar[] = [
  {
    id: 1, name: "박세미", company: "이벤트코리아", email: "park@event.com", phone: "010-2222-0001",
    seminar_title: "AI 비즈니스 활용 세미나", seminar_date: "2025-01-20", participants: 30,
    message: "온라인 참여도 가능한지 확인 부탁드립니다.", privacy_agreed: true,
    status: "NEW", created_at: "2024-12-10T10:00:00", updated_at: "2024-12-10T10:00:00",
  },
  {
    id: 2, name: "최참여", company: "스타트업허브", email: "choi@hub.com", phone: "010-2222-0002",
    seminar_title: "데이터 거버넌스 워크숍", seminar_date: "2025-02-10", participants: 15,
    message: "", privacy_agreed: true,
    status: "CONFIRMED", created_at: "2024-12-07T11:00:00", updated_at: "2024-12-08T09:00:00",
  },
];

const mockProducts: Product[] = [
  {
    id: 1, name: "DataWare Analytics", slug: "analytics", category: "데이터 분석",
    subtitle: "실시간 데이터 분석 플랫폼", description_html: "<p>기업 데이터를 실시간으로 분석하세요.</p>",
    features: ["실시간 대시보드", "AI 분석", "자동 리포트"], certification: "ISO 27001",
    sort_order: 1, published: true, created_at: "2024-10-01T00:00:00", updated_at: "2024-12-01T00:00:00",
  },
  {
    id: 2, name: "DataWare Cloud", slug: "cloud", category: "클라우드",
    subtitle: "클라우드 인프라 관리", description_html: "<p>멀티 클라우드 환경을 통합 관리합니다.</p>",
    features: ["멀티클라우드", "비용 최적화", "보안 관제"], certification: "CSAP",
    sort_order: 2, published: true, created_at: "2024-09-15T00:00:00", updated_at: "2024-11-20T00:00:00",
  },
];

/* ══════════════════════════════════════════
   Mock Login Response
   ══════════════════════════════════════════ */
const MOCK_LOGIN_RESPONSE = {
  message: "로그인 성공",
  token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJTVVBFUiIsImlhdCI6MTczNjAwMDAwMCwiZXhwIjo5OTk5OTk5OTk5fQ.mock-signature",
  username: "admin",
  role: "SUPER",
  site: null,
};

/* ══════════════════════════════════════════
   Route Matcher
   ══════════════════════════════════════════ */

/**
 * Resolve a mock response for the given path + method.
 * Returns `undefined` when no mock is available (falls through to real API).
 */
export function resolveMock(path: string, options: RequestInit = {}): unknown | undefined {
  const method = (options.method ?? "GET").toUpperCase();
  const url = new URL(path, "http://localhost");
  const pathname = url.pathname;
  const params = url.searchParams;

  // ── Login ──
  if (pathname === "/api/admin/login" && method === "POST") {
    return MOCK_LOGIN_RESPONSE;
  }

  // ── Site-scoped routes: /api/admin/{site}/{resource} ──
  const siteMatch = pathname.match(/^\/api\/admin\/(union|dataware)\/(.+)$/);
  if (!siteMatch) return undefined;

  const resource = siteMatch[2];

  // ── Upload ──
  if (resource === "upload" && method === "POST") {
    return { url: "/uploads/mock-uploaded-image.jpg" };
  }

  // ── Contents ──
  if (resource === "contents") {
    if (method === "GET") return mockContentRegions;
    if (method === "PUT") {
      const body = JSON.parse((options.body as string) || "{}");
      return { id: 100, regionKey: body.regionKey || "mock", bodyHtml: body.bodyHtml || "" };
    }
    return undefined;
  }
  const contentDetailMatch = resource.match(/^contents\/(\d+)$/);
  if (contentDetailMatch && method === "PUT") {
    return undefined; // 204
  }
  const contentHistoryMatch = resource.match(/^contents\/(\d+)\/history$/);
  if (contentHistoryMatch) {
    return mockContentHistory;
  }
  const contentRevertMatch = resource.match(/^contents\/(\d+)\/revert$/);
  if (contentRevertMatch && method === "POST") {
    return undefined; // 204-like
  }

  // ── Menus ──
  if (resource === "menus") {
    if (method === "GET") return mockMenus;
    if (method === "POST") return { id: 100, ...JSON.parse((options.body as string) || "{}") };
    return undefined;
  }
  if (resource.startsWith("menus/")) {
    if (method === "DELETE") return undefined;
    if (method === "PUT") return { id: Number(resource.split("/")[1]) };
    return undefined;
  }

  // ── Site Config ──
  if (resource === "site-config") {
    if (method === "GET") return mockSiteConfigs;
    return undefined;
  }
  if (resource.startsWith("site-config/")) {
    if (method === "PUT") return undefined;
    return undefined;
  }

  // ── Insights ──
  if (resource === "insights/collect" && method === "POST") {
    return { message: "수집이 시작되었습니다" };
  }
  if (resource.match(/^insights\/\d+\/approve$/) && method === "PATCH") {
    return undefined;
  }
  if (resource.match(/^insights\/\d+\/reject$/) && method === "PATCH") {
    return undefined;
  }
  if (resource.startsWith("insights")) {
    if (method === "GET") return paginate(mockInsights, params);
    return undefined;
  }

  // ── Inquiries ──
  if (resource.startsWith("inquiries")) {
    if (resource === "inquiries" && method === "GET") return paginate(mockInquiries, params);
    if (resource.match(/^inquiries\/\d+$/) && method === "PUT") return undefined;
    return undefined;
  }

  // ── Downloads ──
  if (resource.startsWith("downloads")) {
    if (method === "GET") return paginate(mockDownloads, params);
    return undefined;
  }

  // ── Educations ──
  if (resource.startsWith("educations")) {
    if (resource === "educations" && method === "GET") return paginate(mockEducations, params);
    if (resource.match(/^educations\/\d+$/) && method === "PUT") return undefined;
    return undefined;
  }

  // ── Seminars ──
  if (resource.startsWith("seminars")) {
    if (resource === "seminars" && method === "GET") return paginate(mockSeminars, params);
    if (resource.match(/^seminars\/\d+$/) && method === "PUT") return undefined;
    return undefined;
  }

  // ── Posts ──
  if (resource.startsWith("posts")) {
    if (resource === "posts" && method === "GET") return paginate(mockPosts, params);
    if (resource === "posts" && method === "POST") return { id: 100, ...JSON.parse((options.body as string) || "{}") };
    if (resource.match(/^posts\/\d+$/) && method === "PUT") return undefined;
    if (resource.match(/^posts\/\d+$/) && method === "DELETE") return undefined;
    if (resource.match(/^posts\/\d+\/published$/) && method === "PATCH") return undefined;
    return undefined;
  }

  // ── Banners ──
  if (resource.startsWith("banners")) {
    if (resource === "banners" && method === "GET") return paginate(mockBanners, params);
    if (resource === "banners" && method === "POST") return { id: 100, ...JSON.parse((options.body as string) || "{}") };
    if (resource.match(/^banners\/\d+$/) && method === "PUT") return undefined;
    if (resource.match(/^banners\/\d+$/) && method === "DELETE") return undefined;
    return undefined;
  }

  // ── Client Logos ──
  if (resource.startsWith("client-logos")) {
    if (resource === "client-logos" && method === "GET") return paginate(mockClientLogos, params);
    if (resource === "client-logos" && method === "POST") return { id: 100, ...JSON.parse((options.body as string) || "{}") };
    if (resource.match(/^client-logos\/\d+$/) && method === "PUT") return undefined;
    if (resource.match(/^client-logos\/\d+$/) && method === "DELETE") return undefined;
    return undefined;
  }

  // ── Customer Stories ──
  if (resource.startsWith("customer-stories")) {
    if (resource === "customer-stories" && method === "GET") return paginate(mockCustomerStories, params);
    if (resource === "customer-stories" && method === "POST") return { id: 100, ...JSON.parse((options.body as string) || "{}") };
    if (resource.match(/^customer-stories\/\d+$/) && method === "PUT") return undefined;
    if (resource.match(/^customer-stories\/\d+$/) && method === "DELETE") return undefined;
    return undefined;
  }

  // ── Products (dataware) ──
  if (resource.startsWith("products")) {
    if (resource === "products" && method === "GET") return paginate(mockProducts, params);
    if (resource === "products" && method === "POST") return { id: 100, ...JSON.parse((options.body as string) || "{}") };
    if (resource.match(/^products\/\d+$/) && method === "PUT") return undefined;
    if (resource.match(/^products\/\d+$/) && method === "DELETE") return undefined;
    return undefined;
  }

  return undefined;
}
