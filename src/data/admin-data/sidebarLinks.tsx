export const sidebarLinks = [
  {
    icon: "dashboard",
    label: "Dashboard",
    path: "/Admindashboard",
    notification: 0,
  },
  {
    // notification count for this entry is filled in at render time by
    // Sidebar.tsx from the real pending-inquiries count (see HIRE_REQUESTS_LABEL
    // below) - the static 0 here is just the fallback before that loads.
    icon: "notification",
    label: "Hire Us Requests",
    path: "/hire-requests",
    notification: 0,
  },
  {
    icon: "applications", // ← new
    label: "Applications",
    path: "/admin/applications",
    notification: 0,
  },
  {
    icon: "resources",
    label: "Resources",
    path: "/resources",
    notification: 0,
  },
  {
    icon: "projects",
    label: "Projects",
    path: "/Admin-projects",
    notification: 0,
  },
  {
    icon: "blog",
    label: "Blog",
    path: "/Admin-blogs",
    notification: 0,
  },
  {
    icon: "members",
    label: "Members",
    path: "/Admin-members",
    notification: 0,
  },
  {
    icon: "heroMembers",
    label: "Hero Members",
    path: "/Admin-hero-members",
    notification: 0,
  },
  {
    icon: "hubVideo",
    label: "Hub Video",
    path: "/Admin-hub-video",
    notification: 0,
  },
  {
    icon: "heroMedia",
    label: "Hero Media",
    path: "/Admin-hero-media",
    notification: 0,
  },
  {
    icon: "calendar",
    label: "Events",
    path: "/Admin-events",
    notification: 0,
  },
  {
    icon: "clipboard",
    label: "Tasks",
    path: "/Admin-tasks",
    notification: 0,
  },
  {
    icon: "messages", // ← new
    label: "Messages",
    path: "/admin/messages", // opens the messages page (no userId = show panel)
    notification: 0,
  },
];
