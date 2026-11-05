// src/components/resources/SaveButton.tsx

import React, { useState } from "react";
import { Bookmark } from "lucide-react";

interface SaveButtonProps {
  resourceId: string;
  hasSaved: boolean;
  onSave: (id: string) => Promise<void>;
  compact?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  resourceId,
  hasSaved,
  onSave,
  compact = false,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    await onSave(resourceId);
    setLoading(false);
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        title={hasSaved ? "Saved" : "Save"}
        className={`p-1 rounded-md transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed
          ${
            hasSaved
              ? "text-green-600 bg-green-50"
              : "text-ink-muted hover:text-green-600 hover:bg-green-50"
          }`}
      >
        <Bookmark size={16} fill={hasSaved ? "currentColor" : "none"} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed
        ${
          hasSaved
            ? "bg-green-100 text-green-700"
            : "bg-surface-muted text-primary hover:bg-green-100 hover:text-green-700"
        }`}
    >
      <Bookmark size={16} fill={hasSaved ? "currentColor" : "none"} />
      {hasSaved ? "Saved" : "Save"}
    </button>
  );
};

export default SaveButton;
