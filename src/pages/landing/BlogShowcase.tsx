// src/pages/landing/BlogShowcase.tsx
//
// "From the Blog" highlight on the landing page: the latest published posts,
// using the same data hook and card as the full /blog page.

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogs } from "../../hooks/useBlogs";
import BlogCard from "../../components/blog/BlogCard";
import Section from "../../components/layout/Section";
import CardGridSkeleton from "../../components/layout/CardGridSkeleton";
import ViewAllButton from "../../components/layout/ViewAllButton";

const PREVIEW_COUNT = 3;

const BlogShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { blogs, loading, error, fetchPublishedBlogs } = useBlogs();

  useEffect(() => {
    fetchPublishedBlogs();
  }, [fetchPublishedBlogs]);

  // No published posts yet (or the fetch failed) is a normal state for an
  // optional homepage section, so render nothing rather than an error card.
  if (!loading && (error || blogs.length === 0)) return null;

  return (
    <Section
      id="blog"
      label="From the Blog"
      title="From the Blog"
      description="Tutorials, project write-ups and lessons from the Hub's own developers."
      tone="muted"
      action={
        !loading && blogs.length > PREVIEW_COUNT ? (
          <ViewAllButton onClick={() => navigate("/blog")}>
            View All Posts
          </ViewAllButton>
        ) : undefined
      }
    >
      {loading ? (
        <CardGridSkeleton label="Loading blog posts" count={PREVIEW_COUNT} />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {blogs.slice(0, PREVIEW_COUNT).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </Section>
  );
};

export default BlogShowcase;
