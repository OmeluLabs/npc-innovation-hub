// // src/components/chat/NewConversationModal.tsx

// import React, { useState, useEffect, useCallback } from "react";
// import { X, Search, Loader2 } from "lucide-react";
// import apiClient from "../../api/client";

// interface NewConversationModalProps {
//   currentUserId: string;
//   onSelect: (member: MemberItem) => void;
//   onClose: () => void;
// }

// export interface MemberItem {
//   id: string;
//   name: string;
//   role: string;
//   imageUrl: string | null;
// }

// // ── Avatar that generates initials from a full name string ────────────────────
// const MemberAvatar: React.FC<{ name: string; imageUrl: string | null }> = ({
//   name,
//   imageUrl,
// }) => {
//   const [imgFailed, setImgFailed] = useState(false);

//   // Generate initials from any name format e.g. "Alain shema" → "AS"
//   const initials = name
//     .trim()
//     .split(/\s+/)
//     .filter(Boolean)
//     .map((w) => w[0].toUpperCase())
//     .slice(0, 2)
//     .join("");

//   // Only treat as valid image if it starts with http or / and image hasn't errored
//   const hasValidImage =
//     !imgFailed &&
//     imageUrl &&
//     (imageUrl.startsWith("http") || imageUrl.startsWith("/"));

//   return (
//     <div className="relative w-10 h-10 flex-shrink-0">
//       {hasValidImage ? (
//         <img
//           src={imageUrl!}
//           alt={name}
//           className="w-10 h-10 rounded-full object-cover"
//           onError={() => setImgFailed(true)}
//         />
//       ) : (
//         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm select-none">
//           {initials || "?"}
//         </div>
//       )}
//     </div>
//   );
// };

// // ── Parse /api/members response ───────────────────────────────────────────────
// const str = (v: unknown): string =>
//   typeof v === "string" ? v : v == null ? "" : String(v);

// const parseMembersResponse = (data: unknown): MemberItem[] => {
//   const toItem = (raw: unknown): MemberItem | null => {
//     const r = (raw ?? {}) as Record<string, unknown>;
//     // userId is the actual user ID used for DM routing
//     const id = str(r.userId ?? r.id);
//     if (!id) return null;
//     const name =
//       str(r.name) ||
//       `${str(r.firstName)} ${str(r.lastName)}`.trim() ||
//       "Unknown";
//     const imageUrl =
//       typeof r.imageUrl === "string" && r.imageUrl
//         ? r.imageUrl
//         : typeof r.image === "string" && r.image
//           ? r.image
//           : null;
//     return { id, name, role: str(r.role || "Member"), imageUrl };
//   };

//   const tryArr = (arr: unknown): MemberItem[] | null => {
//     if (!Array.isArray(arr) || arr.length === 0) return null;
//     const items = arr.map(toItem).filter((x): x is MemberItem => x !== null);
//     return items.length > 0 ? items : null;
//   };

//   // Direct array
//   if (Array.isArray(data)) return tryArr(data) ?? [];

//   const d = (data ?? {}) as Record<string, unknown>;

//   // { data: { members: [] } }  ← actual shape from your backend
//   if (d.data && typeof d.data === "object" && !Array.isArray(d.data)) {
//     const inner = d.data as Record<string, unknown>;
//     const result =
//       tryArr(inner.members) ??
//       tryArr(inner.users) ??
//       tryArr(inner.data) ??
//       // last resort: values of whatever is inside data
//       null;
//     if (result) return result;
//   }

//   if (Array.isArray(d.data)) return tryArr(d.data) ?? [];
//   return tryArr(d.members) ?? tryArr(d.users) ?? [];
// };

// // ── Fetch ─────────────────────────────────────────────────────────────────────

// const fetchMembers = async (currentUserId: string): Promise<MemberItem[]> => {
//   const res = await apiClient.get("/api/members");
//   // Debug: log raw response to confirm data arrives
//   console.log("[NewConversationModal] /api/members raw:", res.data);
//   const members = parseMembersResponse(res.data);
//   console.log("[NewConversationModal] parsed members:", members);
//   return members.filter((m) => m.id !== currentUserId);
// };

// // ── Component ─────────────────────────────────────────────────────────────────

// const NewConversationModal: React.FC<NewConversationModalProps> = ({
//   currentUserId,
//   onSelect,
//   onClose,
// }) => {
//   const [members, setMembers] = useState<MemberItem[]>([]);
//   const [search, setSearch] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const result = await fetchMembers(currentUserId);
//       setMembers(result);
//     } catch (err) {
//       console.error("[NewConversationModal] fetch failed:", err);
//       setError("Could not load members. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentUserId]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", handler);
//     return () => document.removeEventListener("keydown", handler);
//   }, [onClose]);

//   const filtered = members.filter((m) =>
//     m.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-3 sm:mx-4 max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-line">
//           <h3 className="text-base font-bold text-primary">New Message</h3>
//           <button
//             onClick={onClose}
//             className="p-1.5 hover:bg-surface-muted rounded-lg transition-colors"
//           >
//             <X size={16} className="text-ink-muted" />
//           </button>
//         </div>

//         {/* Search */}
//         <div className="px-5 py-3 border-b border-line">
//           <div className="relative">
//             <Search
//               size={15}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
//             />
//             <input
//               autoFocus
//               type="text"
//               placeholder="Search by name..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-9 pr-4 py-2 bg-surface-muted border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
//             />
//           </div>
//         </div>

//         {/* List */}
//         <div className="flex-1 min-h-0 overflow-y-auto sm:max-h-80">
//           {isLoading ? (
//             <div className="flex items-center justify-center py-10">
//               <Loader2 size={20} className="animate-spin text-ink-muted" />
//             </div>
//           ) : error ? (
//             <p className="text-center text-sm text-red-500 py-8 px-5">
//               {error}
//             </p>
//           ) : filtered.length === 0 ? (
//             <p className="text-center text-sm text-ink-muted py-8">
//               {search ? "No members match your search." : "No members found."}
//             </p>
//           ) : (
//             <ul className="py-2">
//               {filtered.map((m) => {
//                 const isAdmin = m.role.toLowerCase() === "admin";
//                 return (
//                   <li key={m.id}>
//                     <button
//                       type="button"
//                       onClick={() => onSelect(m)}
//                       className="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface-muted transition-colors text-left"
//                     >
//                       <MemberAvatar name={m.name} imageUrl={m.imageUrl} />
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2">
//                           <span className="font-medium text-primary text-sm truncate">
//                             {m.name}
//                           </span>
//                           {isAdmin && (
//                             <span className="text-xs bg-surface-muted text-primary px-1.5 py-0.5 rounded font-medium flex-shrink-0">
//                               Admin
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewConversationModal;

// src/components/chat/NewConversationModal.tsx
//
// Uses /api/members (works for all users).
// If the current user is an Admin, also fetches /api/users/users to include
// admin accounts that are not in the members table.

import React, { useState, useEffect, useCallback } from "react";
import { X, Search, Loader2 } from "lucide-react";
import apiClient from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types/user.types";

export interface MemberItem {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

interface NewConversationModalProps {
  currentUserId: string;
  onSelect: (member: MemberItem) => void;
  onClose: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const str = (v: unknown): string =>
  typeof v === "string" ? v : v == null ? "" : String(v);

const PALETTE = [
  "bg-secondary",
  "bg-secondary",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-orange-500",
  "bg-secondary",
  "bg-secondary",
  "bg-secondary",
  "bg-secondary",
  "bg-amber-600",
];

const colorFor = (id: string): string => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
};

const makeInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ── Parse /api/members response ───────────────────────────────────────────────
// Shape: { status, results, data: { members: [ { id, userId, name, role, imageUrl } ] } }

const parseMembersEndpoint = (data: unknown): MemberItem[] => {
  const toItem = (raw: unknown): MemberItem | null => {
    const r = (raw ?? {}) as Record<string, unknown>;
    const id = str(r.userId ?? r.id);
    if (!id) return null;
    const name =
      str(r.name) ||
      `${str(r.firstName)} ${str(r.lastName)}`.trim() ||
      "Unknown";
    return {
      id,
      name,
      role: str(r.role || "Member"),
      initials: makeInitials(name),
      color: colorFor(id),
    };
  };

  const tryArr = (arr: unknown): MemberItem[] | null => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const items = arr.map(toItem).filter((x): x is MemberItem => x !== null);
    return items.length > 0 ? items : null;
  };

  if (Array.isArray(data)) return tryArr(data) ?? [];
  const d = (data ?? {}) as Record<string, unknown>;

  if (d.data && typeof d.data === "object" && !Array.isArray(d.data)) {
    const inner = d.data as Record<string, unknown>;
    for (const key of ["members", "users", "data"]) {
      const r = tryArr(inner[key]);
      if (r) return r;
    }
  }
  if (Array.isArray(d.data)) return tryArr(d.data) ?? [];
  for (const key of ["members", "users", "data"]) {
    const r = tryArr(d[key]);
    if (r) return r;
  }
  return [];
};

// ── Parse /api/users/users response (admin only) ──────────────────────────────
// Shape: { status, results, data: { users: [ { id, firstName, lastName, email, role } ] } }

const parseUsersEndpoint = (data: unknown): MemberItem[] => {
  const toItem = (raw: unknown): MemberItem | null => {
    const r = (raw ?? {}) as Record<string, unknown>;
    const id = str(r.id ?? r._id);
    if (!id) return null;
    const name =
      `${str(r.firstName)} ${str(r.lastName)}`.trim() ||
      str(r.name) ||
      str(r.email).split("@")[0] ||
      "Unknown";
    return {
      id,
      name,
      role: str(r.role || "Member"),
      initials: makeInitials(name),
      color: colorFor(id),
    };
  };

  const tryArr = (arr: unknown): MemberItem[] | null => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const items = arr.map(toItem).filter((x): x is MemberItem => x !== null);
    return items.length > 0 ? items : null;
  };

  if (Array.isArray(data)) return tryArr(data) ?? [];
  const d = (data ?? {}) as Record<string, unknown>;

  if (d.data && typeof d.data === "object" && !Array.isArray(d.data)) {
    const inner = d.data as Record<string, unknown>;
    for (const key of ["users", "members", "data"]) {
      const r = tryArr(inner[key]);
      if (r) return r;
    }
  }
  if (Array.isArray(d.data)) return tryArr(d.data) ?? [];
  for (const key of ["users", "members"]) {
    const r = tryArr(d[key]);
    if (r) return r;
  }
  return [];
};

// ── Merge + deduplicate (Admin records win over Member records) ───────────────

const mergeDedupe = (...lists: MemberItem[][]): MemberItem[] => {
  const map = new Map<string, MemberItem>();
  for (const list of lists) {
    for (const item of list) {
      const existing = map.get(item.id);
      // If record already exists, keep the one with Admin role
      if (!existing || item.role.toLowerCase() === "admin") {
        map.set(item.id, item);
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => {
    const aA = a.role.toLowerCase() === "admin" ? 0 : 1;
    const bA = b.role.toLowerCase() === "admin" ? 0 : 1;
    if (aA !== bA) return aA - bA;
    return a.name.localeCompare(b.name);
  });
};

// ── InitialsAvatar ────────────────────────────────────────────────────────────

const InitialsAvatar: React.FC<{ initials: string; color: string }> = ({
  initials,
  color,
}) => (
  <div
    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${color} select-none`}
  >
    {initials}
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  currentUserId,
  onSelect,
  onClose,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [members, setMembers] = useState<MemberItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const lists: MemberItem[][] = [];

      // 1. Always fetch /api/members (works for everyone)
      try {
        const res = await apiClient.get("/api/members");
        const items = parseMembersEndpoint(res.data);
        if (items.length > 0) lists.push(items);
      } catch (e) {
        console.warn("[Modal] /api/members failed:", e);
      }

      // 2. If admin, also fetch /api/users/users to get admin accounts
      if (isAdmin) {
        try {
          const res = await apiClient.get("/api/users/users");
          const items = parseUsersEndpoint(res.data);
          if (items.length > 0) lists.push(items);
        } catch {
          // Non-admin gets 403 here — silently ignore
        }
      }

      const merged = mergeDedupe(...lists).filter(
        (m) => m.id !== currentUserId,
      );
      setMembers(merged);
    } catch (err) {
      console.error("[Modal] fetch failed:", err);
      setError("Could not load members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-3 sm:mx-4 max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <div>
            <h3 className="text-base font-bold text-primary">New Message</h3>
            <p className="text-xs text-ink-muted mt-0.5">
              {isLoading
                ? "Loading…"
                : `${members.length} member${members.length !== 1 ? "s" : ""} available`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-muted rounded-lg transition-colors"
          >
            <X size={16} className="text-ink-muted" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-line">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              autoFocus
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-muted border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 min-h-0 overflow-y-auto sm:max-h-80">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Loader2 size={20} className="animate-spin text-ink-muted" />
              <p className="text-xs text-ink-muted">Loading members…</p>
            </div>
          ) : error ? (
            <p className="text-center text-sm text-red-500 py-8 px-5">
              {error}
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-ink-muted py-8">
              {search ? "No members match your search." : "No members found."}
            </p>
          ) : (
            <ul className="py-2">
              {filtered.map((m) => {
                const isAdminMember = m.role.toLowerCase() === "admin";
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(m)}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface-muted transition-colors text-left"
                    >
                      <InitialsAvatar initials={m.initials} color={m.color} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary text-sm truncate">
                            {m.name}
                          </span>
                          {isAdminMember && (
                            <span className="text-xs bg-surface-muted text-primary px-1.5 py-0.5 rounded-md font-semibold flex-shrink-0">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ink-muted capitalize">
                          {m.role}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;
