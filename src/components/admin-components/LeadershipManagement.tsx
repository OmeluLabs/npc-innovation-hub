// src/components/admin-components/LeadershipManagement.tsx
//
// Admin control for the public Members page: for each member, choose their
// tier (Co-Founder / Leader / Member), an optional display title, and an
// order within the tier. Saved per row; the public page picks changes up on
// its next load.

import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllPublicMembers } from "../../api/member/member.api";
import type {
  LeadershipTier,
  PublicMemberSummary,
} from "../../api/member/member.api";
import { updateMemberLeadership } from "../../api/admin/memberLeadership.api";

const TIERS: LeadershipTier[] = ["Co-Founder", "Leader", "Member"];

interface RowDraft {
  tier: LeadershipTier;
  title: string;
  order: number;
}

const toDraft = (m: PublicMemberSummary): RowDraft => ({
  tier: m.leadershipTier ?? "Member",
  title: m.leadershipTitle ?? "",
  order: m.displayOrder ?? 0,
});

const fieldClasses =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary";

const LeadershipManagement: React.FC = () => {
  const [members, setMembers] = useState<PublicMemberSummary[]>([]);
  const [drafts, setDrafts] = useState<Record<string, RowDraft>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const all = await getAllPublicMembers();
      // Rows with no member profile (id === userId) can't be assigned a tier.
      const withProfile = all.filter((m) => m.id !== m.userId);
      setMembers(withProfile);
      setDrafts(Object.fromEntries(withProfile.map((m) => [m.id, toDraft(m)])));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = (id: string, change: Partial<RowDraft>) =>
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...change } }));

  const save = async (member: PublicMemberSummary) => {
    const draft = drafts[member.id];
    setSaving(member.id);
    try {
      await updateMemberLeadership(member.id, {
        leadershipTier: draft.tier,
        leadershipTitle: draft.title.trim(),
        displayOrder: draft.order,
      });
      toast.success(`${member.name} saved as ${draft.tier}`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return <p className="text-ink-muted">Loading members...</p>;
  }
  if (error) {
    return (
      <p role="alert" className="text-red-700">
        {error}
      </p>
    );
  }
  if (members.length === 0) {
    return (
      <p className="text-ink-muted">
        No members with a profile yet. Accept an application first, then assign
        a tier here.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">
        Choose where each person appears on the public Members page. Lower order
        numbers appear first within a tier.
      </p>
      <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
        {members.map((member) => {
          const draft = drafts[member.id];
          if (!draft) return null;
          return (
            <li
              key={member.id}
              className="flex flex-col gap-3 p-4 lg:flex-row lg:items-end"
            >
              <div className="lg:w-56">
                <p className="font-semibold text-primary">{member.name}</p>
                <p className="text-xs text-ink-muted">{member.role}</p>
              </div>

              <label className="flex flex-col gap-1 text-xs font-semibold text-ink-muted">
                Tier
                <select
                  value={draft.tier}
                  onChange={(e) =>
                    patch(member.id, { tier: e.target.value as LeadershipTier })
                  }
                  className={fieldClasses}
                >
                  {TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-1 flex-col gap-1 text-xs font-semibold text-ink-muted">
                Display title (optional)
                <input
                  type="text"
                  maxLength={80}
                  value={draft.title}
                  placeholder={member.role}
                  onChange={(e) => patch(member.id, { title: e.target.value })}
                  className={fieldClasses}
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-semibold text-ink-muted lg:w-24">
                Order
                <input
                  type="number"
                  min={0}
                  max={9999}
                  value={draft.order}
                  onChange={(e) =>
                    patch(member.id, { order: Number(e.target.value) || 0 })
                  }
                  className={fieldClasses}
                />
              </label>

              <button
                type="button"
                onClick={() => void save(member)}
                disabled={saving === member.id}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving === member.id ? "Saving..." : "Save"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LeadershipManagement;
