// src/components/layout/Section.tsx
//
// Shared wrapper for landing-page sections: identical vertical rhythm,
// container width and heading treatment everywhere, with an optional
// "view all" action under the content. `tone` alternates the background so
// adjacent sections stay visually distinct.

import React from "react";

interface SectionProps {
  id?: string;
  label: string;
  title: string;
  description?: string;
  tone?: "light" | "muted";
  children: React.ReactNode;
  action?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  id,
  label,
  title,
  description,
  tone = "light",
  children,
  action,
}) => (
  <section
    id={id}
    aria-label={label}
    className={`scroll-mt-16 lg:scroll-mt-20 py-16 lg:py-24 ${
      tone === "muted" ? "bg-surface-muted" : "bg-white"
    }`}
  >
    <div className="mx-auto max-w-7xl px-6 lg:px-12">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2>{title}</h2>
        {description && (
          <p className="mt-4 text-lg text-ink-muted">{description}</p>
        )}
      </div>
      {children}
      {action && <div className="mt-12 flex justify-center">{action}</div>}
    </div>
  </section>
);

export default Section;
