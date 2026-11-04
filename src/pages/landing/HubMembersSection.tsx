// src/components/button/landing/HubMembersSection.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeroMembers } from "../../hooks/useHeroMembers";
import { getPublicMembers } from "../../api/member/member.api";
import type { PublicMemberSummary } from "../../api/member/member.api";

// Define types
interface MemberData {
  id: string;
  // The Member row's own id — always present, unlike `id` above (which is
  // the userId the /members/:id route resolves against and may be missing).
  // Used only as the React list key so a data gap here can't also break
  // rendering.
  cardId: string;
  name: string;
  role: string;
  location?: string;
  email?: string;
  bio?: string;
  description?: string;
  skills?: string[];
  projects?: number;
  joinedYear?: number;
  image: string;
  icon?: string;
}

interface MemberCardProps {
  member: MemberData;
  onViewProfile: (id: string) => void;
}

interface MemberGridProps {
  members: MemberData[];
  onViewProfile: (id: string) => void;
}

interface HeaderProps {
  title: string;
  subtitle: string;
}

/* ── Tree layout ──────────────────────────────────────────────────────
   The section renders the team as a tree: the current team leader is the
   root, everyone else hangs off them in rows of three. Three rows total
   are shown — the leader's row plus two rows of children — and anything
   beyond that lives behind "View All Members". */
const CHILDREN_PER_ROW = 3;
const VISIBLE_CHILD_ROWS = 2;
const MAX_VISIBLE_CHILDREN = CHILDREN_PER_ROW * VISIBLE_CHILD_ROWS;

/** GET /api/members caps `limit` at 100, so pages are walked in 100s. */
const FETCH_PAGE_SIZE = 100;

/**
 * Role titles that read as a leadership position, most specific first.
 *
 * These are a *secondary* signal, not the main one. `Member.role` is
 * validated against MEMBER_SPECIALIZATIONS on the backend ('Frontend
 * Developer', 'Full-Stack Developer', ... 'Other') — a specialization, not a
 * position on the team — so a current profile can never actually say "Team
 * Leader". The column is a free-text STRING though, and the enum is only
 * enforced on the profile-update path, so legacy rows may still hold
 * something like this; if one does, honour it. Otherwise the root comes from
 * hero curation (see findLeaderIndex).
 */
const LEADER_ROLE_PATTERNS: RegExp[] = [
  /\bteam\s*lead(er)?\b/i,
  /\bhub\s*lead(er)?\b/i,
  /\bteam\s*captain\b/i,
  /\bpresident\b/i,
  /\bchair(man|woman|person)?\b/i,
  /\bcoordinator\b/i,
  /\bhead\s+of\b/i,
];

/**
 * Horizontal centre of each column in the three-column `gap-8` (32px) grid
 * below, as a CSS length rather than a rounded percentage — a plain
 * `16.6667%` sits ~10px off the real centre of the card once the gaps are
 * taken out, which is enough for the connector lines to look crooked.
 */
const COLUMN_CENTERS = [
  "calc(16.6667% - 10.6667px)",
  "50%",
  "calc(83.3333% + 10.6667px)",
];

/** The same three positions measured from the right edge (a mirror). */
const COLUMN_CENTERS_FROM_RIGHT = [...COLUMN_CENTERS].reverse();

/**
 * Member Card Component - Displays individual member information
 *
 * This is a separate implementation from
 * `src/components/membercard/MemberCard.tsx` (used by the /members
 * directory page) — different visual design and a different data shape
 * (this one maps from `PublicMemberSummary`, that one too but with a
 * different look), so they weren't consolidated. If you fix a
 * navigation/id bug in one, check the other too.
 */
const MemberCard: React.FC<MemberCardProps> = ({ member, onViewProfile }) => {
  return (
    <div className="h-full backdrop-blur-md border-2 border-white rounded-[30px] p-6 pt-12 transition-shadow duration-300">
      <div className="flex flex-col items-center">
        <div className="mb-4 w-full overflow-hidden rounded-[20px]">
          <img
            src={member.image}
            alt={`${member.name} profile`}
            className="w-full h-[300px] object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        <div className="text-center mt-2 w-full">
          <h2 className="text-3xl font-bold text-primary mb-2">
            {member.name}
          </h2>

          <div className="flex items-center justify-center mb-3">
            {member.icon ? (
              <img src={member.icon} alt="Role icon" className="w-5 h-5 mr-2" />
            ) : (
              <div className="w-5 h-5 mr-2 text-primary flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="4"
                    y="5"
                    width="16"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 9V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V9"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            )}
            <p className="text-xl text-primary font-medium">{member.role}</p>
          </div>

          {(member.location || member.email) && (
            <div className="flex flex-col space-y-2 mb-4">
              {member.location && (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 mr-2 text-gray-600 flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 13V13.01M12 9C12.5523 9 13 8.55228 13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8C11 8.55228 11.4477 9 12 9ZM12 9V11.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 21C16.4183 17 20 13.4183 20 10C20 6.13401 16.4183 3 12 3C7.58172 3 4 6.13401 4 10C4 13.4183 7.58172 17 12 21Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">{member.location}</p>
                </div>
              )}

              {member.email && (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 mr-2 text-gray-600 flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="2"
                        y="5"
                        width="20"
                        height="14"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M2 7L12 13L22 7"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              )}
            </div>
          )}

          {(member.bio || member.description) && (
            <p className="text-base text-center text-gray-700 px-2 mb-4">
              {member.bio || member.description}
            </p>
          )}

          {member.skills && member.skills.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-primary mb-2">
                Key Skills
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {member.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-line text-primary text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(member.projects !== undefined ||
            member.joinedYear !== undefined) && (
            <div className="flex justify-between mt-6 border-t border-gray-100 pt-4">
              {member.projects !== undefined && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Projects</p>
                  <p className="text-lg font-bold text-primary">
                    {member.projects}
                  </p>
                </div>
              )}

              {member.joinedYear !== undefined && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-lg font-bold text-primary">
                    {member.joinedYear}
                  </p>
                </div>
              )}
            </div>
          )}

          {member.id && (
            <button
              onClick={() => onViewProfile(member.id)}
              className="mt-6 bg-primary text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              View Full Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Member Grid Component - Displays a grid of member cards
 */
const MemberGrid: React.FC<MemberGridProps> = ({ members, onViewProfile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {members.map((member) => (
        <MemberCard
          key={member.cardId}
          member={member}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
};

/**
 * Leader Badge - marks the card sitting at the root of the tree
 */
const LeaderBadge: React.FC = () => (
  <div className="flex justify-center mb-4">
    <span className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white/60 px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-sm backdrop-blur-md">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 18h16M4 18l-1.5-9L8 12l4-7 4 7 5.5-3L20 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Team Leader
    </span>
  </div>
);

/**
 * Root Slot - keeps the leader card in the middle column of the same
 * three-column grid the children use, so the trunk below it lines up with
 * the centre of the cards rather than with an approximation of it.
 */
const RootSlot: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="hidden lg:block" aria-hidden="true" />
    <div className="mx-auto w-full max-w-[420px] lg:max-w-none">{children}</div>
    <div className="hidden lg:block" aria-hidden="true" />
  </div>
);

/**
 * Tree Connector - the trunk, rail and stubs joining the leader card to the
 * first row of member cards. Purely decorative, and only drawn at `lg`,
 * where the grid actually has the three columns the tree shape assumes;
 * below that the layout collapses to a stack and the lines would lie.
 */
const TreeConnector: React.FC<{ childCount: number }> = ({ childCount }) => {
  if (childCount < 1) return null;

  const line = "absolute bg-primary/25";
  // With a single child there is no rail to speak of, so run it from that
  // child's column across to the trunk instead of to itself.
  const railRight =
    childCount >= 2 ? COLUMN_CENTERS_FROM_RIGHT[childCount - 1] : "50%";

  return (
    <div className="relative hidden lg:block h-16" aria-hidden="true">
      {/* trunk dropping out of the leader card */}
      <div className={`${line} top-0 left-1/2 h-8 w-0.5 -translate-x-1/2`} />
      {/* junction dot where the trunk meets the rail */}
      <div className="absolute top-8 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40" />
      {/* rail spanning the first row of children */}
      <div
        className={`${line} top-8 h-0.5`}
        style={{ left: COLUMN_CENTERS[0], right: railRight }}
      />
      {/* one stub dropping into each card below */}
      {COLUMN_CENTERS.slice(0, childCount).map((left) => (
        <div
          key={left}
          className={`${line} top-8 h-8 w-0.5 -translate-x-1/2`}
          style={{ left }}
        />
      ))}
    </div>
  );
};

/**
 * Skeleton Card - one placeholder in the shape of a member card
 */
const SkeletonCard: React.FC = () => (
  <div className="border-2 border-white rounded-[30px] p-6 pt-12 animate-pulse">
    <div className="mb-4 w-full h-[300px] rounded-[20px] bg-white/40" />
    <div className="h-6 w-2/3 mx-auto rounded bg-white/40 mb-3" />
    <div className="h-4 w-1/3 mx-auto rounded bg-white/40" />
  </div>
);

/**
 * Skeleton Tree - shown while the member list is loading
 */
const SkeletonTree: React.FC = () => (
  <div aria-label="Loading hub members">
    <RootSlot>
      <SkeletonCard />
    </RootSlot>
    <div className="h-16" aria-hidden="true" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(CHILDREN_PER_ROW)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

/**
 * Header Component - Displays page header with title and subtitle
 */
const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-12">
      {/* h2, not h1 - HeroSection.tsx already owns this page's one <h1>. */}
      <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
        {title}
      </h2>
      <p className="text-xl font-medium text-primary max-w-4xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

const toMemberData = (member: PublicMemberSummary): MemberData => ({
  // /members/:id is resolved against the userId, not the Member row id.
  id: member.userId,
  cardId: member.id ?? member.userId,
  name: member.name,
  role: member.role,
  image: member.imageUrl || "/assets/images/hero.png",
});

/**
 * Picks the member who belongs at the root of the tree.
 *
 * Hero curation comes first: /Admin-hero-members is the one place an admin
 * can actually say "this person leads the team", and the top of that ordered
 * list is that statement. `role` can't carry it — it's a specialization enum
 * (see LEADER_ROLE_PATTERNS) — so it is only consulted as a fallback for
 * legacy free-text values, and the first member returned is the last resort.
 *
 * Matching on name as well as id is deliberate, not sloppy: the public
 * GET /api/hero-members projection is name/imageUrl/role only — it strips
 * memberId on purpose — so on this page the name is the *only* identifier
 * available. Two members sharing a name would tie, and the earlier one in
 * the roster wins; the admin endpoint's memberId is preferred whenever it
 * is present.
 *
 * @param curatedInOrder Hero-curated members in the admin's display order.
 */
const findLeaderIndex = (
  members: PublicMemberSummary[],
  curatedInOrder: { memberId?: string; name?: string }[],
): number => {
  for (const hero of curatedInOrder) {
    const index = members.findIndex(
      (member) =>
        (hero.memberId !== undefined &&
          (member.id === hero.memberId || member.userId === hero.memberId)) ||
        (hero.name !== undefined && member.name === hero.name),
    );
    if (index !== -1) return index;
  }

  for (const pattern of LEADER_ROLE_PATTERNS) {
    const index = members.findIndex((member) =>
      pattern.test(member.role ?? ""),
    );
    if (index !== -1) return index;
  }

  return 0;
};

const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message?: string }).message ?? "Failed to load members.";
  }
  return "Failed to load members.";
};

/**
 * Main HubMembersSection component - Displays the hub members section
 */
const HubMembersSection: React.FC = () => {
  // Hero curation no longer decides *who* is listed — every member comes from
  // the database below — but it still breaks the tie for the root of the tree
  // when nobody's role spells out a leadership title.
  const { members: heroMembers } = useHeroMembers();
  const [allMembers, setAllMembers] = useState<PublicMemberSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchAllMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const firstPage = await getPublicMembers(1, FETCH_PAGE_SIZE);
        let collected = firstPage.members;

        // The tree needs the whole roster, not one page of it, so walk any
        // remaining pages in parallel rather than one after another.
        if (firstPage.totalPages > 1) {
          const remaining = await Promise.all(
            Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
              getPublicMembers(index + 2, FETCH_PAGE_SIZE),
            ),
          );
          collected = remaining.reduce(
            (acc, page) => acc.concat(page.members),
            collected,
          );
        }

        if (!cancelled) setAllMembers(collected);
      } catch (err) {
        console.error("Failed to fetch hub members:", err);
        if (!cancelled) setError(extractErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAllMembers();
    return () => {
      cancelled = true;
    };
  }, []);

  // The first entry becomes the root of the tree. The public endpoint already
  // returns these ordered by the admin's `order` but omits the field itself,
  // so this sort is a no-op there and Array.prototype.sort's stability keeps
  // that server order intact; it only does real work if a caller ever hands
  // over records that do carry `order` (the admin endpoint's shape).
  const curatedInOrder = useMemo(
    () =>
      [...heroMembers]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((hero) => ({ memberId: hero.memberId, name: hero.name })),
    [heroMembers],
  );

  const { leader, visibleOthers, totalMembers, hiddenCount } = useMemo(() => {
    if (allMembers.length === 0) {
      return {
        leader: null as MemberData | null,
        visibleOthers: [] as MemberData[],
        totalMembers: 0,
        hiddenCount: 0,
      };
    }

    const leaderIndex = findLeaderIndex(allMembers, curatedInOrder);
    const others = allMembers
      .filter((_, index) => index !== leaderIndex)
      .map(toMemberData);

    return {
      leader: toMemberData(allMembers[leaderIndex]),
      visibleOthers: others.slice(0, MAX_VISIBLE_CHILDREN),
      totalMembers: allMembers.length,
      hiddenCount: Math.max(0, others.length - MAX_VISIBLE_CHILDREN),
    };
  }, [allMembers, curatedInOrder]);

  const handleViewAllMembers = () => {
    navigate("/members");
  };

  const handleViewProfile = (id: string) => {
    navigate(`/members/${id}`);
  };

  return (
    <div
      id="members"
      className="min-h-screen bg-gradient-to-b from-white via-surface-muted to-accent scroll-mt-16 lg:scroll-mt-20"
    >
      <header className="pt-12 pb-6 px-4 md:px-8">
        <div className="container mx-auto pt-28 max-w-7xl">
          <Header
            title="Our Team Members"
            subtitle="Meet the student innovators building real projects and driving collaboration at NPC Innovation Hub. Each member brings hands-on skills and a genuine stake in our community."
          />
        </div>
      </header>

      {/* This is one section of a longer single page (Home → Hub Members →
          Expertise → ... → Footer), not the page's own main content region -
          HeroSection.tsx already owns that <main> landmark. Two <main>
          elements on one page is invalid HTML5 and leaves assistive tech
          unable to tell which one is actually "main". */}
      <section aria-label="Our Team Members" className="py-8 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <SkeletonTree />
          ) : error ? (
            <p className="text-center text-lg text-primary/70">{error}</p>
          ) : leader ? (
            <div>
              <RootSlot>
                <LeaderBadge />
                <MemberCard member={leader} onViewProfile={handleViewProfile} />
              </RootSlot>

              {visibleOthers.length > 0 && (
                <>
                  <TreeConnector
                    childCount={Math.min(
                      visibleOthers.length,
                      CHILDREN_PER_ROW,
                    )}
                  />
                  {/* The tree collapses to a plain stack below lg, where the
                      connector is hidden - keep the rhythm with a gap. */}
                  <div className="h-10 lg:hidden" aria-hidden="true" />
                  <MemberGrid
                    members={visibleOthers}
                    onViewProfile={handleViewProfile}
                  />
                </>
              )}
            </div>
          ) : (
            <p className="text-center text-lg text-primary/70">
              We're featuring new hub members soon — check back shortly.
            </p>
          )}

          <div className="flex flex-col items-center gap-4 mt-16">
            {!loading && !error && totalMembers > 0 && (
              <p className="text-base text-primary/70">
                Showing {visibleOthers.length + 1} of {totalMembers} members
                {hiddenCount > 0 && ` — ${hiddenCount} more in the directory`}
              </p>
            )}
            <button
              className="text-2xl py-3 px-12 border-2 border-primary text-primary rounded-[33px] shadow-md hover:bg-line transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              onClick={handleViewAllMembers}
            >
              View All Members
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HubMembersSection;
