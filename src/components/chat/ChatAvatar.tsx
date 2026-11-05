// src/components/chat/ChatAvatar.tsx

import React from "react";

interface ChatAvatarProps {
  image: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-xs",
  lg: "w-11 h-11 text-sm",
};

const ChatAvatar: React.FC<ChatAvatarProps> = ({
  image,
  name,
  size = "md",
  isOnline,
  className = "",
}) => {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const sizeClass = SIZE_MAP[size];

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {image ? (
        <img
          src={image}
          alt={name}
          className={`${sizeClass} rounded-full object-cover`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div
          className={`${sizeClass} rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-primary to-primary`}
        >
          {initials}
        </div>
      )}
      {isOnline !== undefined && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
            isOnline ? "bg-green-500" : "bg-ink-muted"
          }`}
        />
      )}
    </div>
  );
};

export default ChatAvatar;
