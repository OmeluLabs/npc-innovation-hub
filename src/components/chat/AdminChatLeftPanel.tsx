// src/components/chat/AdminChatLeftPanel.tsx
//
// Left panel for admin chat pages.
// Reuses the same NewConversationModal and conversation hooks,
// but navigates to /admin/messages/:id and /admin/hub-channel.

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Hash, Search, Plus, MessageSquare, Mail } from "lucide-react";
import { useConversations } from "../../hooks/useDirectMessages";
import { useAuth } from "../../hooks/useAuth";
import NewConversationModal from "./NewConversationModal";
import type { MemberItem } from "./NewConversationModal";
import { HeaderAvatar } from "./ChatShell";
import { getPendingContactMessagesCount } from "../../api/admin/contact.api";

interface AdminChatLeftPanelProps {
  selectedUserId?: string | null;
  onSelect?: (userId: string, memberName: string) => void;
  basePath?: string; // "/admin" or "/dashboard" etc.
}

const formatTime = (iso: string): string => {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return iso;
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 1) return "now";
    if (diffMin < 60) return `${diffMin}m`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

const Skeleton: React.FC = () => (
  <div className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-line flex-shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="h-3 bg-line rounded w-3/4" />
      <div className="h-3 bg-line rounded w-1/2" />
    </div>
  </div>
);

const AdminChatLeftPanel: React.FC<AdminChatLeftPanelProps> = ({
  selectedUserId,
  onSelect,
  basePath = "/admin",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showNewConvo, setShowNewConvo] = useState(false);

  const { conversations, isLoading } = useConversations();
  const isHub = location.pathname === `${basePath}/hub-channel`;
  const isContactMessages =
    location.pathname === `${basePath}/contact-messages`;

  // Pending contact-message count for the shortcut's badge, same idea as
  // the outer admin Sidebar's own "Hire Us Requests" badge - polled
  // rather than pushed, matching this panel's own conversation list (no
  // real-time infra for this one either).
  const [pendingContactCount, setPendingContactCount] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const fetchCount = () => {
      getPendingContactMessagesCount()
        .then((count) => {
          if (!cancelled) setPendingContactCount(count);
        })
        .catch(() => {
          /* badge just stays at its last known value on failure */
        });
    };
    fetchCount();
    const timer = setInterval(fetchCount, 45_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const filtered = conversations.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );

  const go = (userId: string, name: string) => {
    if (onSelect) onSelect(userId, name);
    else navigate(`${basePath}/messages/${userId}`);
  };

  const handleModalSelect = (member: MemberItem) => {
    setShowNewConvo(false);
    go(member.id, member.name);
  };

  return (
    <>
      {showNewConvo && user && (
        <NewConversationModal
          currentUserId={user.id}
          onSelect={handleModalSelect}
          onClose={() => setShowNewConvo(false)}
        />
      )}

      {/* Panel — fixed width on md+, full height, own scroll. w-full below
          md: only ever shown alone there (the admin pages hide it once a
          conversation is open), same as the member LeftPanel - md, not
          lg, so a landscape phone gets the list beside the chat instead
          of being forced into single-pane it has room to avoid. */}
      <div className="bg-white rounded-2xl shadow-lg border border-line w-full md:w-72 h-full flex flex-col flex-shrink-0 overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-line flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-primary" />
              <h2 className="font-bold text-base text-primary">Messages</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowNewConvo(true)}
              className="p-1.5 hover:bg-surface-muted rounded-lg transition-colors group"
              title="New conversation"
            >
              <Plus
                size={16}
                className="text-ink-muted group-hover:text-secondary transition-colors"
              />
            </button>
          </div>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-surface-muted border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>

        {/* Hub Channel + Contact Messages shortcuts */}
        <div className="px-3 py-2 border-b border-line flex-shrink-0 space-y-1">
          <button
            type="button"
            onClick={() => navigate(`${basePath}/hub-channel`)}
            className={`w-full flex items-center gap-3 py-2 px-2.5 rounded-xl text-left transition-all ${
              isHub
                ? "bg-surface-muted border border-accent"
                : "hover:bg-surface-muted"
            }`}
          >
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
              <Hash size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold text-sm ${isHub ? "text-primary" : "text-primary"}`}
              >
                Hub Channel
              </p>
              <p className="text-xs text-ink-muted truncate">
                General discussions
              </p>
            </div>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
          </button>

          {/* Contact Messages - public "Contact Us" form submissions,
              reviewed here rather than folded into the live DM/hub-channel
              chat threads above, since they aren't a back-and-forth chat -
              they're one-shot form submissions an admin reviews and
              optionally replies to by email. */}
          <button
            type="button"
            onClick={() => navigate(`${basePath}/contact-messages`)}
            className={`w-full flex items-center gap-3 py-2 px-2.5 rounded-xl text-left transition-all ${
              isContactMessages
                ? "bg-surface-muted border border-accent"
                : "hover:bg-surface-muted"
            }`}
          >
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold text-sm ${isContactMessages ? "text-primary" : "text-primary"}`}
              >
                Contact Messages
              </p>
              <p className="text-xs text-ink-muted truncate">
                Submitted from the website
              </p>
            </div>
            {pendingContactCount > 0 && (
              <span className="flex-shrink-0 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-semibold">
                {pendingContactCount > 99 ? "99+" : pendingContactCount}
              </span>
            )}
          </button>
        </div>

        {/* DM section label */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between flex-shrink-0">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-widest">
            Direct Messages
          </span>
          <span className="text-xs text-ink-muted bg-surface-muted px-1.5 py-0.5 rounded-full">
            {conversations.length}
          </span>
        </div>

        {/* Conversation list — only this scrolls */}
        <div className="flex-1 overflow-y-auto px-2 pb-3 min-h-0">
          {isLoading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-ink-muted text-center py-6 px-4">
              {search
                ? "No matches."
                : "No conversations yet. Click + to start one."}
            </p>
          ) : (
            <ul className="space-y-0.5">
              {filtered.map((conv) => {
                const fullName =
                  `${conv.firstName} ${conv.lastName}`.trim() || "Unknown";
                const isSelected = selectedUserId === conv.userId;
                const lastMsg =
                  typeof conv.lastMessage === "string" ? conv.lastMessage : "";
                return (
                  <li
                    key={conv.userId}
                    onClick={() => go(conv.userId, fullName)}
                    className={`flex items-center gap-2.5 py-2 px-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-surface-muted border border-accent"
                        : "hover:bg-surface-muted"
                    }`}
                  >
                    <HeaderAvatar name={fullName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className={`font-semibold text-xs truncate ${isSelected ? "text-primary" : "text-primary"}`}
                        >
                          {fullName}
                        </span>
                        <span className="text-[10px] text-ink-muted ml-1 flex-shrink-0">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-muted truncate">
                        {lastMsg || "No messages yet"}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 bg-secondary text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 font-medium">
                        {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminChatLeftPanel;
