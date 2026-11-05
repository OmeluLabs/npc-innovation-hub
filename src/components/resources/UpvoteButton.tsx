// src/components/resources/UpvoteButton.tsx

import React, { useState } from "react";
import { ThumbsUp } from "lucide-react";

interface UpvoteButtonProps {
  resourceId: string;
  upvotes: number;
  hasUpvoted: boolean;
  onUpvote: (id: string) => Promise<void>;
  compact?: boolean;
}

const UpvoteButton: React.FC<UpvoteButtonProps> = ({
  resourceId,
  upvotes,
  hasUpvoted,
  onUpvote,
  compact = false,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    await onUpvote(resourceId);
    setLoading(false);
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        title="Upvote"
        className={`flex items-center gap-1 p-1 rounded-md transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed
          ${
            hasUpvoted
              ? "text-secondary bg-surface-muted"
              : "text-ink-muted hover:text-secondary hover:bg-surface-muted"
          }`}
      >
        <ThumbsUp size={16} />
        <span className="text-xs font-medium">{upvotes}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed
        ${
          hasUpvoted
            ? "bg-surface-muted text-primary"
            : "bg-surface-muted text-primary hover:bg-surface-muted hover:text-primary"
        }`}
    >
      <ThumbsUp size={16} />
      {hasUpvoted ? "Upvoted" : "Upvote"} · {upvotes}
    </button>
  );
};

export default UpvoteButton;
