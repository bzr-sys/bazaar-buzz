// Pastel backgrounds with dark text: readable in both themes (>= 13:1).
const AVATAR_COLORS = ["#ffe08a", "#c9dcff", "#d6f0d9", "#ffd2c2", "#e9d5ff"];

export function initials(
  name: string | undefined,
  handle: string | undefined,
): string {
  const source = (name || handle || "?").trim();
  const words = source.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

/** Stable colour per user, so someone keeps the same avatar everywhere. */
export function avatarColor(id: string | undefined): string {
  let hash = 0;
  for (const ch of id ?? "") {
    hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
