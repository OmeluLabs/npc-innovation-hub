// src/components/blog/BlogList.tsx

import React, { useMemo } from "react";
import type { Blog } from "../../types/blog.types";
import BlogCard from "./BlogCard";
import { BlogSkeletonGrid } from "./BlogSkeleton";
import EmptyState from "../layout/EmptyState";

interface BlogListProps {
  blogs: Blog[];
  loading: boolean;
  search: string;
  activeCategory: string;
}

const BlogList: React.FC<BlogListProps> = ({
  blogs,
  loading,
  search,
  activeCategory,
}) => {
  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchesCategory = !activeCategory || b.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [blogs, search, activeCategory]);

  if (loading) return <BlogSkeletonGrid count={6} />;

  if (filtered.length === 0) {
    const filtering = Boolean(search || activeCategory);
    return (
      <EmptyState
        title={filtering ? "No articles found" : "No articles yet"}
        message={
          filtering
            ? "Try a different category or search term."
            : "New articles will appear here once they are published."
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
