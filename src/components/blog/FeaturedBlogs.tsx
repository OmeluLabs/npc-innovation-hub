// src/components/blog/FeaturedBlogs.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Star, FileText } from "lucide-react";
import type { Blog } from "../../types/blog.types";

interface FeaturedBlogsProps {
  blogs: Blog[];
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

const FeaturedBlogs: React.FC<FeaturedBlogsProps> = ({ blogs }) => {
  const navigate = useNavigate();

  if (blogs.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Star size={18} className="text-yellow-500 fill-yellow-500" />
        <h2 className="text-lg font-bold text-gray-800">Featured Articles</h2>
      </div>

      {/* Horizontal scroll strip */}
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-200">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => navigate(`/blogs/${blog.id}`)}
            className="shrink-0 w-72 bg-white rounded-xl shadow-sm border border-gray-100
                       hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
                       cursor-pointer overflow-hidden flex flex-col"
          >
            <div className="h-36 w-full overflow-hidden bg-gray-100">
              {blog.image ? (
                <img
                  src={blog.image}
                  alt={blog.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-mist-400">
                  <FileText className="h-8 w-8" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col gap-2">
              <span
                className={`self-start text-xs font-semibold px-2 py-0.5 rounded-full ${getCategoryColor(blog.category)}`}
              >
                {blog.category}
              </span>
              <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                {blog.title}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Eye size={11} />
                <span>{blog.viewCount} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBlogs;
