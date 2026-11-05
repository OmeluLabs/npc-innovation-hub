// src/components/profile/ProfileContacts.tsx

import React from "react";
import { ExternalLink, Link } from "lucide-react";
import type { Member } from "../../types/member.types";

interface ProfileContactsProps {
  member: Member | null;
}

const CONTACT_META: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  linkedin: {
    label: "LinkedIn",
    color: "text-primary",
    bg: "bg-surface-muted",
  },
  github: { label: "GitHub", color: "text-primary", bg: "bg-surface-muted" },
  twitter: {
    label: "Twitter/X",
    color: "text-secondary",
    bg: "bg-surface-muted",
  },
  instagram: {
    label: "Instagram",
    color: "text-secondary",
    bg: "bg-surface-muted",
  },
  portfolio: {
    label: "Portfolio",
    color: "text-secondary",
    bg: "bg-surface-muted",
  },
};

const ProfileContacts: React.FC<ProfileContactsProps> = ({ member }) => {
  const contacts = member?.contacts ?? {};
  const entries = Object.entries(contacts).filter(([, v]) => !!v);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-line p-6">
      <h3 className="text-sm font-bold text-primary mb-5">Contact Links</h3>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-ink-muted gap-2">
          <Link size={24} className="opacity-30" />
          <p className="text-sm">No contacts added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(([key, url]) => {
            const meta = CONTACT_META[key] ?? {
              label: key,
              color: "text-primary",
              bg: "bg-surface-muted",
            };
            return (
              <a
                key={key}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-muted
                           border border-line transition-colors group"
              >
                <div
                  className={`w-8 h-8 ${meta.bg} ${meta.color} rounded-lg
                                  flex items-center justify-center shrink-0 text-xs font-bold`}
                >
                  {meta.label.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-ink-muted">
                    {meta.label}
                  </div>
                  <div className="text-xs text-primary truncate">
                    {url as string}
                  </div>
                </div>
                <ExternalLink
                  size={13}
                  className="text-ink-muted group-hover:text-secondary shrink-0 transition-colors"
                />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileContacts;
