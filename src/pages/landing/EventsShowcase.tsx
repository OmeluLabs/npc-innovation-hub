// src/pages/landing/EventsShowcase.tsx
//
// "Upcoming Events" section of the single-page Home story. Home never had
// an events preview at all - reuses the same real API and card component
// the full /events page already uses (useEvents' fetchEvents, EventCard),
// rather than inventing a second, parallel data source. Matches
// ProjectsShowcase.tsx / BlogShowcase.tsx's structure.

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../hooks/useEvents";
import { getEventStatus } from "../../types/event.types";
import EventCard from "../../components/events/EventCard";

// The full events experience (RSVP, event details) only exists at
// /dashboard/events, behind ProtectedRoute - there's no separate public
// /events page to link to. GET /api/events itself is public (no
// protectRoute on that route), so the teaser below still works for a
// signed-out visitor; clicking through to see more sends them into the
// same login-then-return flow ProtectedRoute already handles for any
// other member-only page.
const EVENTS_DESTINATION = "/dashboard/events";

const PREVIEW_COUNT = 3;

const SkeletonGrid: React.FC = () => (
  <div
    className="grid grid-cols-1 md:grid-cols-3 gap-8"
    aria-label="Loading upcoming events"
  >
    {[...Array(PREVIEW_COUNT)].map((_, i) => (
      <div
        key={i}
        className="rounded-2xl overflow-hidden shadow-sm animate-pulse bg-white"
      >
        <div className="w-full h-48 bg-line" />
        <div className="p-5 space-y-3">
          <div className="h-5 w-2/3 rounded bg-line" />
          <div className="h-4 w-full rounded bg-line" />
          <div className="h-4 w-4/5 rounded bg-line" />
        </div>
      </div>
    ))}
  </div>
);

const EventsShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { events, loading, error, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // fetchEvents() returns every event regardless of date - the Hub's own
  // /events page filters "upcoming" the same way (getEventStatus, keyed
  // off endTime so an event in progress still counts as upcoming, not
  // already past).
  const upcoming = events
    .filter((event) => getEventStatus(event) === "upcoming")
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

  // Nothing upcoming doesn't mean nothing worth showing - falls back to
  // the most recently-ended events instead of hiding the whole section,
  // so a real, populated events calendar isn't invisible on Home just
  // because the next event hasn't been scheduled yet (most recent-first,
  // the same convention BlogShowcase.tsx uses).
  const recentPast = events
    .filter((event) => getEventStatus(event) === "past")
    .sort(
      (a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime(),
    );

  const hasUpcoming = upcoming.length > 0;
  const displaySource = hasUpcoming ? upcoming : recentPast;

  // Only truly zero events at all (or the fetch failing) hides the
  // section - matching BlogShowcase.tsx's "if
  // available" convention.
  if (!loading && (error || displaySource.length === 0)) return null;

  const preview = displaySource.slice(0, PREVIEW_COUNT);

  return (
    <section
      id="events"
      aria-label={hasUpcoming ? "Upcoming Events" : "Recent Events"}
      className="scroll-mt-16 lg:scroll-mt-20 py-20 px-4 md:px-8 bg-surface-muted"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {hasUpcoming || loading ? "Upcoming Events" : "Recent Events"}
          </h2>
          <p className="text-xl font-medium text-primary/80 max-w-3xl mx-auto">
            {hasUpcoming || loading
              ? "Workshops, talks, and meetups happening around the Hub."
              : "A look back at recent workshops, talks, and meetups at the Hub."}
          </p>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {preview.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => navigate(EVENTS_DESTINATION)}
              />
            ))}
          </div>
        )}

        {!loading && displaySource.length > PREVIEW_COUNT && (
          <div className="flex justify-center mt-16">
            <button
              className="text-lg py-3 px-12 border-2 border-primary text-primary rounded-[33px] shadow-md hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              onClick={() => navigate(EVENTS_DESTINATION)}
            >
              View All Events
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsShowcase;
