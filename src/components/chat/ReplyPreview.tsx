// src/components/chat/ReplyPreview.tsx

import React from "react";
import { X } from "lucide-react";

interface ReplyPreviewProps {
  senderName: string;
  content: string;
  onCancel: () => void;
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  senderName,
  content,
  onCancel,
}) => (
  <div className="flex items-start gap-2 px-4 py-2 bg-surface-muted border-l-4 border-secondary rounded-lg mb-2">
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-secondary mb-0.5">
        {senderName}
      </p>
      <p className="text-xs text-ink-muted truncate">{content}</p>
    </div>
    <button
      type="button"
      onClick={onCancel}
      className="p-0.5 text-ink-muted hover:text-ink-muted transition-colors flex-shrink-0"
    >
      <X size={14} />
    </button>
  </div>
);

export default ReplyPreview;
