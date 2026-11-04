// src/components/blog/BlogCard.tsx
//
// Blog list card: cover image, category, title, excerpt, author, date and
// reading time. The whole card is one link to the article.

import React from "react";
import { Link } from "react-router-dom";
import { Clock, FileText } from "lucide-react";
import type { Blog } from "../../types/blog.types";
import { readingTimeMinutes } from "../../utils/readingTime";
import { stripEmoji } from "../../utils/stripEmoji";
import { authorName } from "../../utils/blogAuthor";

interface BlogCardProps {
  blog: Blog;
}

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const title = stripEmoji(blog.title);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-shadow duration-200 hover:shadow-medium">
      <div className="aspect-[16/9] w-full overflow-hidden bg-surface-muted">
        {blog.image ? (
          <img
            src={blog.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-secondary/40">
            <FileText className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="self-start rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-secondary">
          {blog.category}
        </span>

        <h3 className="line-clamp-2">
          <Link
            to={`/blogs/${blog.id}`}
            className="focus:outline-none focus-visible:underline after:absolute after:inset-0"
          >
            {title}
          </Link>
        </h3>

        <p className="line-clamp-3 flex-1 text-sm text-ink-muted">
          {stripEmoji(blog.summary)}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-xs text-ink-muted">
          <span className="font-semibold text-primary">{authorName(blog)}</span>
          <span className="flex items-center gap-3">
            <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {readingTimeMinutes(blog.content)} min read
            </span>
          </span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
