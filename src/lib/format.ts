/** 날짜를 한국어 로케일 문자열로 반환 (yyyy. MM. dd.) */
export function formatDate(s: string | undefined | null): string {
  if (!s) return "-";
  try {
    const d = new Date(s);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("ko-KR");
  } catch {
    return "-";
  }
}

/** 날짜+시간을 한국어 로케일 문자열로 반환 */
export function formatDateTime(s: string | undefined | null): string {
  if (!s) return "-";
  try {
    const d = new Date(s);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}
