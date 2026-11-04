// src/components/button/Footer.tsx
//
// Single shared public footer. Link columns are data-driven so the footer and
// the navbar stay in step as pages are added.

import React from "react";
import { Link } from "react-router-dom";
import { OPEN_ASSISTANT_CHAT_EVENT } from "../assistant/AssistantWidget";

interface FooterLink {
  label: string;
  to?: string;
  onClick?: () => void;
}

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "The Hub",
    links: [
      { label: "About the Hub", to: "/Hub-information" },
      { label: "Members", to: "/members" },
      { label: "Projects", to: "/projects" },
      { label: "Contact Us", to: "/contact-us" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Events", to: "/events" },
      { label: "Blogs", to: "/blog" },
      { label: "Resources", to: "/resources-room" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Apply to join", to: "/apply" },
      { label: "Hire Us", to: "/hire-us" },
      { label: "FAQs", to: "/faqs" },
      {
        label: "Chat with Us",
        onClick: () =>
          window.dispatchEvent(new Event(OPEN_ASSISTANT_CHAT_EVENT)),
      },
    ],
  },
];

const linkClasses =
  "inline-block py-1.5 text-white/80 transition-colors duration-200 hover:text-accent focus:outline-none focus-visible:text-accent focus-visible:underline";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="w-full bg-primary text-white scroll-mt-16 lg:scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-14 pb-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <p className="font-heading text-xl font-bold">NPC INNOVATION HUB</p>
            <p className="mt-3 text-sm text-white/70 max-w-xs">
              A student-led space for building real-world technology, with
              mentorship at every step.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-accent">
                {column.title}
              </h2>
              <ul className="mt-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className={linkClasses}>
                        {link.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={link.onClick}
                        className={linkClasses}
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/15 flex flex-col md:flex-row md:justify-between items-center gap-2 text-sm text-white/70">
          <p>&copy; {currentYear} NPC Innovation Hub. All rights reserved.</p>
          <p className="font-semibold text-white">NPC INNOVATION HUB</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
