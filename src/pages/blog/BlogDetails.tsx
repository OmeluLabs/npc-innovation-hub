// src/pages/blog/BlogDetails.tsx
//
// Article page: a narrow, readable column with a clear header (category,
// title, author, date, reading time), the cover image, then the body.

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import { useBlogs } from "../../hooks/useBlogs";
import EmptyState from "../../components/layout/EmptyState";
import { authorName } from "../../components/blog/BlogCard";
import { readingTimeMinutes } from "../../utils/readingTime";
import { stripEmoji } from "../../utils/stripEmoji";

// Escapes raw text before any markdown substitution runs, so a blog post
// whose body literally contains "<script>...</script>" (or any other HTML)
// renders as inert visible text instead of executing - this content reaches
// every visitor's browser via dangerouslySetInnerHTML below, so an
// unescaped "<" here was a real stored-XSS hole reachable by anyone able to
// write blog content (Admin-only today, but every visitor is the blast
// radius, not just the author). The markdown substitutions below only ever
// wrap this already-escaped text in tags from our own trusted templates -
// they never re-introduce raw "<"/">" from the input itself.
const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Simple markdown to HTML renderer (no external deps). Classes come from the
// shared theme tokens.
const renderMarkdown = (md: string): string => {
  return escapeHtml(md)
    .replace(/^### (.+)$/gm, '<h3 class="mt-8 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="mt-10 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h2 class="mt-10 mb-3">$1</h2>')
    .replace(/^---$/gm, '<hr class="my-8 border-line" />')
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-semibold text-primary">$1</strong>',
    )
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc">$1</li>')
    .replace(
      /(<li[\s\S]*?<\/li>\n?)+/g,
      (match) => `<ul class="my-4 space-y-1.5">${match}</ul>`,
    )
    .replace(/^(?!<[a-z]).+$/gm, (line) =>
      line.trim() ? `<p class="my-4 leading-relaxed">${line}</p>` : "",
    )
    .replace(/\n{2,}/g, "");
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedBlog,
    loading,
    error,
    fetchPublicBlogById,
    clearSelectedBlog,
  } = useBlogs();

  useEffect(() => {
    if (id) fetchPublicBlogById(id);
    return () => clearSelectedBlog();
  }, [id, fetchPublicBlogById, clearSelectedBlog]);

  if (loading) {
    return (
      <div className="bg-surface-muted min-h-screen">
        <div className="mx-auto flex max-w-3xl animate-pulse flex-col gap-5 px-6 py-12">
          <div className="h-5 w-24 rounded bg-line" />
          <div className="h-10 w-3/4 rounded bg-line" />
          <div className="h-64 w-full rounded-2xl bg-line" />
          <div className="h-4 w-full rounded bg-line" />
          <div className="h-4 w-5/6 rounded bg-line" />
          <div className="h-4 w-4/5 rounded bg-line" />
        </div>
      </div>
    );
  }

  if (error || !selectedBlog) {
    return (
      <div className="bg-surface-muted min-h-screen px-6 py-16">
        <div className="mx-auto max-w-xl">
          <EmptyState
            title="Article not found"
            message={error || "This article may have been removed."}
            action={
              <button
                onClick={() => navigate("/blog")}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Back to blogs
              </button>
            }
          />
        </div>
      </div>
    );
  }

  const htmlContent = renderMarkdown(selectedBlog.content);

  return (
    <div className="bg-surface-muted min-h-screen">
      <article className="mx-auto max-w-3xl px-6 py-10 lg:py-14">
        <button
          onClick={() => navigate("/blog")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary focus:outline-none focus-visible:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to blogs
        </button>

        <header className="mt-6">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-secondary">
            {selectedBlog.category}
          </span>
          <h1 className="mt-4">{stripEmoji(selectedBlog.title)}</h1>
          <p className="mt-4 text-lg text-ink-muted">
            {stripEmoji(selectedBlog.summary)}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-line py-4 text-sm text-ink-muted">
            <span className="font-semibold text-primary">
              {authorName(selectedBlog)}
            </span>
            <time dateTime={selectedBlog.createdAt}>
              {formatDate(selectedBlog.createdAt)}
            </time>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {readingTimeMinutes(selectedBlog.content)} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" aria-hidden="true" />
              {selectedBlog.viewCount} views
            </span>
          </div>
        </header>

        {selectedBlog.image && (
          <img
            src={selectedBlog.image}
            alt=""
            className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
          />
        )}

        <div
          className="mt-8 text-base text-ink-muted"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="mt-12 border-t border-line pt-6">
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary focus:outline-none focus-visible:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to all articles
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogDetails;
