// src/components/Navbar.tsx
//
// Single shared public navigation bar. Before this, the app had THREE
// separate, drifting copies of this navbar embedded in different places
// (components/Header.tsx, landing/HeroSection.tsx, projects/ProjectHero.tsx)
// plus several public routes (/members, /apply, /resources-room/*, ...)
// with no navbar at all. This is the one, consistent version, used on every
// public route via AllRoutes.tsx.
//
// Fixed to the top of the viewport on every screen size, with a spacer
// (rendered as part of this component) so page content never sits under it.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types/user.types";
import { useActiveSection } from "../hooks/useActiveSection";
import SkipToContent from "./SkipToContent";
import AssistantWidget from "./assistant/AssistantWidget";
import NavDropdown from "./navigation/NavDropdown";
import {
  NAV_ITEMS,
  SECTION_IDS,
  isGroup,
  isLeafActive,
} from "./navigation/navLinks";
import type { NavLeaf } from "./navigation/navLinks";

// The link structure (including dropdown groups) lives in
// navigation/navLinks.ts. Section links point at the single-page Home
// story's sections; on any other route a link is "active" when its
// deepPath matches the current page instead.

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Subtle shadow/blur once the page has scrolled, so the fixed bar reads as
  // "responding to scroll" rather than a flat static overlay. Independent of
  // pastHero below - purely cosmetic, applies to the solid state however it
  // was reached.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the account dropdown on outside click.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the mobile menu whenever the route changes (e.g. a Link was
  // clicked) rather than only on explicit close.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const onHome = location.pathname === "/";

  // Whether the hero's own bottom edge has scrolled up past the header -
  // i.e. whether what's actually behind the navbar right now is the hero's
  // photo/navy background (false) or the plain white section below it
  // (true). Defaults true so a route with no hero, or a moment before the
  // hero has mounted, never sits transparent over nothing.
  const [pastHero, setPastHero] = useState(true);

  // The homepage hero (see HeroSection.tsx) is a photo/navy background at
  // every breakpoint now, not a plain white one, so the navbar floats
  // transparent over it for as long as the hero is what's actually behind
  // it - same idea as glion.edu's navbar.
  //
  // IntersectionObserver, not a scrollY/hero-height comparison: the hero's
  // rendered height is responsive (min-h-screen plus its own content), so a
  // fixed pixel threshold would drift out of sync with it. rootMargin
  // shrinks the observed viewport by the header's own height from the top,
  // so "not intersecting" fires exactly when the hero's bottom edge reaches
  // the header - i.e. when the header stops being over the hero and starts
  // being over the white section below it. Polls for the #home element the
  // same bounded-rAF way the hash-scroll effect below does, since it's one
  // of AllRoutes.tsx's lazy chunks and may not be in the DOM yet on a fresh
  // load.
  //
  // useLayoutEffect, not useEffect: each route renders its own <Navbar/>
  // (see AllRoutes.tsx), so navigating here from another route mounts a
  // fresh instance whose pastHero starts at its default (true, solid)
  // until this runs. useEffect fires after the browser paints, so that
  // default briefly paints for real - a visible flash of solid white
  // before fading transparent on every client-side navigation back to
  // "/". useLayoutEffect runs synchronously before paint, so the corrected
  // value is what actually gets painted the first time.
  useLayoutEffect(() => {
    if (!onHome) {
      setPastHero(true);
      return undefined;
    }

    // Not implemented in jsdom (unlike matchMedia, which the effect below
    // relies on unguarded), and worth guarding for real degraded
    // environments too - falls back to the always-solid state rather than
    // an unhandled crash.
    if (typeof IntersectionObserver === "undefined") {
      setPastHero(true);
      return undefined;
    }

    // Header height differs below/at lg (63px vs 71px - measured, not
    // guessed, since it's now intrinsic to the logo's own size rather
    // than a fixed h-16/h-20 - must match the spacer's h-[63px]
    // lg:h-[71px] below and HeroSection.tsx's matching -top-[63px]
    // lg:-top-[71px] background offset). Re-read on every
    // (re)attach, and torn down/recreated below on a live breakpoint
    // crossing, rather than captured once - a resize that crosses lg
    // would otherwise leave the observer's rootMargin measuring against
    // the wrong height until the component next remounts.
    const isLg = () => window.matchMedia("(min-width: 1024px)").matches;

    let observer: IntersectionObserver | undefined;
    let rafId: number;
    let cancelled = false;
    const deadline = Date.now() + 3000;

    const setup = (hero: HTMLElement) => {
      const headerHeight = isLg() ? 71 : 63;
      // The observer is only a "something crossed the threshold, go
      // recheck" signal here - its own isIntersecting/rootBounds aren't
      // trusted directly. Right after a client-side route transition
      // inserts the hero into the DOM, the observer's very first callback
      // can fire once with geometry from before layout has fully settled
      // (a real, if intermittent, timing gap - observed as the navbar
      // staying solid on navigating back to "/" from another route).
      // Since the hero doesn't actually move again after that, there's no
      // later crossing to self-correct it. A fresh getBoundingClientRect()
      // read, on the other hand, always reflects current, fully-computed
      // layout, so recomputing from it - both once synchronously now and
      // again on every future callback - has no equivalent gap.
      const recompute = () => {
        setPastHero(hero.getBoundingClientRect().bottom <= headerHeight);
      };
      observer = new IntersectionObserver(recompute, {
        rootMargin: `-${headerHeight}px 0px 0px 0px`,
        threshold: 0,
      });
      observer.observe(hero);
      recompute();
    };

    const attach = () => {
      if (cancelled) return;
      const hero = document.getElementById("home");
      if (hero) {
        setup(hero);
        return;
      }
      if (Date.now() < deadline) rafId = requestAnimationFrame(attach);
    };

    attach();

    const mql = window.matchMedia("(min-width: 1024px)");
    const handleBreakpointChange = () => {
      const hero = document.getElementById("home");
      if (!hero) return;
      observer?.disconnect();
      setup(hero);
    };
    mql.addEventListener("change", handleBreakpointChange);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      observer?.disconnect();
      mql.removeEventListener("change", handleBreakpointChange);
    };
  }, [onHome]);

  const transparentAtTop = onHome && !pastHero;

  // Which Home section is currently in view, so the right nav link
  // highlights while scrolling - only runs on "/" itself.
  const activeSectionId = useActiveSection(SECTION_IDS, onHome);

  // A Link to "/#section" while already on "/" only changes the hash
  // (React Router doesn't remount the route), so this effect is what
  // actually does the scrolling - covers both that case and arriving at
  // "/#section" fresh from another page (or a hard reload/typed URL).
  // Respects reduced-motion.
  //
  // The target section is one of AllRoutes.tsx's lazy-loaded chunks, so on
  // a fresh load it may not be in the DOM yet the instant this runs - polls
  // for it via requestAnimationFrame (bounded to ~3s) rather than a single
  // check that would silently no-op while the chunk is still downloading.
  useEffect(() => {
    if (!onHome || !location.hash) return undefined;
    const id = location.hash.slice(1);

    let rafId: number;
    let cancelled = false;
    const deadline = Date.now() + 3000;

    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        el.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
        return;
      }
      if (Date.now() < deadline) {
        rafId = requestAnimationFrame(tryScroll);
      }
    };

    tryScroll();
    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [onHome, location.hash]);

  const dashboardPath =
    user?.role === UserRole.ADMIN ? "/Admindashboard" : "/dashboard";

  // "Home" never gets the active-highlight on the nav link itself - that
  // treatment belongs to the logo (see isHomeActive below), since the logo
  // already links to "/".
  const isActive = (leaf: NavLeaf) =>
    isLeafActive(leaf, {
      onHome,
      activeSectionId,
      pathname: location.pathname,
      search: location.search,
    });

  const isHomeActive = onHome && activeSectionId === "home";

  const handleLogout = async () => {
    setShowUserMenu(false);
    setIsMenuOpen(false);
    await logout();
    navigate("/");
  };

  // A hash-only navigation (e.g. "/#members" while already on "/") doesn't
  // change location.pathname, so the route-change effect above never fires
  // to close the mobile menu - close it directly on tap instead.
  const renderMobileLink = (leaf: NavLeaf) => (
    <Link
      key={leaf.to}
      to={leaf.to}
      onClick={() => setIsMenuOpen(false)}
      aria-current={isActive(leaf) ? "page" : undefined}
      className={`block px-4 py-3 font-semibold rounded-lg border-l-4 transition-colors duration-200 ${
        isActive(leaf)
          ? "text-npc-navy border-npc-navy bg-surface-muted"
          : "text-npc-navy border-transparent hover:bg-surface-muted"
      }`}
    >
      {leaf.label}
    </Link>
  );

  return (
    <>
      <SkipToContent />
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          transparentAtTop
            ? "bg-transparent shadow-none"
            : `bg-white ${scrolled ? "shadow-md" : "shadow-sm"}`
        }`}
      >
        {/* Thin two-tone navy gradient accent, same treatment as the Hero
            section's mobile header accent line - ties this flat white bar
            back to the homepage's signature brand gradient instead of
            reading as a plain, disconnected white strip. Faded out (not
            unmounted) while transparentAtTop, so the header's height never
            changes and the spacer div below stays accurate. */}
        <div
          className={`h-[3px] w-full bg-gradient-to-r from-npc-navy via-npc-navy-light to-npc-navy transition-opacity duration-300 ${
            transparentAtTop ? "opacity-0" : ""
          }`}
        />

        {/* No fixed h-16/h-20 any more - row height is intrinsic to its
            tallest child (the logo block) plus this small py-2, so
            there's no leftover space beyond a bit of real breathing
            room - without any py at all the logo's own active-page
            border sat flush against the header's top/bottom edges with
            nothing around it, which read as cramped rather than
            compact. items-center still centers the shorter items (nav
            links, Sign In) against it. */}
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 py-2">
          {/* Brand mark - the National Police College emblem plus a
              two-line NPC Innovation Hub / Innovate · Create · Build
              lockup, replacing the old text-only "NPC INNOVATION HUB"
              wordmark. One Link (not two) so the whole mark is a single
              tab stop to Home, matching how a logo normally behaves.
              Carries the active-page border that "Home" used to show on
              itself (see isHomeActive/isActive above) - the logo already
              links to "/", so highlighting both it and a separate Home
              link at once would just say the same thing twice. Always
              border-2 (transparent when not active), same as every other
              nav link, so this never changes size between the two states. */}
          <Link
            to="/"
            className={`flex items-center gap-2.5 sm:gap-3 group border-2 px-3 py-1.5 -mx-3 -my-1.5 transition-all duration-200 ${
              transparentAtTop
                ? isHomeActive
                  ? "border-white"
                  : "border-transparent"
                : isHomeActive
                  ? "border-npc-navy"
                  : "border-transparent"
            }`}
          >
            <img
              src="/assets/images/npc-emblem.png"
              alt="National Police College"
              className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
            />
            <span className="leading-tight">
              <span
                className={`block font-bold tracking-tight text-sm lg:text-lg whitespace-nowrap transition-colors duration-200 ${
                  transparentAtTop
                    ? "text-white drop-shadow-md group-hover:text-white/80"
                    : "text-npc-navy group-hover:text-npc-navy-light"
                }`}
              >
                NPC INNOVATION HUB
              </span>
              <span
                className={`block font-medium tracking-wide uppercase text-[10px] lg:text-xs whitespace-nowrap transition-colors duration-200 ${
                  transparentAtTop ? "text-white/70" : "text-npc-navy/60"
                }`}
              >
                Innovate &middot; Create &middot; Build
              </span>
            </span>
          </Link>

          {/* Desktop nav links + Sign In, grouped as one right-aligned
              unit (was 3 separate flex children spread across the row
              via justify-between, which floated the links in the
              middle with a large gap after the logo) - now the outer
              row has exactly 2 visible children at lg+ (logo, this
              group), so justify-between pins the logo flush left and
              the whole group flush right, with the links sitting close
              to Sign In instead of floating in open space. */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            <nav
              className="flex items-center gap-0.5 xl:gap-2"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.filter(
                (item) => isGroup(item) || item.sectionId !== "home",
              ).map((item) =>
                isGroup(item) ? (
                  <NavDropdown
                    key={item.label}
                    group={item}
                    isLeafActive={isActive}
                    onDark={transparentAtTop}
                  />
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={isActive(item) ? "page" : undefined}
                    className={`font-semibold text-sm xl:text-base px-2 xl:px-3 py-2 rounded-md border-b-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      transparentAtTop
                        ? `focus-visible:ring-white drop-shadow-sm ${
                            isActive(item)
                              ? "border-white text-white"
                              : "border-transparent text-white/90 hover:text-white"
                          }`
                        : `focus-visible:ring-npc-navy ${
                            isActive(item)
                              ? "border-npc-navy text-npc-navy"
                              : "border-transparent text-npc-navy hover:text-npc-navy-light"
                          }`
                    }`}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            {/* Sign In, or an account menu once logged in. Sign In is
                plain text now (no border box) - same hover-only
                treatment as an inactive nav link, matching the "no
                outer rectangle" look now used everywhere except the
                nav links' own active-page indicator. */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu((s) => !s)}
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                  className={`flex items-center gap-2 font-bold text-white px-3 xl:px-5 py-2.5 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    transparentAtTop
                      ? "bg-white/10 backdrop-blur-sm border-2 border-white hover:bg-white hover:text-npc-navy focus:ring-white"
                      : "bg-npc-navy hover:bg-npc-navy-light hover:shadow-md focus:ring-npc-navy"
                  }`}
                >
                  {user.firstName || "Account"}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-line overflow-hidden">
                    <Link
                      to={dashboardPath}
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-3 text-sm font-bold text-npc-navy hover:bg-surface-muted transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => void handleLogout()}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 border-t border-line transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`font-bold uppercase text-sm xl:text-[1.05rem] px-2 xl:px-4 py-1.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  transparentAtTop
                    ? "text-white/90 hover:text-white drop-shadow-sm focus:ring-white"
                    : "text-npc-navy hover:text-npc-navy-light focus:ring-npc-navy"
                }`}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger. White when transparentAtTop to match the
              logo, except once the menu is open - the panel below is
              always solid white (readable list items need a guaranteed
              background regardless of what's behind the header), so the
              icon switches to its solid-state color the moment it opens
              rather than staying white against a white panel. */}
          <button
            className={`lg:hidden relative p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 ${
              transparentAtTop && !isMenuOpen
                ? "text-white hover:bg-white/10 focus:ring-white/40"
                : "text-npc-navy hover:bg-surface-muted focus:ring-npc-navy/20"
            }`}
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <div className="w-6 h-6 relative">
              <span
                className={`absolute block w-6 h-0.5 transform transition-all duration-300 ${
                  transparentAtTop && !isMenuOpen ? "bg-white" : "bg-npc-navy"
                } ${isMenuOpen ? "rotate-45 top-2.5" : "top-0"}`}
              />
              <span
                className={`absolute block w-6 h-0.5 top-2.5 transition-all duration-300 ${
                  transparentAtTop && !isMenuOpen ? "bg-white" : "bg-npc-navy"
                } ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute block w-6 h-0.5 transform transition-all duration-300 ${
                  transparentAtTop && !isMenuOpen ? "bg-white" : "bg-npc-navy"
                } ${isMenuOpen ? "-rotate-45 top-2.5" : "top-5"}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav
            className="lg:hidden px-6 pb-4 bg-white border-t border-line max-h-[calc(100vh-4rem)] overflow-y-auto"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1 pt-2">
              {NAV_ITEMS.map((item) =>
                isGroup(item) ? (
                  <div key={item.label} role="group" aria-label={item.label}>
                    <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-npc-text-secondary">
                      {item.label}
                    </p>
                    {item.children.map(renderMobileLink)}
                  </div>
                ) : (
                  renderMobileLink(item)
                ),
              )}

              {isAuthenticated && user ? (
                <>
                  <Link
                    to={dashboardPath}
                    className="block px-4 py-3 font-bold text-npc-navy rounded-lg hover:bg-surface-muted transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => void handleLogout()}
                    className="w-full text-left mt-2 px-4 py-3 font-bold text-center bg-white text-red-600 shadow-sm border border-line hover:bg-red-50 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block mt-2 text-center bg-npc-navy text-white font-bold uppercase px-6 py-3 shadow-sm hover:bg-npc-navy-light hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-npc-navy focus:ring-offset-2"
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Reserves the space the fixed header occupies so page content isn't
          hidden underneath it. Height must match the header's own real
          rendered height exactly - the content row has no fixed h-16/h-20
          any more (intrinsic to the logo's size instead), so this is a
          measured value (63px below lg, 71px at lg - see the
          headerHeight comment above), not a guess. */}
      <div aria-hidden="true" className="h-[63px] lg:h-[71px]" />

      {/* Floating AI assistant - mounted once here (Navbar is on every
          public page) rather than duplicated per-route, so it's a
          single instance regardless of which page is active. */}
      <AssistantWidget />
    </>
  );
}
