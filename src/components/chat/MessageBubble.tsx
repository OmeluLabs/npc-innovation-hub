// // src/components/chat/MessageBubble.tsx

// import React, { useState } from "react";
// import { Reply, Pencil, Trash2, Check, X, CornerUpLeft } from "lucide-react";
// import ChatAvatar from "./ChatAvatar";
// import { formatMessageTime, formatFullTimestamp } from "../../utils/chatUtils";

// export interface ReplyRef {
//   id: string;
//   senderName: string;
//   content: string;
// }

// export interface BubbleMessage {
//   id: string;
//   senderId: string;
//   content: string;
//   timestamp: string;
//   isRead?: boolean;
//   isDeleted?: boolean;
//   updatedAt?: string;
//   createdAt?: string;
//   replyTo?: ReplyRef | null;
//   sender: {
//     id: string;
//     firstName: string;
//     lastName: string;
//     image: string | null;
//   };
// }

// interface MessageBubbleProps {
//   msg: BubbleMessage;
//   isMe: boolean;
//   showAvatar: boolean;
//   isGroupStart: boolean;
//   editingId: string | null;
//   setEditingId: (id: string | null) => void;
//   onEdit: (id: string, content: string) => void;
//   onDelete: (id: string) => void;
//   onReply: (msg: BubbleMessage) => void;
//   use24h?: boolean;
// }

// // ── Delete Confirm ──────────────────────────────────────────────────────────

// const DeleteConfirm: React.FC<{
//   onConfirm: () => void;
//   onCancel: () => void;
// }> = ({ onConfirm, onCancel }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//     <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
//       <h3 className="text-base font-bold text-primary mb-2">Delete Message</h3>
//       <p className="text-sm text-ink-muted mb-5">
//         This action cannot be undone.
//       </p>
//       <div className="flex gap-3">
//         <button
//           onClick={onCancel}
//           className="flex-1 py-2 px-4 rounded-lg border border-line text-ink-muted hover:bg-surface-muted text-sm font-medium transition-colors"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={onConfirm}
//           className="flex-1 py-2 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm font-medium transition-colors"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // ── Main ────────────────────────────────────────────────────────────────────

// const MessageBubble: React.FC<MessageBubbleProps> = ({
//   msg,
//   isMe,
//   showAvatar,
//   isGroupStart,
//   editingId,
//   setEditingId,
//   onEdit,
//   onDelete,
//   onReply,
//   use24h = false,
// }) => {
//   const [hovered, setHovered] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [editText, setEditText] = useState(msg.content);
//   const [showTooltip, setShowTooltip] = useState(false);

//   const isEditing = editingId === msg.id;
//   const isTemp = msg.id.startsWith("temp-");
//   const isEdited =
//     msg.updatedAt && msg.createdAt && msg.updatedAt !== msg.createdAt;

//   const senderName = isMe
//     ? "You"
//     : `${msg.sender.firstName} ${msg.sender.lastName}`.trim() || "Unknown";

//   const handleSaveEdit = () => {
//     const trimmed = editText.trim();
//     if (trimmed && trimmed !== msg.content) {
//       onEdit(msg.id, trimmed);
//     } else {
//       setEditingId(null);
//     }
//   };

//   // ── Soft-deleted message ────────────────────────────────────────────────
//   if (msg.isDeleted) {
//     return (
//       <div
//         className={`flex ${isMe ? "justify-end" : "justify-start"} px-4 py-0.5`}
//       >
//         <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-surface-muted border border-dashed border-line">
//           <Trash2 size={11} className="text-ink-muted" />
//           <span className="text-xs text-ink-muted italic">
//             This message was deleted
//           </span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {showDeleteConfirm && (
//         <DeleteConfirm
//           onConfirm={() => {
//             onDelete(msg.id);
//             setShowDeleteConfirm(false);
//           }}
//           onCancel={() => setShowDeleteConfirm(false)}
//         />
//       )}

//       <div
//         className={`flex ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2 px-4 ${
//           isGroupStart ? "pt-3" : "pt-0.5"
//         } ${isTemp ? "opacity-60" : "opacity-100"} transition-opacity group`}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//       >
//         {/* Avatar — only show on group start or last in group */}
//         <div className="w-9 flex-shrink-0 flex items-end">
//           {showAvatar && !isMe ? (
//             <ChatAvatar image={msg.sender.image} name={senderName} size="sm" />
//           ) : null}
//         </div>

//         {/* Bubble column */}
//         <div
//           className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}
//         >
//           {/* Sender name (group start only, not me) */}
//           {isGroupStart && !isMe && (
//             <span className="text-xs font-semibold text-ink-muted mb-1 ml-1">
//               {senderName}
//             </span>
//           )}

//           {/* Reply reference */}
//           {msg.replyTo && (
//             <div
//               className={`flex items-start gap-1.5 mb-1 px-2 py-1.5 rounded-lg border-l-2 border-secondary bg-surface-muted text-xs max-w-full ${
//                 isMe ? "self-end" : "self-start"
//               }`}
//             >
//               <CornerUpLeft
//                 size={10}
//                 className="text-secondary mt-0.5 flex-shrink-0"
//               />
//               <div className="min-w-0">
//                 <p className="font-semibold text-secondary truncate">
//                   {msg.replyTo.senderName}
//                 </p>
//                 <p className="text-ink-muted truncate">{msg.replyTo.content}</p>
//               </div>
//             </div>
//           )}

//           {/* Edit mode */}
//           {isEditing ? (
//             <div className="flex flex-col gap-2 w-full min-w-[220px]">
//               <input
//                 autoFocus
//                 value={editText}
//                 onChange={(e) => setEditText(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault();
//                     handleSaveEdit();
//                   }
//                   if (e.key === "Escape") setEditingId(null);
//                 }}
//                 className="text-sm border border-secondary rounded-xl px-3 py-2 outline-none w-full"
//               />
//               <div className="flex gap-2">
//                 <button
//                   onClick={handleSaveEdit}
//                   className="flex items-center gap-1 text-xs bg-secondary text-white px-3 py-1 rounded-lg hover:bg-secondary transition-colors"
//                 >
//                   <Check size={10} /> Save
//                 </button>
//                 <button
//                   onClick={() => setEditingId(null)}
//                   className="flex items-center gap-1 text-xs bg-surface-muted text-ink-muted px-3 py-1 rounded-lg hover:bg-line transition-colors"
//                 >
//                   <X size={10} /> Cancel
//                 </button>
//               </div>
//             </div>
//           ) : (
//             /* Message bubble */
//             <div
//               className={`relative px-3 py-2 rounded-2xl text-sm leading-relaxed ${
//                 isMe
//                   ? "bg-primary text-white rounded-br-sm"
//                   : "bg-surface-muted text-primary rounded-bl-sm"
//               }`}
//             >
//               {msg.content}
//             </div>
//           )}

//           {/* Footer: time + edited + read receipt */}
//           {!isEditing && (
//             <div
//               className={`flex items-center gap-1 mt-0.5 ${isMe ? "flex-row-reverse" : ""}`}
//             >
//               <div className="relative">
//                 <button
//                   type="button"
//                   onMouseEnter={() => setShowTooltip(true)}
//                   onMouseLeave={() => setShowTooltip(false)}
//                   className="text-xs text-ink-muted hover:text-ink-muted transition-colors"
//                 >
//                   {formatMessageTime(msg.timestamp, use24h)}
//                 </button>
//                 {showTooltip && (
//                   <div className="absolute bottom-5 left-0 bg-primary text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-20 shadow-lg">
//                     {formatFullTimestamp(msg.timestamp)}
//                   </div>
//                 )}
//               </div>
//               {isEdited && (
//                 <span className="text-xs text-ink-muted italic">· edited</span>
//               )}
//               {isTemp && (
//                 <span className="text-xs text-ink-muted">· sending…</span>
//               )}
//               {/* Read receipt */}
//               {isMe && !isTemp && (
//                 <span className="text-xs">
//                   {msg.isRead ? (
//                     <span className="text-secondary">✓✓</span>
//                   ) : (
//                     <span className="text-ink-muted">✓</span>
//                   )}
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Hover action toolbar */}
//         {hovered && !isTemp && !isEditing && (
//           <div
//             className={`flex items-center gap-0.5 self-center bg-white rounded-lg shadow-md border border-line p-0.5 flex-shrink-0 ${
//               isMe ? "mr-1" : "ml-1"
//             }`}
//           >
//             <button
//               onClick={() => onReply(msg)}
//               className="p-1.5 hover:bg-surface-muted rounded-md transition-colors"
//               title="Reply"
//             >
//               <Reply size={13} className="text-ink-muted" />
//             </button>
//             {isMe && (
//               <button
//                 onClick={() => {
//                   setEditText(msg.content);
//                   setEditingId(msg.id);
//                 }}
//                 className="p-1.5 hover:bg-surface-muted rounded-md transition-colors"
//                 title="Edit"
//               >
//                 <Pencil size={13} className="text-ink-muted" />
//               </button>
//             )}
//             {isMe && (
//               <button
//                 onClick={() => setShowDeleteConfirm(true)}
//                 className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
//                 title="Delete"
//               >
//                 <Trash2 size={13} className="text-red-400" />
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default MessageBubble;

// src/components/chat/MessageBubble.tsx

import React, { useState } from "react";
import { Reply, Pencil, Trash2, Check, X, CornerUpLeft } from "lucide-react";
import ChatAvatar from "./ChatAvatar";
import { formatMessageTime, formatFullTimestamp } from "../../utils/chatUtils";

export interface ReplyRef {
  id: string;
  senderName: string;
  content: string;
}

export interface BubbleMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead?: boolean;
  isDeleted?: boolean;
  updatedAt?: string;
  createdAt?: string;
  replyTo?: ReplyRef | null;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
}

interface MessageBubbleProps {
  msg: BubbleMessage;
  isMe: boolean;
  showAvatar: boolean;
  isGroupStart: boolean;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onReply: (msg: BubbleMessage) => void;
  onScrollToMessage?: (id: string) => void;
  use24h?: boolean;
}

// ── Delete confirm ─────────────────────────────────────────────────────────────

const DeleteConfirm: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
      <h3 className="text-base font-bold text-primary mb-2">Delete Message</h3>
      <p className="text-sm text-ink-muted mb-5">
        This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2 px-4 rounded-lg border border-line text-ink-muted hover:bg-surface-muted text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────

const MessageBubble: React.FC<MessageBubbleProps> = ({
  msg,
  isMe,
  showAvatar,
  isGroupStart,
  editingId,
  setEditingId,
  onEdit,
  onDelete,
  onReply,
  onScrollToMessage,
  use24h = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editText, setEditText] = useState(msg.content);
  const [showTooltip, setShowTooltip] = useState(false);

  const isEditing = editingId === msg.id;
  const isTemp = msg.id.startsWith("temp-");
  const isEdited =
    msg.updatedAt && msg.createdAt && msg.updatedAt !== msg.createdAt;

  const senderName = isMe
    ? "You"
    : `${msg.sender.firstName} ${msg.sender.lastName}`.trim() || "Unknown";

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== msg.content) {
      onEdit(msg.id, trimmed);
    } else {
      setEditingId(null);
    }
  };

  // ── Soft-deleted ──────────────────────────────────────────────────────────
  if (msg.isDeleted) {
    return (
      <div
        className={`flex ${isMe ? "justify-end" : "justify-start"} px-4 py-0.5`}
      >
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-surface-muted border border-dashed border-line">
          <Trash2 size={11} className="text-ink-muted" />
          <span className="text-xs text-ink-muted italic">
            This message was deleted
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {showDeleteConfirm && (
        <DeleteConfirm
          onConfirm={() => {
            onDelete(msg.id);
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      <div
        id={`msg-${msg.id}`}
        className={`flex ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2 px-4 ${
          isGroupStart ? "pt-3" : "pt-0.5"
        } ${isTemp ? "opacity-60" : "opacity-100"} transition-opacity group`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Avatar */}
        <div className="w-9 flex-shrink-0 flex items-end">
          {showAvatar && !isMe && (
            <ChatAvatar image={msg.sender.image} name={senderName} size="sm" />
          )}
        </div>

        {/* Bubble column */}
        <div
          className={`flex flex-col min-w-0 max-w-[85%] sm:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}
        >
          {/* Sender name */}
          {isGroupStart && !isMe && (
            <span className="text-xs font-semibold text-ink-muted mb-1 ml-1">
              {senderName}
            </span>
          )}

          {/* ── Reply quote (persistent, clickable) ─────────────────────── */}
          {msg.replyTo && (
            <button
              type="button"
              onClick={() => onScrollToMessage?.(msg.replyTo!.id)}
              className={`flex items-start gap-1.5 mb-1 px-2 py-1.5 rounded-lg border-l-2 border-secondary bg-surface-muted hover:bg-surface-muted transition-colors text-xs max-w-full text-left cursor-pointer ${
                isMe ? "self-end" : "self-start"
              }`}
              title="Jump to original message"
            >
              <CornerUpLeft
                size={10}
                className="text-secondary mt-0.5 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-semibold text-secondary truncate">
                  {msg.replyTo.senderName}
                </p>
                <p className="text-ink-muted truncate">{msg.replyTo.content}</p>
              </div>
            </button>
          )}

          {/* Edit mode */}
          {isEditing ? (
            // min-w on a flex child forces its parent wider; lifted below
            // sm so editing cannot widen the thread past a phone screen.
            <div className="flex flex-col gap-2 w-full min-w-0 sm:min-w-[220px]">
              <input
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveEdit();
                  }
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="text-sm border border-secondary rounded-xl px-3 py-2 outline-none w-full"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 text-xs bg-secondary text-white px-3 py-1 rounded-lg hover:bg-secondary transition-colors"
                >
                  <Check size={10} /> Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="flex items-center gap-1 text-xs bg-surface-muted text-ink-muted px-3 py-1 rounded-lg hover:bg-line transition-colors"
                >
                  <X size={10} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Message bubble */
            <div
              className={`relative px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                isMe
                  ? "bg-primary text-white rounded-br-sm"
                  : "bg-surface-muted text-primary rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          )}

          {/* Footer: time + edited + read receipt */}
          {!isEditing && (
            <div
              className={`flex items-center gap-1 mt-0.5 ${isMe ? "flex-row-reverse" : ""}`}
            >
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="text-xs text-ink-muted hover:text-ink-muted transition-colors"
                >
                  {formatMessageTime(msg.timestamp, use24h)}
                </button>
                {showTooltip && (
                  <div className="absolute bottom-5 left-0 bg-primary text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-20 shadow-lg">
                    {formatFullTimestamp(msg.timestamp)}
                  </div>
                )}
              </div>
              {isEdited && (
                <span className="text-xs text-ink-muted italic">· edited</span>
              )}
              {isTemp && (
                <span className="text-xs text-ink-muted">· sending…</span>
              )}
              {isMe && !isTemp && (
                <span className="text-xs">
                  {msg.isRead ? (
                    <span className="text-secondary">✓✓</span>
                  ) : (
                    <span className="text-ink-muted">✓</span>
                  )}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Hover actions */}
        {hovered && !isTemp && !isEditing && (
          <div
            className={`flex items-center gap-0.5 self-center bg-white rounded-lg shadow-md border border-line p-0.5 flex-shrink-0 ${
              isMe ? "mr-1" : "ml-1"
            }`}
          >
            <button
              onClick={() => onReply(msg)}
              className="p-1.5 hover:bg-surface-muted rounded-md transition-colors"
              title="Reply"
            >
              <Reply size={13} className="text-ink-muted" />
            </button>
            {isMe && (
              <button
                onClick={() => {
                  setEditText(msg.content);
                  setEditingId(msg.id);
                }}
                className="p-1.5 hover:bg-surface-muted rounded-md transition-colors"
                title="Edit"
              >
                <Pencil size={13} className="text-ink-muted" />
              </button>
            )}
            {isMe && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                title="Delete"
              >
                <Trash2 size={13} className="text-red-400" />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MessageBubble;
