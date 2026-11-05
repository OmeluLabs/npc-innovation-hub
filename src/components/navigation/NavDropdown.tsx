// src/components/navigation/NavDropdown.tsx
//
// Desktop dropdown for a navigation group. Implemented as an accessible
// disclosure: a button (aria-expanded / aria-controls) that reveals a list of
// links. Keyboard support:
//   Enter / Space / ArrowDown  open the panel (ArrowDown focuses first link)
//   ArrowUp / ArrowDown        move between links while open
//   Home / End                 jump to first / last link
//   Escape                     close and return focus to the button
//   Tab                        moves on naturally; the panel closes when focus
//                              leaves the dropdown
// Also opens on hover for pointer users and closes on outside click.

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import type { NavGroup, NavLeaf } from "./navLinks";

interface NavDropdownProps {
  group: NavGroup;
  isLeafActive: (leaf: NavLeaf) => boolean;
  /** Navbar sits transparent over the hero, so text must be light. */
  onDark: boolean;
}

export default function NavDropdown({
  group,
  isLeafActive,
  onDark,
}: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const closeTimer = useRef<number>();

  const groupActive = group.children.some(isLeafActive);

  const links = () =>
    Array.from(
      rootRef.current?.querySelectorAll<HTMLAnchorElement>("[data-nav-item]") ??
        [],
    );

  const focusLink = (index: number) => {
    const items = links();
    if (items.length === 0) return;
    items[(index + items.length) % items.length].focus();
  };

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const onButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      // Wait for the panel to render before moving focus into it.
      requestAnimationFrame(() => focusLink(0));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = links();
    const current = items.indexOf(document.activeElement as HTMLAnchorElement);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusLink(current + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusLink(current - 1);
        break;
      case "Home":
        e.preventDefault();
        focusLink(0);
        break;
      case "End":
        e.preventDefault();
        focusLink(items.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        break;
      default:
    }
  };

  const textClasses = onDark
    ? "text-white/90 hover:text-white drop-shadow-sm"
    : "text-npc-navy hover:text-npc-navy-light";

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => {
        window.clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = window.setTimeout(() => setOpen(false), 120);
      }}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onButtonKeyDown}
        className={`flex items-center gap-1.5 font-semibold text-sm xl:text-base px-2 xl:px-3 py-2 rounded-md border-b-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          onDark ? "focus-visible:ring-white" : "focus-visible:ring-npc-navy"
        } ${textClasses} ${
          groupActive
            ? onDark
              ? "border-white"
              : "border-npc-navy"
            : "border-transparent"
        }`}
      >
        {group.label}
        <svg
          aria-hidden="true"
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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

      {open && (
        <div
          id={panelId}
          onKeyDown={onPanelKeyDown}
          className="absolute left-0 top-full pt-2 z-50"
        >
          <ul className="min-w-[16rem] bg-white rounded-lg shadow-xl border border-line py-2">
            {group.children.map((leaf) => {
              const active = isLeafActive(leaf);
              return (
                <li key={leaf.to}>
                  <Link
                    to={leaf.to}
                    data-nav-item
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2.5 transition-colors duration-150 focus:outline-none focus-visible:bg-surface-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-npc-navy hover:bg-surface-muted ${
                      active
                        ? "border-l-4 border-npc-navy"
                        : "border-l-4 border-transparent"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-npc-navy">
                      {leaf.label}
                    </span>
                    {leaf.description && (
                      <span className="block text-xs text-npc-text-secondary mt-0.5">
                        {leaf.description}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
