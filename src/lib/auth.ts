export interface User {
  username: string;
  role: "SUPER" | "ADMIN" | "EDITOR" | "VIEWER";
  site: "UNION" | "DATAWARE" | null;
  token: string;
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const user = JSON.parse(raw) as User;
    if (isTokenExpired(user.token)) {
      clearUser();
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export function setUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", user.token);
}

export function clearUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

export function canAccessSite(user: User, site: string): boolean {
  if (user.role === "SUPER") return true;
  return user.site === site.toUpperCase();
}

export function getAvailableSites(user: User): string[] {
  if (user.role === "SUPER") return ["union", "dataware"];
  if (user.site === "UNION") return ["union"];
  if (user.site === "DATAWARE") return ["dataware"];
  return [];
}
