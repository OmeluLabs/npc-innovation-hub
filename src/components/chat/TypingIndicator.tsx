// src/components/chat/TypingIndicator.tsx

import React from "react";

interface TypingIndicatorProps {
  name: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ name }) => (
  <div className="flex items-center gap-2 px-4 py-1">
    <div className="flex gap-1 items-center bg-surface-muted rounded-2xl rounded-bl-sm px-3 py-2">
      <span className="w-1.5 h-1.5 bg-ink-muted rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 bg-ink-muted rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 bg-ink-muted rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
    <span className="text-xs text-ink-muted italic">{name} is typing…</span>
  </div>
);

export default TypingIndicator;
