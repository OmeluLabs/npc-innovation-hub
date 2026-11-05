// src/components/events/EventSkeleton.tsx

import React from "react";

const EventSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white shadow-md overflow-hidden flex flex-col animate-pulse">
      <div className="w-full h-48 bg-line" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-5 bg-line rounded w-3/4" />
        <div className="h-4 bg-surface-muted rounded w-1/2" />
        <div className="flex gap-8">
          <div className="h-4 bg-surface-muted rounded w-24" />
          <div className="h-4 bg-surface-muted rounded w-24" />
        </div>
        <div className="h-4 bg-surface-muted rounded w-full" />
        <div className="h-4 bg-surface-muted rounded w-5/6" />
      </div>
    </div>
  );
};

export default EventSkeleton;
