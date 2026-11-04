// src/utils/blogAuthor.ts

import type { Blog } from "../types/blog.types";

/** Byline for a blog post; falls back to the Hub when no author is attached. */
export const authorName = (blog: Blog): string =>
  blog.author
    ? `${blog.author.firstName} ${blog.author.lastName}`.trim()
    : "NPC Innovation Hub";
