import { stripEmoji } from "./stripEmoji";

// Emojis are written as code point escapes so this file itself stays
// emoji-free.
describe("stripEmoji", () => {
  test("removes emojis and tidies the leftover spacing", () => {
    expect(stripEmoji("Hub Portal \u{1F680} launch")).toBe("Hub Portal launch");
    expect(stripEmoji("\u{1F4DA} Learning Platform")).toBe("Learning Platform");
    expect(stripEmoji("Team \u{1F468}‍\u{1F4BB} build ✨")).toBe("Team build");
  });

  test("leaves ordinary text, digits and punctuation untouched", () => {
    expect(stripEmoji("Route 66 (v2.0) - #1 & done!")).toBe(
      "Route 66 (v2.0) - #1 & done!",
    );
  });

  test("handles missing values", () => {
    expect(stripEmoji(null)).toBe("");
    expect(stripEmoji(undefined)).toBe("");
  });
});
