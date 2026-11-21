// src/components/members/LeadershipTiers.tsx
//
// The Members structure: Co-Founders, then Leaders, then Members, each tier
// with progressively less visual prominence. Nothing is hardcoded: an admin
// assigns each member's tier (and optional title and order) from the admin
// Leadership page, and this groups whatever the API returned. A tier with
// nobody in it is not rendered.

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type {
  LeadershipTier,
  PublicMemberSummary,
} from "../../api/member/member.api";
import EmptyState from "../layout/EmptyState";
import PersonCard from "./PersonCard";
import type { PersonCardVariant } from "./PersonCard";

interface TierConfig {
  tier: LeadershipTier;
  heading: string;
  blurb: string;
  variant: PersonCardVariant;
  grid: string;
}

const TIERS: TierConfig[] = [
  {
    tier: "Co-Founder",
    heading: "Co-Founders",
    blurb: "The people who started the Hub and set its direction.",
    variant: "founder",
    grid: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
  },
  {
    tier: "Leader",
    heading: "Leaders",
    blurb: "Leads who guide teams, projects and mentorship.",
    variant: "leader",
    grid: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
  },
  {
    tier: "Member",
    heading: "Members",
    blurb: "The developers and designers building with us.",
    variant: "member",
    grid: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4",
  },
];

const tierOf = (member: PublicMemberSummary): LeadershipTier =>
  member.leadershipTier ?? "Member";

interface LeadershipTiersProps {
  members: PublicMemberSummary[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

const LeadershipTiers: React.FC<LeadershipTiersProps> = ({
  members,
  loading,
  error,
  onRetry,
}) => {
  const navigate = useNavigate();

  const byTier = useMemo(() => {
    const groups = new Map<LeadershipTier, PublicMemberSummary[]>();
    for (const member of members) {
      const tier = tierOf(member);
      groups.set(tier, [...(groups.get(tier) ?? []), member]);
    }
    return groups;
  }, [members]);

  if (loading) {
    return (
      <div
        className="grid grid-cols-2 gap-6 md:grid-cols-4"
        aria-busy="true"
        aria-label="Loading members"
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-2xl border border-line bg-white"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="We could not load the team"
        message={error}
        action={
          onRetry ? (
            <button
              onClick={onRetry}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Try again
            </button>
          ) : undefined
        }
      />
    );
  }

  if (members.length === 0) {
    return (
      <EmptyState
        title="No members to show yet"
        message="Members appear here once they have joined the Hub."
      />
    );
  }

  return (
    <div className="space-y-16">
      {TIERS.map(({ tier, heading, blurb, variant, grid }) => {
        const people = byTier.get(tier) ?? [];
        if (people.length === 0) return null;
        return (
          <section key={tier} aria-labelledby={`tier-${variant}`}>
            <h3 id={`tier-${variant}`} className="text-2xl">
              {heading}
            </h3>
            <p className="mb-8 mt-2 text-ink-muted">{blurb}</p>
            <div className={`grid ${grid}`}>
              {people.map((member) => (
                <PersonCard
                  key={member.id}
                  variant={variant}
                  name={member.name}
                  role={member.leadershipTitle || member.role}
                  imageUrl={member.imageUrl}
                  contacts={member.contacts}
                  onSelect={() => navigate(`/members/${member.userId}`)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default LeadershipTiers;
