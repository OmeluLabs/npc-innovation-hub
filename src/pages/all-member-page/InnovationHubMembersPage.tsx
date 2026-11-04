// src/pages/all-member-page/InnovationHubMembersPage.tsx
//
// Public Members page, split into three tiers - Co-Founders, Leaders and
// Members - each with progressively less visual prominence. Nothing here is
// hardcoded: an admin assigns each member's tier (and optional title and
// order) from the admin dashboard's Leadership page, and this page groups
// whatever the API returns. A tier with nobody in it is simply not rendered.

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPublicMembers } from "../../api/member/member.api";
import type {
  LeadershipTier,
  PublicMemberSummary,
} from "../../api/member/member.api";
import PageHeader from "../../components/layout/PageHeader";
import EmptyState from "../../components/layout/EmptyState";
import PersonCard from "../../components/members/PersonCard";
import type { PersonCardVariant } from "../../components/members/PersonCard";

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

const SkeletonTier: React.FC = () => (
  <div
    className="grid grid-cols-2 md:grid-cols-4 gap-6"
    aria-busy="true"
    aria-label="Loading members"
  >
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="h-56 rounded-2xl bg-white border border-line animate-pulse"
      />
    ))}
  </div>
);

export const InnovationHubMembersPage: React.FC = () => {
  const [members, setMembers] = useState<PublicMemberSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAllPublicMembers();
        if (!cancelled) setMembers(result);
      } catch (err) {
        console.error("Failed to fetch public members:", err);
        const apiErr = err as { message?: string };
        if (!cancelled) setError(apiErr.message ?? "Failed to load members.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const byTier = useMemo(() => {
    const groups = new Map<LeadershipTier, PublicMemberSummary[]>();
    for (const member of members) {
      const tier = tierOf(member);
      groups.set(tier, [...(groups.get(tier) ?? []), member]);
    }
    return groups;
  }, [members]);

  return (
    <div className="bg-surface-muted min-h-screen">
      <PageHeader
        eyebrow="Our people"
        title="Meet the team"
        description="The co-founders, leaders and members of the NPC Innovation Hub, building software that makes a real-world impact."
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-16">
        {loading ? (
          <SkeletonTier />
        ) : error ? (
          <EmptyState
            title="We could not load the team"
            message={error}
            action={
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Try again
              </button>
            }
          />
        ) : members.length === 0 ? (
          <EmptyState
            title="No members to show yet"
            message="Members appear here once they have joined the Hub."
          />
        ) : (
          TIERS.map(({ tier, heading, blurb, variant, grid }) => {
            const people = byTier.get(tier) ?? [];
            if (people.length === 0) return null;
            return (
              <section key={tier} aria-labelledby={`tier-${variant}`}>
                <h2 id={`tier-${variant}`}>{heading}</h2>
                <p className="mt-2 mb-8 text-ink-muted">{blurb}</p>
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
          })
        )}
      </div>
    </div>
  );
};
