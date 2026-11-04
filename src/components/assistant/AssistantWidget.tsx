// src/components/assistant/AssistantWidget.tsx
//
// The NPC AI Assistant, as a standard floating chat widget - a launcher
// bubble fixed to the bottom-right corner that expands into a compact
// panel, the way Intercom/Crisp/most real site chat widgets work.
// Replaces the old /chat-with-us full page (Hub-info/Help.tsx), which
// forced a page navigation away from whatever the visitor was actually
// looking at just to ask a question. Mounted once inside Navbar.tsx, so
// it's present on every public page without needing its own route.
//
// Chat logic (message list, history building, error/retry, loading
// state) is carried over from that page essentially unchanged - only the
// presentation is new.
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Bot, Loader2, Send, User, X } from "lucide-react";
import {
  sendAssistantMessage,
  type AssistantChatTurn,
} from "../../api/assistant.api";

type Message = {
  id: number;
  text: string;
  sender: string;
  isError?: boolean;
  language?: string;
};

// Shown in the empty state before the first message - a real question a
// visitor can tap instead of typing, grounded in what the assistant can
// actually answer (see the backend's knowledgeRetrieval.service.ts).
const SUGGESTED_QUESTIONS = [
  "What is NPC Innovation Hub?",
  "What projects does NPC Innovation Hub work on?",
  "What is NPC's mission and vision?",
  "How can I contact NPC Innovation Hub?",
];

// Sent with every request so the assistant can follow a conversation -
// the backend independently caps this again server-side regardless of
// what's sent here (see AI_MAX_HISTORY_MESSAGES), so this is just keeping
// the request itself reasonably sized, not the only limit in place.
const MAX_LOCAL_HISTORY_TURNS = 8;

// Other components (Footer, ContactSection) that used to link straight
// to /chat-with-us now dispatch this instead, so "start a chat" opens
// the widget from wherever the visitor already is rather than navigating
// them away to a dedicated page that no longer exists. A plain DOM event
// rather than React context: the trigger points and this widget are
// siblings rendered from many different, per-route JSX trees (see
// AllRoutes.tsx), not nested under one shared provider.
export const OPEN_ASSISTANT_CHAT_EVENT = "open-assistant-chat";

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // The original text of the most recent failed send, so the Retry
  // button can resend exactly that rather than whatever's currently
  // typed in the input. Cleared on the next successful send.
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Assigned by the backend on the first successful reply, then reused
  // for every later turn in this session - purely a log-correlation id
  // server-side (no persisted conversation), not something this widget
  // ever reads the contents of.
  const conversationIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const openFromElsewhere = () => setIsOpen(true);
    window.addEventListener(OPEN_ASSISTANT_CHAT_EVENT, openFromElsewhere);
    return () =>
      window.removeEventListener(OPEN_ASSISTANT_CHAT_EVENT, openFromElsewhere);
  }, []);

  // Focus the input the moment the panel opens, and let Escape close it
  // again - a floating panel like this is effectively a lightweight
  // dialog, so it gets the same keyboard courtesy as one.
  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus();

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Close on a click outside the panel/launcher - same pattern already
  // used for the account dropdown in Navbar.tsx.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen]);

  useEffect(() => {
    // Runs on every mount too, and messages starts as [] - the guard
    // keeps an just-opened, still-empty panel from trying to scroll
    // anywhere.
    if (messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (textOverride?: string) => {
    const text = (textOverride ?? inputValue).trim();
    if (text === "") return;

    setLastFailedText(null);

    const newUserMessage = {
      id: messages.length + 1,
      text,
      sender: "user",
    };

    // Capped local history sent alongside this turn, built BEFORE
    // adding the new message (it represents everything prior to it).
    // The backend independently re-validates and re-truncates this - see
    // chatOrchestrator.service.ts - so this is just keeping the request
    // itself reasonably sized, not a security boundary.
    const history: AssistantChatTurn[] = messages
      .filter((m) => !m.isError)
      .slice(-MAX_LOCAL_HISTORY_TURNS)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendAssistantMessage({
        message: text,
        conversationId: conversationIdRef.current,
        history,
      });

      conversationIdRef.current = response.data.conversationId;

      const botMessage = {
        id: messages.length + 2,
        text: response.data.message,
        sender: "bot",
        language:
          response.data.language !== "auto"
            ? response.data.language
            : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error calling NPC AI Assistant:", err);

      // The backend already returns a specific, friendly message per
      // failure category (provider unavailable, rate-limited, network,
      // etc. - see assistant.controller.ts) - the shared apiClient's
      // response interceptor unwraps it onto err.message, so this is
      // real, distinct feedback rather than one hardcoded string for
      // every possible failure.
      const message =
        (err as { message?: string })?.message ||
        "Sorry, I couldn't process your request. Please try again.";

      const errorBotMessage = {
        id: messages.length + 2,
        text: message,
        sender: "bot",
        isError: true,
      };

      setMessages((prev) => [...prev, errorBotMessage]);
      setLastFailedText(text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Launcher - fixed bottom-right on every page (this component is
          mounted once, in Navbar.tsx). Toggles between a chat icon and a
          close icon, same as the panel header's own explicit close
          button below - "Minimize", not "Close", so the two controls
          have distinct accessible names despite doing the same thing. */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Minimize chat" : "Chat with NPC Innovation Hub"}
        aria-expanded={isOpen}
        aria-controls="assistant-chat-panel"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-secondary text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {isOpen ? (
          <X className="w-6 h-6" aria-hidden="true" />
        ) : (
          <svg
            className="w-7 h-7 animate-bounce"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path
              d="M8 24.5V27l3.5-2.5H22a6 6 0 0 0 6-6v-6a6 6 0 0 0-6-6H10a6 6 0 0 0-6 6v6a6 6 0 0 0 4 5.65Z"
              fill="white"
            />
            <circle cx="11" cy="15.5" r="1.5" className="fill-primary" />
            <circle cx="16" cy="15.5" r="1.5" className="fill-primary" />
            <circle cx="21" cy="15.5" r="1.5" className="fill-primary" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          id="assistant-chat-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Chat with NPC Innovation Hub"
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-140px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up origin-bottom-right"
        >
          {/* Header - the same NPC Innovation Hub emblem/brand used in
              Navbar.tsx, so the widget reads as the same brand rather
              than a bolted-on third-party tool. */}
          <div className="bg-primary text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <img
              src="/assets/images/npc-emblem.png"
              alt=""
              className="w-9 h-9 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">NPC Innovation Hub</p>
              <p className="text-white/70 text-xs truncate">
                Ask us anything - we usually reply instantly
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Message list. min-h-0 lets this flex child shrink below its
              content's natural height so this list's own overflow-y-auto
              is what scrolls, not the panel or the page. */}
          <div
            className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-3"
            aria-live="polite"
            aria-label="Conversation with the NPC Innovation Hub assistant"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 px-2 text-center">
                <Bot className="w-9 h-9 text-primary/40" aria-hidden="true" />
                <p className="text-sm">Send a message to start chatting!</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => void sendMessage(question)}
                      className="text-xs bg-surface-muted border border-gray-200 text-primary rounded-full px-3 py-1.5 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 w-full ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    {message.sender === "user" ? (
                      <User
                        className="w-3.5 h-3.5 text-white"
                        aria-hidden="true"
                      />
                    ) : (
                      <Bot
                        className="w-3.5 h-3.5 text-white"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  {message.sender === "user" ? (
                    <div className="bg-primary text-white rounded-2xl px-3.5 py-2 max-w-[78%] text-sm">
                      {message.text}
                    </div>
                  ) : (
                    <div
                      className={`${message.isError ? "bg-red-50 border-red-300" : "bg-surface-muted border-gray-200"} text-gray-700 rounded-2xl px-3.5 py-2 max-w-[78%] text-sm border`}
                    >
                      {message.text}
                      {message.language && message.language !== "en" && (
                        <div className="text-[10px] text-gray-500 mt-1.5">
                          Language detected: {message.language}
                        </div>
                      )}
                      {message.isError &&
                        lastFailedText &&
                        !isLoading &&
                        message.id === messages[messages.length - 1]?.id && (
                          <button
                            type="button"
                            onClick={() => void sendMessage(lastFailedText)}
                            className="text-xs font-semibold text-red-700 hover:underline mt-1.5"
                          >
                            Retry
                          </button>
                        )}
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-end gap-2 w-full">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                </div>
                <div className="bg-surface-muted text-gray-700 rounded-2xl px-3.5 py-2.5 border border-gray-200">
                  <div className="flex gap-1.5">
                    <div
                      className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="px-3 py-3 border-t border-gray-100 flex items-center gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              aria-label="Type your question for the NPC Innovation Hub assistant"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isLoading ? "Waiting for response..." : "Type your question..."
              }
              className="px-4 py-2.5 w-full border border-gray-300 rounded-full bg-white text-sm outline-none focus:border-primary text-gray-600"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={isLoading || inputValue.trim() === ""}
              aria-label="Send message"
              className={`w-10 h-10 flex-shrink-0 ${isLoading ? "bg-gray-400" : "bg-primary hover:bg-secondary"} rounded-full flex items-center justify-center transition-colors`}
            >
              {isLoading ? (
                <Loader2
                  className="w-4 h-4 text-white animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Send className="w-4 h-4 text-white" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
