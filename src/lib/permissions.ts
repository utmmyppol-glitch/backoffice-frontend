import { User } from "./auth";

export type Permission = "view" | "edit" | "none";

/**
 * 페이지별 접근 권한을 반환한다.
 * - SUPER: 전부 edit
 * - ADMIN/EDITOR: 자기 사이트의 모든 페이지 edit
 * - VIEWER: dataware 다운로드만 view, 나머지 none
 */
export function getPagePermission(
  user: User | null,
  site: "union" | "dataware",
  page: string
): Permission {
  if (!user) return "none";
  if (user.role === "SUPER") return "edit";

  const userSite = user.site?.toLowerCase();
  if (userSite !== site) return "none";

  if (user.role === "VIEWER") {
    // VIEWER는 dataware 다운로드 조회만 읽기 가능
    if (site === "dataware" && page === "downloads") return "view";
    return "none";
  }

  // ADMIN, EDITOR → edit
  return "edit";
}

/**
 * 사이드바 메뉴에서 현재 사용자가 볼 수 있는 항목만 필터링한다.
 */
export function filterMenuForUser(
  user: User | null,
  site: "union" | "dataware",
  items: { label: string; href: string }[]
): { label: string; href: string }[] {
  if (!user) return [];
  if (user.role === "SUPER" || user.role === "ADMIN" || user.role === "EDITOR") {
    return items;
  }

  // VIEWER: dataware 다운로드만
  if (user.role === "VIEWER") {
    if (site === "dataware") {
      return items.filter((item) => {
        const path = item.href.split("/").pop();
        return path === "downloads";
      });
    }
    return [];
  }

  return items;
}

/**
 * 수정(상태변경/삭제 등) 가능 여부
 */
export function canEdit(user: User | null): boolean {
  if (!user) return false;
  return user.role !== "VIEWER";
}
