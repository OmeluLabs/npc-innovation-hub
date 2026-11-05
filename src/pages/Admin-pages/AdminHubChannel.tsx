// src/pages/Admin-pages/AdminHubChannel.tsx

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Hash, Users, ShieldCheck } from "lucide-react";
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
import AdminChatLeftPanel from "../../components/chat/AdminChatLeftPanel";

// ── Adapter ───────────────────────────────────────────────────────────────────

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
  replyTo: getReplyTo(msg.id),
  sender: {
    id: msg.sender.id,
    firstName: msg.sender.firstName,
    lastName: msg.sender.lastName,
    image: msg.sender.image,
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

const AdminHubChannel: React.FC = () => {
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

  // Prefix unused params with _ to satisfy TS6133
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
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
        <Hash size={20} className="text-white" />
      </div>
      <span className="hidden sm:flex items-center gap-1 text-xs text-secondary bg-surface-muted border border-accent px-2 py-1 rounded-lg font-medium">
        <ShieldCheck size={11} />
        Moderator
      </span>
    </div>
  );

  const headerRight = (
    <div className="flex items-center gap-1.5 text-xs text-ink-muted bg-surface-muted px-2.5 py-1.5 rounded-lg">
      <Users size={12} />
      <span>{participantCount} active</span>
    </div>
  );

  // Same as member HubChannel.tsx: below md this is always the "chat"
  // pane, list panel hidden, back chevron returns to the message list.
  return (
    <div className="flex gap-4 h-full min-h-0">
      <div className="hidden md:block md:flex-shrink-0">
        <AdminChatLeftPanel basePath="/admin" />
      </div>
      <div className="flex-1 min-w-0 min-h-0">
        <ChatShell
          onBack={() => navigate("/admin/messages")}
          headerTitle="Hub Channel"
          headerSubtitle="Admin moderation view"
          headerIcon={hubIcon}
          headerRight={headerRight}
          messages={bubbles}
          currentUserId={user?.id ?? ""}
          isLoading={isLoading}
          error={error}
          isSending={isSending}
          currentUserImage={user?.image ?? null}
          currentUserName={
            user ? `${user.firstName} ${user.lastName}`.trim() : "Admin"
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

export default AdminHubChannel;
