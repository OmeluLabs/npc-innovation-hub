// src/pages/landing/BlogShowcase.tsx
//
// "From the Blog" section of the single-page Home story. Home never had a
// blog preview at all despite the Hub actively publishing posts - reuses
// the same real API and card component the full /blog page already uses
// (useBlogs' fetchPublishedBlogs, BlogCard), rather than inventing a
// second, parallel data source. Matches ProjectsShowcase.tsx's structure.

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogs } from "../../hooks/useBlogs";
import BlogCard from "../../components/blog/BlogCard";

const PREVIEW_COUNT = 3;

const SkeletonGrid: React.FC = () => (
  <div
    className="grid grid-cols-1 md:grid-cols-3 gap-8"
    aria-label="Loading blog posts"
  >
    {[...Array(PREVIEW_COUNT)].map((_, i) => (
      <div
        key={i}
        className="rounded-xl overflow-hidden shadow-sm animate-pulse bg-surface-muted"
      >
        <div className="w-full h-48 bg-line" />
        <div className="p-5 space-y-3">
          <div className="h-4 w-20 rounded-full bg-line" />
          <div className="h-5 w-2/3 rounded bg-line" />
          <div className="h-4 w-full rounded bg-line" />
          <div className="h-4 w-4/5 rounded bg-line" />
        </div>
      </div>
    ))}
  </div>
);

const BlogShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { blogs, loading, error, fetchPublishedBlogs } = useBlogs();

  useEffect(() => {
    fetchPublishedBlogs();
  }, [fetchPublishedBlogs]);

  // No published posts yet (or the fetch failed) is a normal state for an
  // optional homepage section, not something to show an error/empty card
  // for - render nothing, matching HubIntroVideo.tsx.
  if (!loading && (error || blogs.length === 0)) return null;

  const preview = blogs.slice(0, PREVIEW_COUNT);

  return (
    <section
      id="blog"
      aria-label="From the Blog"
      className="scroll-mt-16 lg:scroll-mt-20 py-20 px-4 md:px-8 bg-white"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            From the Blog
          </h2>
          <p className="text-xl font-medium text-primary/80 max-w-3xl mx-auto">
            Tutorials, project write-ups, and lessons from the Hub&apos;s own
            developers.
          </p>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {preview.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        {!loading && blogs.length > PREVIEW_COUNT && (
          <div className="flex justify-center mt-16">
            <button
              className="text-lg py-3 px-12 border-2 border-primary text-primary rounded-[33px] shadow-md hover:bg-line transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              onClick={() => navigate("/blog")}
            >
              View All Posts
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogShowcase;
