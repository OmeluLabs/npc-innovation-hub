// src/components/layout/CardGridSkeleton.tsx
//
// Loading placeholder shared by the landing-page preview grids.

import React from "react";

interface CardGridSkeletonProps {
  label: string;
  count?: number;
}

const CardGridSkeleton: React.FC<CardGridSkeletonProps> = ({
  label,
  count = 3,
}) => (
  <div
    className="grid grid-cols-1 gap-6 md:grid-cols-3"
    aria-busy="true"
    aria-label={label}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="animate-pulse overflow-hidden rounded-2xl border border-line bg-white"
      >
        <div className="aspect-[16/9] bg-line" />
        <div className="space-y-3 p-5">
          <div className="h-5 w-2/3 rounded bg-line" />
          <div className="h-4 w-full rounded bg-line" />
          <div className="h-4 w-4/5 rounded bg-line" />
        </div>
      </div>
    ))}
  </div>
);

export default CardGridSkeleton;
