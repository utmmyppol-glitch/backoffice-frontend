// ── 메뉴 관리 ──
export interface MenuItem {
  id: number;
  parent_id: number | null;
  name: string;
  menu_type: "CONTENT" | "BOARD" | "EXTERNAL";
  url: string;
  sort_order: number;
  visible: boolean;
  children?: MenuItem[];
}

export interface MenuFormData {
  parent_id: number | null;
  name: string;
  menu_type: "CONTENT" | "BOARD" | "EXTERNAL";
  url: string;
  visible: boolean;
}

// ── 콘텐츠 편집 ──
export interface ContentRegion {
  id: number;
  region_key: string;
  display_name: string;
  body_html: string;
  updated_at: string;
}

export interface ContentHistory {
  id: number;
  content_id: number;
  body_html: string;
  edited_by: string;
  created_at: string;
}

// ── 페이지네이션 ──
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

// ── 게시글 ──
export interface Post {
  id: number;
  title: string;
  category: string;
  body_html: string;
  thumbnail_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// ── 배너 ──
export type BannerPosition = "HERO" | "POPUP" | "PROMOTION";

export interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  position: BannerPosition;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// ── 고객사 로고 ──
export interface ClientLogo {
  id: number;
  name: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

// ── 고객 사례 ──
export interface CustomerStory {
  id: number;
  company: string;
  industry: string;
  title: string;
  body_html: string;
  thumbnail_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
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
  privacy_agreed: boolean;
  status: InquiryStatus;
  assignee: string;
  created_at: string;
  updated_at: string;
}

// ── 다운로드 이력 ──
export interface Download {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  resource_name: string;
  privacy_agreed: boolean;
  created_at: string;
}

// ── 교육 신청 (dataware 전용) ──
export type EducationStatus = "NEW" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Education {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  course_name: string;
  preferred_date: string;
  participants: number;
  message: string;
  privacy_agreed: boolean;
  status: EducationStatus;
  created_at: string;
  updated_at: string;
}

// ── 세미나 신청 (dataware 전용) ──
export type SeminarStatus = "NEW" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Seminar {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  seminar_title: string;
  seminar_date: string;
  participants: number;
  message: string;
  privacy_agreed: boolean;
  status: SeminarStatus;
  created_at: string;
  updated_at: string;
}

// ── 제품 (dataware 전용) ──
export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  subtitle: string;
  description_html: string;
  features: string[];
  certification: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}
