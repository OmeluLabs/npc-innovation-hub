// src/pages/events-page/PublicEventsPage.tsx
//
// Public /events page: upcoming and past events in separate tabs (the tab is
// kept in the URL as ?tab=past so the navbar's "Past Events" link and
// browser history both work). Reads the public GET /api/events endpoint via
// useEvents; registration itself requires an account (see PublicEventCard).

import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useEvents } from "../../hooks/useEvents";
import { getEventStatus } from "../../types/event.types";
import PageHeader from "../../components/layout/PageHeader";
import EmptyState from "../../components/layout/EmptyState";
import PublicEventCard from "../../components/events/PublicEventCard";

type Tab = "upcoming" | "past";

const TABS: { id: Tab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
];

const SkeletonGrid: React.FC = () => (
  <div
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    aria-busy="true"
    aria-label="Loading events"
  >
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="rounded-2xl overflow-hidden bg-white border border-line animate-pulse"
      >
        <div className="aspect-[16/9] bg-mist-300" />
        <div className="p-5 space-y-3">
          <div className="h-5 w-2/3 rounded bg-mist-300" />
          <div className="h-4 w-full rounded bg-mist-300" />
          <div className="h-4 w-4/5 rounded bg-mist-300" />
        </div>
      </div>
    ))}
  </div>
);

const PublicEventsPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get("tab") === "past" ? "past" : "upcoming";
  const { events, loading, error, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const { upcoming, past } = useMemo(() => {
    const byStart = (a: { startTime: string }, b: { startTime: string }) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    return {
      upcoming: events
        .filter((e) => getEventStatus(e) === "upcoming")
        .sort(byStart),
      past: events
        .filter((e) => getEventStatus(e) === "past")
        .sort(byStart)
        .reverse(),
    };
  }, [events]);

  const shown = tab === "upcoming" ? upcoming : past;

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Workshops, meetups and hackathons"
        description="Learn alongside the Hub community. Browse what is coming up, or look back at what we have already run."
      />

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
          <div
            role="tablist"
            aria-label="Event timeframe"
            className="inline-flex rounded-lg border border-mist-400 p-1 mb-8"
          >
            {TABS.map(({ id, label }) => {
              const count = id === "upcoming" ? upcoming.length : past.length;
              return (
                <button
                  key={id}
                  role="tab"
                  id={`events-tab-${id}`}
                  aria-selected={tab === id}
                  aria-controls="events-panel"
                  onClick={() =>
                    setParams(id === "past" ? { tab: "past" } : {})
                  }
                  className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-npc-navy ${
                    tab === id
                      ? "bg-npc-navy text-white"
                      : "text-npc-navy hover:bg-mist-200"
                  }`}
                >
                  {label}
                  {!loading && !error && (
                    <span className="ml-2 opacity-80">({count})</span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            id="events-panel"
            role="tabpanel"
            aria-labelledby={`events-tab-${tab}`}
          >
            {loading ? (
              <SkeletonGrid />
            ) : error ? (
              <EmptyState
                title="We could not load events"
                message="Please check your connection and try again."
                action={
                  <button
                    onClick={() => fetchEvents()}
                    className="rounded-lg bg-npc-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-npc-navy-light focus:outline-none focus-visible:ring-2 focus-visible:ring-npc-navy focus-visible:ring-offset-2"
                  >
                    Try again
                  </button>
                }
              />
            ) : shown.length === 0 ? (
              <EmptyState
                title={
                  tab === "upcoming"
                    ? "No upcoming events right now"
                    : "No past events yet"
                }
                message={
                  tab === "upcoming"
                    ? "New events are announced regularly. Check back soon."
                    : "Events will appear here once they have taken place."
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shown.map((event) => (
                  <PublicEventCard
                    key={event.id}
                    event={event}
                    isPast={tab === "past"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PublicEventsPage;
