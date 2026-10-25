const MAX_WORDS = 6;

export const ACCENT_COLORS = ["blue", "orange", "green", "red"];

// FNV-1a plus a final avalanche step (FNV's low bits alone spread poorly), so a post
// always gets the same accent and background and slugs spread evenly across them.
export const hashString = (value = "") => {
  let hash = Array.from(String(value)).reduce(
    (acc, char) => Math.imul(acc ^ char.charCodeAt(0), 16777619) >>> 0,
    2166136261,
  );
  hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b);
  hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35);
  return (hash ^ (hash >>> 16)) >>> 0;
};

export const getThumbnailWords = (title = "") =>
  String(title).trim().split(/\s+/).filter(Boolean).slice(0, MAX_WORDS);

export const getAccentColor = (key = "") => ACCENT_COLORS[hashString(key) % ACCENT_COLORS.length];
