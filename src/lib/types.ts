// ── 사이트 설정 ──
export interface SiteConfig {
  id: number;
  configKey: string;
  configValue: string;
  description: string;
  updatedAt: string;
}

// ── 메뉴 관리 ──
export interface MenuItem {
  id: number;
  parentId: number | null;
  name: string;
  menuType: "CONTENT" | "BOARD" | "LINK";
  url: string;
  sortOrder: number;
  isExposed: boolean;
  children?: MenuItem[];
}

export interface MenuFormData {
  parentId: number | null;
  name: string;
  menuType: "CONTENT" | "BOARD" | "LINK";
  url: string;
  isExposed: boolean;
}

// ── 콘텐츠 편집 ──
export interface ContentRegion {
  id: number;
  regionKey: string;
  displayName: string;
  bodyHtml: string;
  updatedAt: string;
}

export interface ContentHistory {
  id: number;
  contentId: number;
  bodyHtml: string;
  editedBy: string;
  createdAt: string;
}

// ── 페이지네이션 (Spring Page 형식) ──
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
}

// ── 게시글 ──
export interface Post {
  id: number;
  title: string;
  category: string;
  content: string;
  thumbnailUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── 배너 ──
export type BannerPosition = "HERO" | "POPUP" | "PROMOTION";

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: BannerPosition;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

// ── 고객사 로고 ──
export interface ClientLogo {
  id: number;
  name: string;
  logoUrl: string;
  sortOrder: number;
  isActive: boolean;
  showOnHome?: boolean;
}

// ── 고객 사례 ──
export interface CustomerStory {
  id: number;
  company: string;
  industry: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  slug?: string;
  logoUrl?: string;
  detailJson?: string | null;
}

// ── 문의 ──
export type InquiryStatus = "NEW" | "IN_PROGRESS" | "COMPLETED";

export interface Inquiry {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  message: string;
  consentPrivacy: boolean;
  status: InquiryStatus;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

// ── 다운로드 이력 ──
export interface Download {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  resourceName: string;
  privacyAgreed: boolean;
  createdAt: string;
}

// ── 교육 신청 (dataware 전용) ──
export type EducationStatus = "NEW" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Education {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  courseName: string;
  preferredDate: string;
  participants: number;
  message: string;
  privacyAgreed: boolean;
  status: EducationStatus;
  createdAt: string;
  updatedAt: string;
}

// ── 세미나 신청 (dataware 전용) ──
export type SeminarStatus = "NEW" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Seminar {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  seminarTitle: string;
  seminarDate: string;
  participants: number;
  message: string;
  privacyAgreed: boolean;
  status: SeminarStatus;
  createdAt: string;
  updatedAt: string;
}

// ── 인사이트 ──
export type InsightStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Insight {
  id: number;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  thumbnailUrl: string | null;
  status: InsightStatus;
  approvedAt: string | null;
  approvedBy: string | null;
}

// ── 연혁 (union) ──
export interface HistoryItem {
  id: number;
  year: string;
  title: string;
  events: string;
  sortOrder: number;
  isActive: boolean;
}

// ── 용어사전 (union) ──
export interface GlossaryTerm {
  id: number;
  term: string;
  fullName: string;
  definition: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

// ── 가격표 (dataware) ──
export interface PricingPlan {
  id: number;
  name: string;
  licenseType: string;
  price: number | null;
  originalPrice: number | null;
  priceDisplay: string;
  features: string;
  badge: string;
  isPopular: boolean;
  sortOrder: number;
  isActive: boolean;
}

// ── 제품 (dataware 전용) ──
export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  subtitle: string;
  descriptionHtml: string;
  features: string[];
  certification: string;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
