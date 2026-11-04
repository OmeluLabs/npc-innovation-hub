// src/components/members/PersonCard.tsx
//
// One card for every person on the Members page. The tier only changes how
// much presence the card has (size, photo, type), never its structure, so the
// page reads as a clear hierarchy while staying visually consistent:
//   founder  - largest: big photo, large name
//   leader   - medium
//   member   - compact

import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";
import type { PublicMemberContacts } from "../../api/member/member.api";

export type PersonCardVariant = "founder" | "leader" | "member";

interface PersonCardProps {
  name: string;
  /** Title or specialization shown under the name. */
  role?: string;
  imageUrl?: string;
  contacts?: PublicMemberContacts;
  variant: PersonCardVariant;
  onSelect?: () => void;
}

const VARIANTS: Record<
  PersonCardVariant,
  { photo: string; name: string; padding: string; ring: string }
> = {
  founder: {
    photo: "w-36 h-36 sm:w-44 sm:h-44",
    name: "text-xl sm:text-2xl",
    padding: "p-8",
    ring: "ring-4 ring-accent",
  },
  leader: {
    photo: "w-28 h-28 sm:w-32 sm:h-32",
    name: "text-lg sm:text-xl",
    padding: "p-6",
    ring: "ring-2 ring-accent",
  },
  member: {
    photo: "w-20 h-20 sm:w-24 sm:h-24",
    name: "text-base",
    padding: "p-5",
    ring: "ring-2 ring-line",
  },
};

const initials = (name: string): string =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const SOCIALS = [
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "github", label: "GitHub", Icon: Github },
  { key: "twitter", label: "Twitter", Icon: Twitter },
] as const;

const PersonCard: React.FC<PersonCardProps> = ({
  name,
  role,
  imageUrl,
  contacts,
  variant,
  onSelect,
}) => {
  const v = VARIANTS[variant];
  const socials = SOCIALS.filter(({ key }) => Boolean(contacts?.[key]));

  return (
    <article
      className={`flex flex-col items-center text-center h-full bg-white rounded-2xl border border-line shadow-soft transition-shadow duration-200 hover:shadow-medium ${v.padding} ${
        variant === "founder" ? "border-t-4 border-t-secondary" : ""
      }`}
    >
      <div
        className={`${v.photo} ${v.ring} rounded-full overflow-hidden bg-surface-muted flex items-center justify-center shrink-0`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Portrait of ${name}`}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span
            aria-hidden="true"
            className="text-2xl font-bold text-secondary"
          >
            {initials(name)}
          </span>
        )}
      </div>

      <h3 className={`mt-4 font-bold ${v.name}`}>
        {onSelect ? (
          <button
            type="button"
            onClick={onSelect}
            className="hover:text-secondary focus:outline-none focus-visible:underline"
          >
            {name}
          </button>
        ) : (
          name
        )}
      </h3>
      {role && <p className="mt-1 text-sm text-ink-muted">{role}</p>}

      {socials.length > 0 && (
        <ul className="mt-4 flex items-center gap-3">
          {socials.map(({ key, label, Icon }) => (
            <li key={key}>
              <a
                href={contacts?.[key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on ${label}`}
                className="inline-flex p-2 rounded-full text-secondary transition-colors duration-200 hover:bg-surface-muted hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};

export default PersonCard;
