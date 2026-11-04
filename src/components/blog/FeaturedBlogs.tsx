// src/components/blog/FeaturedBlogs.tsx
//
// "Most read" row above the full article list. Uses the same card as the
// list so the two never drift apart.

import React from "react";
import type { Blog } from "../../types/blog.types";
import BlogCard from "./BlogCard";

interface FeaturedBlogsProps {
  blogs: Blog[];
}

const FeaturedBlogs: React.FC<FeaturedBlogsProps> = ({ blogs }) => {
  if (blogs.length === 0) return null;

  return (
    <section aria-labelledby="featured-articles-heading" className="mb-12">
      <h2 id="featured-articles-heading" className="mb-6">
        Most read
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.slice(0, 3).map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedBlogs;
