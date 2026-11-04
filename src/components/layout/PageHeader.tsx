// src/components/layout/PageHeader.tsx
//
// Shared page banner for public pages (Events, Blogs, Projects, ...), so every
// page opens with the same spacing, type scale and colour treatment.

import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  eyebrow,
  children,
}) => (
  <header className="bg-npc-navy text-white">
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 lg:py-20">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/80">
          {description}
        </p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </div>
  </header>
);

export default PageHeader;
