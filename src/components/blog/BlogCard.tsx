// src/components/blog/BlogCard.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Calendar, FileText } from "lucide-react";
import type { Blog } from "../../types/blog.types";

interface BlogCardProps {
  blog: Blog;
}

const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Front-end":
      return "bg-pink-100 text-pink-700";
    case "Back-end":
      return "bg-blue-100 text-blue-700";
    case "Cyber security":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden
                 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="h-48 w-full overflow-hidden bg-gray-100">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mist-400">
            <FileText className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Category badge */}
        <span
          className={`self-start text-xs font-semibold px-2.5 py-0.5 rounded-full ${getCategoryColor(blog.category)}`}
        >
          {blog.category}
        </span>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">
          {blog.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-gray-500 line-clamp-3 flex-1">
          {blog.summary}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(blog.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {blog.viewCount} views
          </span>
        </div>

        {/* CTA - was a one-off purple (#5745B2) matching no other accent
            color on the site; navy matches every other CTA button. */}
        <button
          onClick={() => navigate(`/blogs/${blog.id}`)}
          className="mt-1 w-full py-2 rounded-lg text-sm font-semibold text-white bg-[#002b56] hover:bg-[#003366] transition-colors duration-200"
        >
          Read More
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
