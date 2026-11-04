// src/components/SkipToContent.tsx
//
// A "Skip to main content" link - invisible until it receives keyboard
// focus, at which point it becomes the very first visible, focusable thing
// on the page. Lets keyboard and screen-reader users jump straight past the
// repeated Navbar/Sidebar+Topbar chrome on every route to the actual page
// content (id="main-content" on that route's <main>), instead of tabbing
// through the same nav links again on every single page load.
//
// Rendered at the top of both navigation shells: Navbar.tsx (public site)
// and Sidebar.tsx (admin) / DashboardLayout.tsx (member) / AdminChatLayout
// (admin chat) for the internal system - those don't render Navbar at all,
// so this needs its own presence in each shell.
const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
  >
    Skip to main content
  </a>
);

export default SkipToContent;
