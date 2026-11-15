// src/pages/landing/BlogShowcase.tsx
//
// "From the Blog" highlight on the landing page: the latest published posts,
// using the same data hook and card as the full /blog page.

import React, { useEffect } from "react";
import { useBlogs } from "../../hooks/useBlogs";
import BlogCard from "../../components/blog/BlogCard";
import Section from "../../components/layout/Section";
import CardGridSkeleton from "../../components/layout/CardGridSkeleton";
import EmptyState from "../../components/layout/EmptyState";

const PREVIEW_COUNT = 6;

const BlogShowcase: React.FC = () => {
  const { blogs, loading, error, fetchPublishedBlogs } = useBlogs();

  useEffect(() => {
    fetchPublishedBlogs();
  }, [fetchPublishedBlogs]);

  // The navbar's Blogs link scrolls here, so the section always renders.
  const empty = !loading && (Boolean(error) || blogs.length === 0);

  return (
    <Section
      id="blog"
      label="From the Blog"
      title="From the Blog"
      description="Tutorials, project write-ups and lessons from the Hub's own developers."
      tone="muted"
    >
      {loading ? (
        <CardGridSkeleton label="Loading blog posts" count={PREVIEW_COUNT} />
      ) : empty ? (
        <EmptyState
          title="No articles yet"
          message="New articles will appear here once they are published."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.slice(0, PREVIEW_COUNT).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </Section>
  );
};

export default BlogShowcase;
