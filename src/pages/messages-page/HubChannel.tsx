// src/pages/messages-page/HubChannel.tsx

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Hash, Users } from "lucide-react";
import LeftPanel from "../../components/member/LeftPanel";
import { useHubMessages } from "../../hooks/useHubMessages";
import { useAuth } from "../../hooks/useAuth";
import type { HubMessage } from "../../types/chat.types";
import ChatShell from "../../components/chat/ChatShell";
import type {
  BubbleMessage,
  ReplyRef,
} from "../../components/chat/MessageBubble";
import type {
  ReplyTarget,
  AttachmentFile,
} from "../../components/chat/MessageInput";

// ── Adapter: replyTo is embedded per-message here, NOT passed to ChatShell ────

const toBubble = (
  msg: HubMessage,
  getReplyTo: (id: string) => ReplyRef | null,
): BubbleMessage => ({
  id: msg.id,
  senderId: msg.senderId,
  content: msg.content,
  timestamp: msg.timestamp,
  isRead: true,
  isDeleted: msg.isDeleted,
  updatedAt: msg.updatedAt,
  createdAt: msg.createdAt,
  replyTo: getReplyTo(msg.id), // embedded here — ChatShell doesn't need getReplyTo
  sender: {
    id: msg.sender.id,
    firstName: msg.sender.firstName,
    lastName: msg.sender.lastName,
    image: msg.sender.image,
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

export const HubChannel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);

  const {
    messages,
    isLoading,
    isSending,
    error,
    editingMessageId,
    messagesEndRef,
    sendMessage,
    editMessage,
    deleteMessage,
    setEditingMessageId,
    getReplyTo,
  } = useHubMessages();

  const handleSend = useCallback(
    async (
      content: string,
      _attachments: AttachmentFile[],
      _replyToId: string | null,
    ) => {
      if (!content.trim()) return;
      await sendMessage(
        content,
        replyTarget
          ? {
              id: replyTarget.id,
              senderName: replyTarget.senderName,
              content: replyTarget.content,
            }
          : null,
      );
      setReplyTarget(null);
    },
    [sendMessage, replyTarget],
  );

  const participantCount = new Set(messages.map((m) => m.senderId)).size;
  const bubbles: BubbleMessage[] = messages.map((m) => toBubble(m, getReplyTo));

  const hubIcon = (
    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
      <Hash size={20} className="text-white" />
    </div>
  );

  const headerRight = (
    <div className="flex items-center gap-1.5 text-xs text-ink-muted bg-surface-muted px-2.5 py-1.5 rounded-lg">
      <Users size={12} />
      <span>{participantCount} active</span>
    </div>
  );

  // Below md the Hub Channel is always the "chat" pane, never the list -
  // LeftPanel is where you'd navigate away from it (to a DM, or back to
  // the list), so it stays hidden here and the back chevron returns to
  // /messages, which shows the list. Above md both stay visible together.
  return (
    <div className="flex gap-4 h-full min-h-0">
      <div className="hidden md:block md:flex-shrink-0">
        <LeftPanel />
      </div>
      <div className="flex-1 min-w-0 min-h-0">
        <ChatShell
          onBack={() => navigate("/messages")}
          headerTitle="Hub Channel"
          headerSubtitle="General discussions and collaboration"
          headerIcon={hubIcon}
          headerRight={headerRight}
          messages={bubbles}
          currentUserId={user?.id ?? ""}
          isLoading={isLoading}
          error={error}
          isSending={isSending}
          currentUserImage={user?.image ?? null}
          currentUserName={
            user ? `${user.firstName} ${user.lastName}`.trim() : "Me"
          }
          inputPlaceholder="Type a message in #hub-channel..."
          replyTarget={replyTarget}
          onReply={(msg) => {
            setReplyTarget({
              id: msg.id,
              senderName:
                msg.senderId === user?.id
                  ? "You"
                  : `${msg.sender.firstName} ${msg.sender.lastName}`.trim(),
              content: msg.content,
            });
          }}
          onCancelReply={() => setReplyTarget(null)}
          onSend={handleSend}
          onEdit={editMessage}
          onDelete={deleteMessage}
          editingId={editingMessageId}
          setEditingId={setEditingMessageId}
          messagesEndRef={messagesEndRef}
          emptyTitle="No messages yet in #hub-channel"
          emptySubtitle="Be the first to say something!"
          emptyIcon={<Hash size={40} className="text-ink-muted" />}
        />
      </div>
    </div>
  );
};
