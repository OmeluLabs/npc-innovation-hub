// src/components/chat/ChatShell.tsx

import React, { useRef, useState, useCallback } from "react";
import {
  MessageSquare,
  Search,
  X,
  MoreHorizontal,
  ChevronLeft,
} from "lucide-react";
import MessageBubble from "./MessageBubble";
import type { BubbleMessage } from "./MessageBubble";
import type { ReplyTarget } from "./MessageInput";
import MessageInput from "./MessageInput";
import type { AttachmentFile } from "./MessageInput";
import DateSeparator from "./DateSeparator";
import ScrollToBottomButton from "./ScrollToBottomButton";
import TypingIndicator from "./TypingIndicator";
import {
  getDateSeparatorLabel,
  isSameDay,
  shouldShowAvatar,
  isGroupStart,
} from "../../utils/chatUtils";

// ── Skeleton ──────────────────────────────────────────────────────────────────

export const MessageSkeleton: React.FC<{ reverse?: boolean }> = ({
  reverse,
}) => (
  <div
    className={`flex items-end gap-3 px-4 animate-pulse ${reverse ? "flex-row-reverse" : ""}`}
  >
    <div className="w-8 h-8 rounded-full bg-line flex-shrink-0" />
    <div
      className={`space-y-1 max-w-xs flex flex-col ${reverse ? "items-end" : ""}`}
    >
      <div className="h-3 bg-line rounded w-20" />
      <div className="h-9 bg-line rounded-2xl w-44" />
    </div>
  </div>
);

// ── Header Avatar ─────────────────────────────────────────────────────────────

const PALETTE = [
  "bg-secondary",
  "bg-secondary",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-orange-500",
  "bg-secondary",
  "bg-secondary",
  "bg-secondary",
];
const colorFor = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
};
const makeInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");

const ENABLE_TYPING_INDICATOR = false;

export const HeaderAvatar: React.FC<{ name: string; size?: "sm" | "md" }> = ({
  name,
  size = "md",
}) => {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${colorFor(name)}`}
    >
      {makeInitials(name) || "?"}
    </div>
  );
};

// ── Props ─────────────────────────────────────────────────────────────────────
// NOTE: getReplyTo is NOT a prop here — parents embed replyTo directly into
// each BubbleMessage via their toBubble() adapter before passing messages down.

export interface ChatShellProps {
  headerTitle: string;
  headerSubtitle?: string;
  headerIcon?: React.ReactNode;
  headerRight?: React.ReactNode;
  showOnlineStatus?: boolean;

  messages: BubbleMessage[];
  currentUserId: string;
  isLoading?: boolean;
  error?: string | null;

  inputPlaceholder?: string;
  isSending?: boolean;
  currentUserImage: string | null;
  currentUserName: string;

  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptySubtitle?: string;
  noSelectionTitle?: string;
  noSelectionSubtitle?: string;
  isSelected?: boolean;

  // Below md, the parent page shows either the conversation list or this
  // chat pane, never both (there isn't room for both at once on a
  // portrait phone). When set, a back chevron appears in the header -
  // md:hidden, since above that breakpoint the list is always visible
  // alongside the chat and there's nothing to "go back" to.
  onBack?: () => void;

  onSend: (
    content: string,
    attachments: AttachmentFile[],
    replyToId: string | null,
  ) => Promise<void>;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onScrollToMessage?: (id: string) => void;

  replyTarget: ReplyTarget | null;
  onReply: (msg: BubbleMessage) => void;
  onCancelReply: () => void;

  editingId: string | null;
  setEditingId: (id: string | null) => void;

  use24h?: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

// ── Component ─────────────────────────────────────────────────────────────────

const ChatShell: React.FC<ChatShellProps> = ({
  headerTitle,
  headerSubtitle,
  headerIcon,
  headerRight,
  showOnlineStatus = false,
  messages,
  currentUserId,
  isLoading = false,
  error,
  inputPlaceholder,
  isSending = false,
  currentUserImage,
  currentUserName,
  emptyIcon,
  emptyTitle = "No messages yet",
  emptySubtitle,
  noSelectionTitle = "Select a conversation",
  noSelectionSubtitle = "Choose from the list or start a new one",
  isSelected = true,
  onBack,
  onSend,
  onEdit,
  onDelete,
  onScrollToMessage,
  replyTarget,
  onReply,
  onCancelReply,
  editingId,
  setEditingId,
  use24h = false,
  messagesEndRef,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesEndRef]);

  const scrollToMsg = useCallback((msgId: string) => {
    const el = document.getElementById(`msg-${msgId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("bg-yellow-50");
      setTimeout(() => el.classList.remove("bg-yellow-50"), 1500);
    }
  }, []);

  const displayed = searchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : messages;

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-line">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to conversations"
              className="md:hidden -ml-1.5 p-2 -mr-1 hover:bg-surface-muted rounded-lg text-ink-muted flex-shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {headerIcon ??
            (isSelected && headerTitle ? (
              <HeaderAvatar name={headerTitle} />
            ) : (
              <div className="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center flex-shrink-0">
                <MessageSquare size={16} className="text-ink-muted" />
              </div>
            ))}
          <div className="min-w-0">
            <h2 className="text-base font-bold text-primary leading-tight truncate">
              {headerTitle || noSelectionTitle}
            </h2>
            {showOnlineStatus && isSelected && headerTitle ? (
              <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                Online
              </span>
            ) : headerSubtitle ? (
              <p className="text-xs text-ink-muted truncate">
                {headerSubtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {isSelected && (
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen((p) => !p);
                setSearchQuery("");
              }}
              className={`p-2 rounded-lg transition-colors ${isSearchOpen ? "bg-surface-muted text-secondary" : "hover:bg-surface-muted text-ink-muted"}`}
              title="Search messages"
            >
              <Search size={15} />
            </button>
          )}
          {headerRight ??
            (isSelected && (
              <button className="p-2 hover:bg-surface-muted rounded-lg transition-colors">
                <MoreHorizontal size={15} className="text-ink-muted" />
              </button>
            ))}
        </div>
      </div>

      {/* Search bar */}
      {isSearchOpen && (
        <div className="flex-shrink-0 px-5 py-2 border-b border-line flex items-center gap-2 bg-surface-muted">
          <Search size={13} className="text-ink-muted flex-shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent text-primary placeholder-ink-muted"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-ink-muted hover:text-ink-muted"
            >
              <X size={13} />
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex-shrink-0 bg-red-50 border-b border-red-100 px-5 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Messages — only scrolling region */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto py-2"
      >
        {!isSelected ? (
          <div className="flex flex-col items-center justify-center h-full text-ink-muted gap-3 px-8 text-center">
            <MessageSquare size={44} className="text-ink-muted" />
            <p className="font-medium text-sm">{noSelectionTitle}</p>
            {noSelectionSubtitle && (
              <p className="text-xs">{noSelectionSubtitle}</p>
            )}
          </div>
        ) : isLoading ? (
          <div className="space-y-4 py-4">
            <MessageSkeleton />
            <MessageSkeleton reverse />
            <MessageSkeleton />
            <MessageSkeleton reverse />
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-ink-muted text-sm gap-2">
            {emptyIcon ?? (
              <MessageSquare size={36} className="text-ink-muted" />
            )}
            <p className="font-medium">{emptyTitle}</p>
            {emptySubtitle && <p className="text-xs">{emptySubtitle}</p>}
          </div>
        ) : (
          <>
            {displayed.map((msg, index) => {
              const showDateSep =
                index === 0 ||
                !isSameDay(displayed[index - 1].timestamp, msg.timestamp);
              const showAv = shouldShowAvatar(displayed, index);
              const grpStart = isGroupStart(displayed, index);
              return (
                <React.Fragment key={msg.id}>
                  {showDateSep && (
                    <DateSeparator
                      label={getDateSeparatorLabel(msg.timestamp)}
                    />
                  )}
                  <MessageBubble
                    msg={msg}
                    isMe={msg.senderId === currentUserId}
                    showAvatar={showAv}
                    isGroupStart={grpStart}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReply={onReply}
                    onScrollToMessage={onScrollToMessage ?? scrollToMsg}
                    use24h={use24h}
                  />
                </React.Fragment>
              );
            })}
            {ENABLE_TYPING_INDICATOR && <TypingIndicator name="Someone" />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll-to-bottom */}
      {showScrollBtn && isSelected && (
        <div className="flex-shrink-0 flex justify-end px-4 py-1">
          <ScrollToBottomButton onClick={scrollToBottom} />
        </div>
      )}

      {/* Input */}
      {isSelected && (
        <div className="flex-shrink-0 relative">
          <MessageInput
            placeholder={inputPlaceholder ?? `Message ${headerTitle}...`}
            isSending={isSending}
            replyTarget={replyTarget}
            onCancelReply={onCancelReply}
            onSend={onSend}
            currentUserImage={currentUserImage}
            currentUserName={currentUserName}
          />
        </div>
      )}
    </div>
  );
};

export default ChatShell;
