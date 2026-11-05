// src/components/profile/ProfileHeader.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, CheckCircle } from "lucide-react";
import type { UserProfile } from "../../types/profile.types";
import type { Member } from "../../types/member.types";

interface ProfileHeaderProps {
  profile: UserProfile;
  member: Member | null;
  completionPct: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  member,
  completionPct,
}) => {
  const navigate = useNavigate();
  const initials =
    `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();
  const displayName =
    member?.name ?? `${profile.firstName} ${profile.lastName}`.trim();
  const roleLabel = member?.role ?? profile.role;

  return (
    <div className="relative">
      {/* Gradient banner */}
      <div className="h-32 sm:h-44 bg-gradient-to-r from-primary via-secondary to-primary rounded-t-2xl" />

      {/* Avatar row */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
          {/* Left: avatar + name. Stacks on the narrowest screens,
              where a 112px avatar beside a name leaves the name ~180px. */}
          <div className="flex flex-col xs:flex-row xs:items-end gap-3 xs:gap-4 min-w-0">
            <div className="relative shrink-0">
              {member?.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={displayName}
                  loading="lazy"
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-secondary
                                to-secondary border-4 border-white shadow-lg
                                flex items-center justify-center text-white text-2xl sm:text-3xl font-bold"
                >
                  {initials}
                </div>
              )}
              {profile.verified && (
                <span
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full
                                  flex items-center justify-center shadow"
                >
                  <CheckCircle size={18} className="text-secondary" />
                </span>
              )}
            </div>

            <div className="mb-1">
              <h1 className="text-xl font-bold text-primary">{displayName}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-sm font-semibold text-secondary bg-surface-muted
                                  px-2.5 py-0.5 rounded-full"
                >
                  {roleLabel}
                </span>
                <span className="text-xs text-ink-muted">{profile.email}</span>
              </div>
            </div>
          </div>

          {/* Right: completion + edit */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 flex-shrink-0">
            {/* Completion pill */}
            <div
              className="flex items-center gap-2 bg-white border border-line
                             rounded-xl px-3 py-2 shadow-sm"
            >
              <div className="w-16 bg-surface-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-secondary to-secondary
                               transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-ink-muted">
                {completionPct}% complete
              </span>
            </div>

            <button
              onClick={() => navigate("/dashboard/edit-profile")}
              className="flex items-center gap-1.5 bg-secondary hover:bg-primary
                         text-white px-4 py-2 rounded-xl text-sm font-semibold
                         transition-colors duration-200 shadow-sm"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
