import { stripEmoji } from "./stripEmoji";

// Emojis are built from code points so this file itself stays emoji-free.
const emoji = (...codePoints: number[]): string =>
  String.fromCodePoint(...codePoints);

describe("stripEmoji", () => {
  test("removes emojis and tidies the leftover spacing", () => {
    expect(stripEmoji(`Hub Portal ${emoji(0x1f680)} launch`)).toBe(
      "Hub Portal launch",
    );
    expect(stripEmoji(`${emoji(0x1f4da)} Learning Platform`)).toBe(
      "Learning Platform",
    );
    // A joined sequence (person + joiner + laptop) and a BMP emoji.
    expect(
      stripEmoji(
        `Team ${emoji(0x1f468, 0x200d, 0x1f4bb)} build ${emoji(0x2728)}`,
      ),
    ).toBe("Team build");
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
