// src/components/admin-components/Sidebar.tsx
// Admin-specific data (nav items, icon mapping, live hire-inquiries badge
// polling) wired into the shared shell in components/ui/Sidebar.tsx - the
// shell itself (collapse, mobile drawer, active styling, sign-out) lives
// there so Admin and Member can never drift apart again.

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Mail,
  FolderOpen,
  Briefcase,
  FileText,
  Users,
  Calendar,
  ClipboardList,
  MessageSquare,
  UserCheck,
  Star,
  Video,
  Images,
} from "lucide-react";
import { sidebarLinks } from "../../data/admin-data/sidebarLinks";
import { getPendingHireInquiriesCount } from "../../api/admin/hire.api";
import SidebarShell, { type SidebarLinkItem } from "../ui/Sidebar";

// How often to re-poll the pending-hire-inquiries count for the sidebar badge.
const HIRE_BADGE_POLL_MS = 45_000;
const HIRE_REQUESTS_LABEL = "Hire Us Requests";

const iconComponents = {
  dashboard: LayoutDashboard,
  notification: Mail,
  resources: FolderOpen,
  projects: Briefcase,
  blog: FileText,
  members: Users,
  calendar: Calendar,
  clipboard: ClipboardList,
  messages: MessageSquare,
  applications: UserCheck,
  heroMembers: Star,
  hubVideo: Video,
  heroMedia: Images,
};

export default function Sidebar() {
  // Real pending-hire-inquiries count for the "Hire Us Requests" badge.
  // null until the first successful fetch, so the link renders with no
  // badge rather than a stale/fake number while loading or if the
  // request fails.
  const [pendingHireCount, setPendingHireCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCount = async () => {
      try {
        const count = await getPendingHireInquiriesCount();
        if (!cancelled) setPendingHireCount(count);
      } catch (error) {
        console.error("Failed to load pending hire inquiries count:", error);
      }
    };

    void loadCount();
    const interval = setInterval(() => void loadCount(), HIRE_BADGE_POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const links: SidebarLinkItem[] = sidebarLinks.map(
    ({ icon, label, path, notification }) => {
      const IconComponent = iconComponents[icon as keyof typeof iconComponents];
      const badge =
        label === HIRE_REQUESTS_LABEL && pendingHireCount !== null
          ? pendingHireCount
          : notification;

      return {
        label,
        path,
        badge,
        icon: IconComponent ? (
          <IconComponent size={16} strokeWidth={2.5} />
        ) : null,
      };
    },
  );

  return <SidebarShell links={links} />;
}
