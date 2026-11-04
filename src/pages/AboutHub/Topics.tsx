// src/pages/AboutHub/Topics.tsx  (BlogDesign)
//
// The blog list page: search, category filter, a "Most read" row and the
// full article grid. Rendered under the public navbar at /blog, and embedded
// (no page header) inside the member dashboard at /dashboard/blog.

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useBlogs } from "../../hooks/useBlogs";
import BlogList from "../../components/blog/BlogList";
import FeaturedBlogs from "../../components/blog/FeaturedBlogs";
import PageHeader from "../../components/layout/PageHeader";
import { BLOG_CATEGORIES } from "../../types/blog.types";

const CATEGORY_ALL = "View All";

interface BlogDesignProps {
  // When rendered inside DashboardLayout (see /dashboard/blog), the
  // Topbar/sidebar shell already frames the page, so the public page header
  // is skipped.
  embedded?: boolean;
}

const BlogDesign: React.FC<BlogDesignProps> = ({ embedded = false }) => {
  const {
    blogs,
    featuredBlogs,
    loading,
    error,
    fetchPublishedBlogs,
    fetchFeaturedBlogs,
  } = useBlogs();

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPublishedBlogs();
    fetchFeaturedBlogs();
  }, [fetchPublishedBlogs, fetchFeaturedBlogs]);

  const handleCategoryClick = (cat: string) => {
    if (cat === CATEGORY_ALL) {
      setActiveCategory("");
    } else {
      setActiveCategory(cat === activeCategory ? "" : cat);
    }
  };

  const isActive = (cat: string) =>
    cat === CATEGORY_ALL ? activeCategory === "" : activeCategory === cat;

  const content = (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">
          {blogs.length} article{blogs.length !== 1 ? "s" : ""}
        </p>

        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            aria-label="Search articles"
            placeholder="Search for articles"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </div>

      <div
        role="group"
        aria-label="Filter by category"
        className="mb-8 flex flex-wrap gap-2"
      >
        {[CATEGORY_ALL, ...BLOG_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            aria-pressed={isActive(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
              isActive(cat)
                ? "bg-primary text-white"
                : "border border-line bg-white text-secondary hover:border-secondary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && !loading && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {!activeCategory && !search && featuredBlogs.length > 0 && (
        <FeaturedBlogs blogs={featuredBlogs} />
      )}

      <h2 className="mb-6">
        {activeCategory ? activeCategory : "All articles"}
      </h2>

      <BlogList
        blogs={blogs}
        loading={loading}
        search={search}
        activeCategory={activeCategory}
      />
    </>
  );

  if (embedded) {
    return <div className="mx-auto max-w-6xl">{content}</div>;
  }

  return (
    <>
      <PageHeader
        eyebrow="Blogs"
        title="Ideas and lessons from the Hub"
        description="Articles written by our members on software, security and building things that work."
      />
      <div className="bg-surface-muted">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12 lg:py-16">
          {content}
        </div>
      </div>
    </>
  );
};

export default BlogDesign;
