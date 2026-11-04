// src/components/layout/EmptyState.tsx
//
// Shared empty / error panel for lists with nothing to show.

import React from "react";

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, action }) => (
  <div
    role="status"
    className="rounded-2xl border border-dashed border-mist-400 bg-mist-100 px-6 py-14 text-center"
  >
    <h2 className="text-lg font-bold text-npc-navy">{title}</h2>
    {message && (
      <p className="mt-2 mx-auto max-w-md text-sm text-npc-text-secondary">
        {message}
      </p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
