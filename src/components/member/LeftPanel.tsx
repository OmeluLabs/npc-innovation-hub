// // src/components/member/LeftPanel.tsx

// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Hash, Search, Plus, MoreVertical } from "lucide-react";
// import { useConversations } from "../../hooks/useDirectMessages";
// import { useAuth } from "../../hooks/useAuth";
// import NewConversationModal from "../chat/NewConversationModal";
// import type { MemberItem } from "../chat/NewConversationModal";
// import ChatAvatar from "../chat/ChatAvatar";

// // onSelect passes both userId AND the display name so Messages.tsx header
// // can show the correct name before any messages have loaded.
// export interface LeftPanelProps {
//   selectedUserId?: string | null;
//   onSelect?: (userId: string, memberName: string) => void;
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────

// const formatTime = (iso: string): string => {
//   if (!iso) return "";
//   try {
//     const date = new Date(iso);
//     if (isNaN(date.getTime())) return iso;
//     const diffMs = Date.now() - date.getTime();
//     const diffMin = Math.floor(diffMs / 60_000);
//     if (diffMin < 1) return "now";
//     if (diffMin < 60) return `${diffMin}m`;
//     if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h`;
//     return date.toLocaleDateString([], { month: "short", day: "numeric" });
//   } catch {
//     return "";
//   }
// };

// const Skeleton: React.FC = () => (
//   <div className="flex items-center gap-3 px-3 py-3 animate-pulse">
//     <div className="w-11 h-11 rounded-full bg-line flex-shrink-0" />
//     <div className="flex-1 space-y-2">
//       <div className="h-3 bg-line rounded w-3/4" />
//       <div className="h-3 bg-line rounded w-1/2" />
//     </div>
//   </div>
// );

// // ── Main ──────────────────────────────────────────────────────────────────────

// const LeftPanel: React.FC<LeftPanelProps> = ({ selectedUserId, onSelect }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useAuth();
//   const [search, setSearch] = useState("");
//   const [showNewConvo, setShowNewConvo] = useState(false);

//   const { conversations, isLoading } = useConversations();
//   const isHub = location.pathname === "/hub-channel";

//   const filtered = conversations.filter((c) =>
//     `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()),
//   );

//   // Central navigation helper — always passes name alongside userId
//   const go = (userId: string, name: string) => {
//     if (onSelect) {
//       onSelect(userId, name);
//     } else {
//       navigate(`/messages/${userId}`);
//     }
//   };

//   const handleModalSelect = (member: MemberItem) => {
//     setShowNewConvo(false);
//     go(member.id, member.name);
//   };

//   return (
//     <>
//       {showNewConvo && user && (
//         <NewConversationModal
//           currentUserId={user.id}
//           onSelect={handleModalSelect}
//           onClose={() => setShowNewConvo(false)}
//         />
//       )}

//       <div className="bg-white rounded-2xl shadow-lg border border-line w-80 h-full flex flex-col">
//         {/* Header */}
//         <div className="p-5 border-b border-line">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="font-bold text-xl text-primary">Messages</h2>
//             <button
//               type="button"
//               onClick={() => setShowNewConvo(true)}
//               className="p-2 hover:bg-surface-muted rounded-lg transition-colors group"
//               title="New conversation"
//             >
//               <Plus
//                 size={18}
//                 className="text-ink-muted group-hover:text-secondary transition-colors"
//               />
//             </button>
//           </div>
//           <div className="relative">
//             <Search
//               size={15}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
//             />
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-9 pr-4 py-2 bg-surface-muted border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
//             />
//           </div>
//         </div>

//         {/* Hub Collaboration */}
//         <div className="px-5 py-4 border-b border-line">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="font-semibold text-ink-muted text-xs uppercase tracking-widest">
//               Hub Collaboration
//             </h3>
//             <MoreVertical size={14} className="text-ink-muted" />
//           </div>
//           <button
//             type="button"
//             onClick={() => navigate("/hub-channel")}
//             className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-left transition-all ${
//               isHub ? "bg-surface-muted border border-accent" : "hover:bg-surface-muted"
//             }`}
//           >
//             <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-xl flex-shrink-0">
//               <Hash size={18} className="text-white" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <div
//                 className={`font-semibold text-sm ${isHub ? "text-primary" : "text-primary"}`}
//               >
//                 Hub Channel
//               </div>
//               <div className="text-xs text-ink-muted">General discussions</div>
//             </div>
//             <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
//           </button>
//         </div>

//         {/* Direct Messages */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <div className="px-5 pt-4 pb-2 flex items-center justify-between">
//             <h3 className="font-semibold text-ink-muted text-xs uppercase tracking-widest">
//               Direct Messages
//             </h3>
//             <span className="text-xs text-ink-muted bg-surface-muted px-2 py-0.5 rounded-full">
//               {conversations.length}
//             </span>
//           </div>

//           <div className="flex-1 overflow-y-auto px-3 pb-4">
//             {isLoading ? (
//               <>
//                 <Skeleton />
//                 <Skeleton />
//                 <Skeleton />
//               </>
//             ) : filtered.length === 0 ? (
//               <div className="text-center py-8 px-4">
//                 <p className="text-sm text-ink-muted">
//                   {search
//                     ? "No conversations match your search."
//                     : "No conversations yet. Click + to start one."}
//                 </p>
//               </div>
//             ) : (
//               <ul className="space-y-0.5">
//                 {filtered.map((conv) => {
//                   const fullName =
//                     `${conv.firstName} ${conv.lastName}`.trim() || "Unknown";
//                   const isSelected = selectedUserId === conv.userId;
//                   const lastMsg =
//                     typeof conv.lastMessage === "string"
//                       ? conv.lastMessage
//                       : "";
//                   return (
//                     <li
//                       key={conv.userId}
//                       onClick={() => go(conv.userId, fullName)}
//                       className={`flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer transition-all ${
//                         isSelected
//                           ? "bg-surface-muted border border-accent"
//                           : "hover:bg-surface-muted"
//                       }`}
//                     >
//                       <ChatAvatar
//                         image={conv.image}
//                         name={fullName}
//                         size="lg"
//                         isOnline={conv.isOnline}
//                       />
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between mb-0.5">
//                           <span
//                             className={`font-semibold text-sm truncate ${isSelected ? "text-primary" : "text-primary"}`}
//                           >
//                             {fullName}
//                           </span>
//                           <span className="text-xs text-ink-muted ml-2 flex-shrink-0">
//                             {formatTime(conv.lastMessageTime)}
//                           </span>
//                         </div>
//                         <p className="text-xs text-ink-muted truncate">
//                           {lastMsg || "No messages yet"}
//                         </p>
//                       </div>
//                       {conv.unreadCount > 0 && (
//                         <span className="flex-shrink-0 bg-secondary text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 font-medium">
//                           {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
//                         </span>
//                       )}
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-4 border-t border-line">
//           <div className="flex items-center gap-2 text-xs text-ink-muted">
//             <span className="w-2 h-2 bg-green-500 rounded-full" />
//             <span>Online now</span>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LeftPanel;

// src/components/member/LeftPanel.tsx
//
// KEY FIX: The panel itself is h-full with overflow-hidden.
// Only the DM list div has overflow-y-auto — nothing else scrolls.
// This prevents the entire page from growing when messages/convos pile up.

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Hash, Search, Plus, MoreVertical } from "lucide-react";
import { useConversations } from "../../hooks/useDirectMessages";
import { useAuth } from "../../hooks/useAuth";
import NewConversationModal from "../chat/NewConversationModal";
import type { MemberItem } from "../chat/NewConversationModal";
import ChatAvatar from "../chat/ChatAvatar";

export interface LeftPanelProps {
  selectedUserId?: string | null;
  onSelect?: (userId: string, memberName: string) => void;
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
  <div className="flex items-center gap-3 px-3 py-3 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-line flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-line rounded w-3/4" />
      <div className="h-3 bg-line rounded w-1/2" />
    </div>
  </div>
);

const LeftPanel: React.FC<LeftPanelProps> = ({ selectedUserId, onSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showNewConvo, setShowNewConvo] = useState(false);

  const { conversations, isLoading } = useConversations();
  const isHub = location.pathname === "/hub-channel";

  const filtered = conversations.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );

  const go = (userId: string, name: string) => {
    if (onSelect) onSelect(userId, name);
    else navigate(`/messages/${userId}`);
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

      {/* h-full + overflow-hidden — never grows beyond its container.
          w-full below md: this panel is only ever shown alone below that
          breakpoint (Messages.tsx/HubChannel.tsx hide it once a
          conversation is open), so it should fill the screen there
          rather than stay pinned at a desktop-only 320px. md, not lg -
          an 844px-wide landscape phone already has plenty of room for
          the list beside the chat pane, it's only portrait phones that
          need the single-pane treatment. */}
      <div className="bg-white rounded-2xl shadow-lg border border-line w-full md:w-80 h-full flex flex-col flex-shrink-0 overflow-hidden">
        {/* ── Header — always visible, never scrolls ──────────────────────── */}
        <div className="flex-shrink-0 p-5 border-b border-line">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl text-primary">Messages</h2>
            <button
              type="button"
              onClick={() => setShowNewConvo(true)}
              className="p-2 hover:bg-surface-muted rounded-lg transition-colors group"
              title="New conversation"
            >
              <Plus
                size={18}
                className="text-ink-muted group-hover:text-secondary transition-colors"
              />
            </button>
          </div>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-muted border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
            />
          </div>
        </div>

        {/* ── Hub Channel — always visible ─────────────────────────────────── */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-line">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-ink-muted text-xs uppercase tracking-widest">
              Hub Collaboration
            </h3>
            <MoreVertical size={14} className="text-ink-muted" />
          </div>
          <button
            type="button"
            onClick={() => navigate("/hub-channel")}
            className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-left transition-all ${
              isHub
                ? "bg-surface-muted border border-accent"
                : "hover:bg-surface-muted"
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-xl flex-shrink-0">
              <Hash size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold text-sm ${isHub ? "text-primary" : "text-primary"}`}
              >
                Hub Channel
              </p>
              <p className="text-xs text-ink-muted">General discussions</p>
            </div>
            <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
          </button>
        </div>

        {/* ── DM label — always visible ────────────────────────────────────── */}
        <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center justify-between">
          <h3 className="font-semibold text-ink-muted text-xs uppercase tracking-widest">
            Direct Messages
          </h3>
          <span className="text-xs text-ink-muted bg-surface-muted px-2 py-0.5 rounded-full">
            {conversations.length}
          </span>
        </div>

        {/* ── DM list — THE ONLY THING THAT SCROLLS ───────────────────────── */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-4">
          {isLoading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-ink-muted py-8 px-4">
              {search
                ? "No conversations match."
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
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-surface-muted border border-accent"
                        : "hover:bg-surface-muted"
                    }`}
                  >
                    <ChatAvatar
                      image={conv.image}
                      name={fullName}
                      size="lg"
                      isOnline={conv.isOnline}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className={`font-semibold text-sm truncate ${isSelected ? "text-primary" : "text-primary"}`}
                        >
                          {fullName}
                        </span>
                        <span className="text-xs text-ink-muted ml-2 flex-shrink-0">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted truncate">
                        {lastMsg || "No messages yet"}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 bg-secondary text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 font-medium">
                        {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 p-4 border-t border-line">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Online now</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftPanel;
