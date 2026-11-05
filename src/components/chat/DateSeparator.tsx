// src/components/chat/DateSeparator.tsx

import React from "react";

interface DateSeparatorProps {
  label: string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ label }) => (
  <div className="flex items-center gap-3 my-4 px-2">
    <div className="flex-1 h-px bg-line" />
    <span className="text-xs font-medium text-ink-muted bg-white px-2 py-0.5 rounded-full border border-line whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-line" />
  </div>
);

export default DateSeparator;
