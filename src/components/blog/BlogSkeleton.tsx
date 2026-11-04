// src/components/blog/BlogSkeleton.tsx

import React from "react";

const BlogSkeleton: React.FC = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-line bg-white">
    <div className="aspect-[16/9] w-full bg-line" />
    <div className="flex flex-col gap-3 p-5">
      <div className="h-5 w-20 rounded-full bg-line" />
      <div className="h-5 w-3/4 rounded bg-line" />
      <div className="h-4 w-full rounded bg-line" />
      <div className="h-4 w-5/6 rounded bg-line" />
      <div className="mt-2 flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-line" />
        <div className="h-3 w-20 rounded bg-line" />
      </div>
    </div>
  </div>
);

export const BlogSkeletonGrid: React.FC<{ count?: number }> = ({
  count = 6,
}) => (
  <div
    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    aria-busy="true"
    aria-label="Loading articles"
  >
    {Array.from({ length: count }).map((_, i) => (
      <BlogSkeleton key={i} />
    ))}
  </div>
);

export default BlogSkeleton;
