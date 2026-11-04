// src/utils/readingTime.ts

const WORDS_PER_MINUTE = 200;

/** Estimated minutes to read some text; never less than 1. */
export function readingTimeMinutes(text: string | null | undefined): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
