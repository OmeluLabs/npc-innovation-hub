// src/components/chat/ScrollToBottomButton.tsx

import React from "react";
import { ChevronDown } from "lucide-react";

interface ScrollToBottomButtonProps {
  onClick: () => void;
  unreadCount?: number;
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
  onClick,
  unreadCount,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute bottom-24 right-6 z-10 flex items-center gap-1 bg-white text-primary rounded-full shadow-lg border border-line px-3 py-2 hover:bg-surface-muted transition-all duration-200 text-xs font-medium"
  >
    {unreadCount && unreadCount > 0 ? (
      <span className="bg-secondary text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
        {unreadCount}
      </span>
    ) : null}
    <ChevronDown size={14} />
  </button>
);

export default ScrollToBottomButton;
