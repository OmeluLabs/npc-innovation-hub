import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

// Real-browser responsive regression suite - the check that reading CSS by
// hand can't substitute for. Runs every route below against every viewport
// project in playwright.config.ts (see `npx playwright test --list`).
//
// Scope for now: public, unauthenticated routes only. The authenticated
// member/admin experience (dashboard, sidebars, chat, profile, settings)
// needs a seeded test user and a login step before it can be covered the
// same way - tracked as follow-up work, not skipped by oversight.
const PUBLIC_ROUTES: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/hire-us", label: "Hire Us" },
  { path: "/login", label: "Login" },
  { path: "/forgot-password", label: "Forgot Password" },
  { path: "/projects", label: "Projects" },
  { path: "/members", label: "Members" },
  { path: "/contact-us", label: "Contact Us" },
  { path: "/apply", label: "Join the Hub (apply)" },
  { path: "/blog", label: "Blog" },
  { path: "/blogs", label: "Blogs" },
  { path: "/Hub-information", label: "About the Hub" },
  { path: "/faqs", label: "FAQs" },
  { path: "/chat-with-us", label: "Chat with Us" },
  { path: "/resources-room", label: "Resources Room" },
  { path: "/resources-room/categories", label: "Resource Categories" },
  { path: "/resources-room/all-resources", label: "All Resources" },
];

// A tiny tolerance for sub-pixel rounding and scrollbar-gutter quirks
// across browsers - not a band-aid for real overflow, which runs many
// pixels over, not one.
const OVERFLOW_TOLERANCE_PX = 1;

async function assertNoHorizontalOverflow(page: Page, label: string) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(
    scrollWidth,
    `${label}: page is wider than its own viewport (scrollWidth ${scrollWidth}px > clientWidth ${clientWidth}px) - something is forcing horizontal scroll.`,
  ).toBeLessThanOrEqual(clientWidth + OVERFLOW_TOLERANCE_PX);
}

for (const route of PUBLIC_ROUTES) {
  test(`${route.label} (${route.path}) has no horizontal overflow and renders`, async ({
    page,
  }, testInfo) => {
    await page.goto(route.path, { waitUntil: "networkidle" });

    // The page must have rendered *something* - catches a route that's
    // silently blank (a crashed lazy chunk, an unhandled error) as well
    // as one that merely overflows.
    await expect(page.locator("body")).not.toBeEmpty();

    await assertNoHorizontalOverflow(page, route.label);

    // Full-page screenshot per route/viewport combination, for the visual
    // spot-check no automated assertion can replace - saved under
    // test-results/ alongside the HTML report.
    await page.screenshot({
      path: testInfo.outputPath("full-page.png"),
      fullPage: true,
    });
  });
}
