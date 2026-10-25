const MAX_WORDS = 6;
const SAME_LINE_TOLERANCE_PX = 2;

// FNV-1a plus a final avalanche step (FNV's low bits alone spread poorly), so a post
// always gets the same background variant.
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

// Given each word's top offset, return the index of the first word on the last visible line.
// Words at or below `visibleHeight` are clipped by the line clamp and ignored.
// A single-line title falls back to highlighting just its last word, so the first line stays mostly white.
export const getLastLineStart = (wordTops = [], visibleHeight = Infinity) => {
  const tops = wordTops.filter((top) => top < visibleHeight);
  if (!tops.length) return Math.max(wordTops.length - 1, 0);

  const lastTop = Math.max(...tops);
  const isSingleLine = tops.every((top) => Math.abs(top - lastTop) <= SAME_LINE_TOLERANCE_PX);
  if (isSingleLine) return tops.length - 1;

  return tops.findIndex((top) => Math.abs(top - lastTop) <= SAME_LINE_TOLERANCE_PX);
};
