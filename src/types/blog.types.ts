/**
 * Blog Type Definitions
 * TypeScript interfaces for blog-related data structures
 */

export interface Blog {
  id: string;
  title: string;
  content: string;
  summary: string;
  image: string | null;
  category: string;
  authorId: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  /** Present on public responses so pages can show a byline. */
  author?: { firstName: string; lastName: string } | null;
}

export interface BlogFormData {
  title: string;
  content: string;
  summary: string;
  category: string;
  image?: File | null;
  isPublished: boolean;
}

export interface BlogApiResponse {
  status: string;
  results?: number;
  data: {
    blog?: Blog;
    blogs?: Blog[];
  };
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  summary: string;
  category: string;
  isPublished: boolean;
}

export interface UpdateBlogPayload {
  title?: string;
  content?: string;
  summary?: string;
  category?: string;
  isPublished?: boolean;
}

export const BLOG_CATEGORIES = [
  "Front-end",
  "Back-end",
  "Cyber security",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
