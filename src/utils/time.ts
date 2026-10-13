const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function toDate(ts: string | Date): Date {
  return ts instanceof Date ? ts : new Date(ts);
}

/**
 * Short relative time for post headers: "just now", "4m", "3h", "Yesterday",
 * then a date ("12 Oct", or "12 Oct 2025" for other years).
 */
export function relativeTime(ts: string | Date, now: number): string {
  const date = toDate(ts);
  const diff = now - date.getTime();
  if (Number.isNaN(diff)) return "";
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`;

  const yesterday = new Date(now - DAY);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  const sameYear = date.getFullYear() === new Date(now).getFullYear();
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

/** Full date and time, for the tooltip and `datetime` attribute. */
export function fullTime(ts: string | Date): string {
  return toDate(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
