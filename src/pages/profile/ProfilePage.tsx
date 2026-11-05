// src/pages/profile/ProfilePage.tsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { useMember } from "../../hooks/useMember";
import ProfileSkeleton from "../../components/profile/ProfileSkeleton";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileTabs from "../../components/profile/ProfileTabs";
import ProfileOverview from "../../components/profile/ProfileOverview";
import ProfileSkills from "../../components/profile/ProfileSkills";
import ProfileEducation from "../../components/profile/ProfileEducation";
import ProfileContacts from "../../components/profile/ProfileContacts";
import ProfileStats from "../../components/profile/ProfileStats";
import type { ProfileTab } from "../../components/profile/ProfileTabs";

const calcCompletion = (
  hasBio: boolean,
  hasEdu: boolean,
  hasContacts: boolean,
  skillCount: number,
): number => {
  let score = 0;
  if (hasBio) score += 30;
  if (hasEdu) score += 25;
  if (hasContacts) score += 20;
  if (skillCount >= 1) score += 15;
  if (skillCount >= 2) score += 10;
  return Math.min(score, 100);
};

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading: pLoading, fetchProfile } = useProfile();
  const { member, loading: mLoading, fetchMember } = useMember();
  const [tab, setTab] = useState<ProfileTab>("overview");

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user?.id) fetchMember(user.id);
  }, [user?.id, fetchMember]);

  const isLoading = pLoading || mLoading;

  if (isLoading || !profile) return <ProfileSkeleton />;

  const completionPct = calcCompletion(
    !!member?.bio,
    !!member?.education?.degree,
    Object.values(member?.contacts ?? {}).some(Boolean),
    member?.skillDetails?.length ?? 0,
  );

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="bg-white rounded-2xl shadow-sm border border-line overflow-hidden">
        <ProfileHeader
          profile={profile}
          member={member}
          completionPct={completionPct}
        />

        <div className="max-w-5xl mx-auto px-6 pt-6 pb-10">
          <ProfileTabs active={tab} onChange={setTab} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="md:col-span-2">
              {tab === "overview" && (
                <ProfileOverview profile={profile} member={member} />
              )}
              {tab === "skills" && <ProfileSkills member={member} />}
              {tab === "education" && <ProfileEducation member={member} />}
              {tab === "contacts" && <ProfileContacts member={member} />}
            </div>

            {/* Sidebar */}
            <div>
              <ProfileStats member={member} completionPct={completionPct} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
