// src/components/chat/ContactMessagesPanel.tsx
//
// The main-content panel for /admin/contact-messages - lives alongside
// AdminChatLeftPanel the same way ChatShell does for the live-chat pages,
// but this isn't a live conversation: it's a searchable/filterable list of
// public "Contact Us" form submissions with per-item review actions
// (mark reviewed/closed, reply by email, delete). Reuses ReplyModal as-is
// (already generic - just inquiryName/onSubmit/isLoading), the same
// component the Hire Us Requests admin page uses.
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Mail, Search, Trash2, CheckCircle2, XCircle } from "lucide-react";
import {
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  replyToContactMessage,
} from "../../api/admin/contact.api";
import type {
  ContactMessage,
  ContactMessageStatus,
} from "../../types/contact.types";
import { ReplyModal } from "../admin-components/ReplyModal";

const STATUS_STYLES: Record<ContactMessageStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Reviewed: "bg-surface-muted text-primary ring-1 ring-accent",
  Closed: "bg-surface-muted text-ink-muted ring-1 ring-line",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const ContactMessagesPanel: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ContactMessageStatus | "All"
  >("All");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<ContactMessage | null>(null);
  const [isReplying, setIsReplying] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getContactMessages();
      setMessages(result.data.contactMessages);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load contact messages";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filtered = messages.filter((m) => {
    const matchesStatus = statusFilter === "All" || m.status === statusFilter;
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      m.name.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.message.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const handleSetStatus = async (id: string, status: ContactMessageStatus) => {
    setBusyId(id);
    try {
      const result = await updateContactMessageStatus(id, status);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? result.data.contactMessage : m)),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update message",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm("Delete this contact message? This cannot be undone.")
    ) {
      return;
    }
    setBusyId(id);
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete message",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleReplySubmit = async (subject: string, replyMessage: string) => {
    if (!replyTarget) return;
    setIsReplying(true);
    try {
      const result = await replyToContactMessage(replyTarget.id, {
        subject,
        message: replyMessage,
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === replyTarget.id ? result.data.contactMessage : m,
        ),
      );
      toast.success("Reply sent");
      setReplyTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-line h-full flex flex-col overflow-hidden">
      {replyTarget && (
        <ReplyModal
          isOpen={!!replyTarget}
          onClose={() => setReplyTarget(null)}
          onSubmit={handleReplySubmit}
          isLoading={isReplying}
          inquiryName={`${replyTarget.name} (${replyTarget.email})`}
        />
      )}

      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-line flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Mail size={16} className="text-primary" />
          <h2 className="font-bold text-base text-primary">Contact Messages</h2>
          <span className="text-xs text-ink-muted bg-surface-muted px-1.5 py-0.5 rounded-full">
            {messages.length}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-surface-muted border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ContactMessageStatus | "All")
            }
            className="px-3 py-2 bg-surface-muted border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-surface-muted rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-red-600 text-center py-10">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Mail size={40} className="text-ink-muted mb-3" />
            <p className="text-sm text-ink-muted">
              {messages.length === 0
                ? "No contact messages yet."
                : "No messages match your search."}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((m) => {
              const isBusy = busyId === m.id;
              return (
                <li
                  key={m.id}
                  className="border border-line rounded-xl p-4 hover:border-line transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-primary truncate">
                        {m.name}
                      </p>
                      <p className="text-xs text-ink-muted truncate">
                        {m.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[m.status]}`}
                      >
                        {m.status}
                      </span>
                      <span className="text-[11px] text-ink-muted">
                        {formatDate(m.createdAt)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-ink-muted whitespace-pre-wrap mb-3">
                    {m.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyTarget(m)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-secondary disabled:opacity-50 transition-colors"
                    >
                      <Mail size={12} />
                      Reply
                    </button>
                    {m.status !== "Reviewed" && (
                      <button
                        type="button"
                        onClick={() => handleSetStatus(m.id, "Reviewed")}
                        disabled={isBusy}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-primary text-xs font-semibold hover:bg-surface-muted disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle2 size={12} />
                        Mark Reviewed
                      </button>
                    )}
                    {m.status !== "Closed" && (
                      <button
                        type="button"
                        onClick={() => handleSetStatus(m.id, "Closed")}
                        disabled={isBusy}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-primary text-xs font-semibold hover:bg-surface-muted disabled:opacity-50 transition-colors"
                      >
                        <XCircle size={12} />
                        Close
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id)}
                      disabled={isBusy}
                      className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ContactMessagesPanel;
