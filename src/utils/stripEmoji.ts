// src/utils/stripEmoji.ts
//
// The public site shows no emojis. Content typed by admins and members into
// titles and descriptions can still contain them, so public pages run that text
// through this before rendering. (Direct and hub messages are exempt and do not
// use it.)

// Alternation rather than one character class: the joiner/variation/keycap
// code points are combining characters, which lint rejects inside a class.
const EMOJI_PATTERN =
  /\p{Extended_Pictographic}|\p{Regional_Indicator}|‍|️|⃣/gu;

export function stripEmoji(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(EMOJI_PATTERN, "").replace(/ {2,}/g, " ").trim();
}
