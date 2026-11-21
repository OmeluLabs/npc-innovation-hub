// src/pages/landing/HubMembersSection.tsx
//
// "Members" section of the landing page (id="members", the target of the
// navbar's Members link): the full leadership structure - Co-Founders,
// Leaders, then Members - shown in place, with no separate directory page.
// Who appears in which tier is set by an admin from the Leadership page.

import React, { useCallback, useEffect, useState } from "react";
import { getAllPublicMembers } from "../../api/member/member.api";
import type { PublicMemberSummary } from "../../api/member/member.api";
import Section from "../../components/layout/Section";
import LeadershipTiers from "../../components/members/LeadershipTiers";

const HubMembersSection: React.FC = () => {
  const [members, setMembers] = useState<PublicMemberSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMembers(await getAllPublicMembers());
    } catch (err) {
      console.error("Failed to fetch public members:", err);
      const apiErr = err as { message?: string };
      setError(apiErr.message ?? "Failed to load members.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Section
      id="members"
      label="Our Team Members"
      title="Meet the team"
      description="The co-founders, leaders and members of the NPC Innovation Hub, building software that makes a real-world impact."
      tone="muted"
    >
      <LeadershipTiers
        members={members}
        loading={loading}
        error={error}
        onRetry={() => void load()}
      />
    </Section>
  );
};

export default HubMembersSection;
