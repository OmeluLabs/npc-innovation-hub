// src/components/navigation/navLinks.ts
//
// Single source of truth for the public navigation structure. The Navbar
// (desktop + mobile) renders from this list, so adding or regrouping a link
// never means touching the layout markup.
//
// A link is either a leaf ({ to }) or a group ({ children }). Leaves with a
// sectionId point at a section of the single-page Home story and are
// highlighted while that section is in view; every leaf also has a deepPath
// that marks it active when the visitor is on that page instead.

export interface NavLeaf {
  label: string;
  to: string;
  /** Element id of the matching Home section, when there is one. */
  sectionId?: string;
  /** Path (without hash/query) that marks this link active. */
  deepPath: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  children: NavLeaf[];
}

export type NavItem = NavLeaf | NavGroup;

export const isGroup = (item: NavItem): item is NavGroup => "children" in item;

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/#home", sectionId: "home", deepPath: "/" },
  {
    label: "About",
    children: [
      {
        label: "About the Hub",
        to: "/#about",
        sectionId: "about",
        deepPath: "/Hub-information",
        description: "Our mission, vision and what we do",
      },
      {
        label: "Contact Us",
        to: "/#contact",
        sectionId: "contact",
        deepPath: "/contact-us",
        description: "Questions, partnerships and press",
      },
    ],
  },
  {
    label: "Community",
    children: [
      {
        label: "Members",
        to: "/#members",
        sectionId: "members",
        deepPath: "/members",
        description: "Co-founders, leaders and members",
      },
      {
        label: "Projects",
        to: "/#projects",
        sectionId: "projects",
        deepPath: "/projects",
        description: "What the Hub has built",
      },
    ],
  },
  {
    label: "Events",
    children: [
      {
        label: "Upcoming Events",
        to: "/events",
        deepPath: "/events",
        description: "Workshops, meetups and hackathons",
      },
      {
        label: "Past Events",
        to: "/events?tab=past",
        deepPath: "/events?tab=past",
        description: "Highlights from previous events",
      },
    ],
  },
  { label: "Blogs", to: "/blog", deepPath: "/blog" },
  { label: "Hire Us", to: "/hire-us", deepPath: "/hire-us" },
  { label: "Applications", to: "/apply", deepPath: "/apply" },
];

export const SECTION_IDS: string[] = NAV_ITEMS.flatMap((item) =>
  isGroup(item) ? item.children : [item],
)
  .map((leaf) => leaf.sectionId)
  .filter((id): id is string => Boolean(id));

/**
 * Whether a leaf is the active page. On Home, the section in view wins;
 * elsewhere the current URL is compared against the leaf's deepPath
 * ("/blog" also matches "/blog/..." and "/blogs/...").
 */
export function isLeafActive(
  leaf: NavLeaf,
  ctx: {
    onHome: boolean;
    activeSectionId: string | null;
    pathname: string;
    search: string;
  },
): boolean {
  if (leaf.sectionId === "home") return false; // The logo carries Home's highlight.
  if (ctx.onHome) {
    return (
      leaf.sectionId !== undefined && ctx.activeSectionId === leaf.sectionId
    );
  }
  const [path, query] = leaf.deepPath.split("?");
  if (query) {
    return ctx.pathname === path && ctx.search.includes(query);
  }
  if (path === "/events") {
    // "Upcoming Events" is active on /events unless the past tab is chosen.
    return ctx.pathname === path && !ctx.search.includes("tab=past");
  }
  if (path === "/blog") {
    return /^\/blogs?(\/|$)/.test(ctx.pathname);
  }
  return ctx.pathname === path || ctx.pathname.startsWith(`${path}/`);
}
