// src/components/profile/ProfileSkeleton.tsx

import React from "react";

const S: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-line rounded-lg animate-pulse ${className}`} />
);

const ProfileSkeleton: React.FC = () => (
  <div className="min-h-screen bg-surface-muted">
    {/* Header */}
    <div className="h-48 bg-gradient-to-r from-line to-line animate-pulse" />
    <div className="max-w-5xl mx-auto px-6 -mt-16 pb-10">
      <div className="flex items-end gap-5 mb-8">
        <div className="w-28 h-28 rounded-2xl bg-line animate-pulse border-4 border-white shrink-0" />
        <div className="mb-3">
          <S className="h-6 w-48 mb-2" />
          <S className="h-4 w-32" />
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-3 mb-7">
        {[1, 2, 3, 4].map((n) => (
          <S key={n} className="h-9 w-24 rounded-lg" />
        ))}
      </div>
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <S className="h-32 w-full rounded-xl" />
          <S className="h-24 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <S className="h-40 w-full rounded-xl" />
          <S className="h-28 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSkeleton;
