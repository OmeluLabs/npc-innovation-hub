// src/pages/events-page/Events.tsx

import React, { useEffect, useState } from "react";
import { useEvents } from "../../hooks/useEvents";
import type { Event } from "../../types/event.types";
import EventCard from "../../components/events/EventCard";
import EventSkeleton from "../../components/events/EventSkeleton";
import EventDetailsModal from "../../components/events/EventDetailsModal";

const isPast = (endTime: string): boolean => new Date(endTime) < new Date();

export const Events: React.FC = () => {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);

  const { events, loading, error, rsvpedEventIds, fetchEvents, rsvp } =
    useEvents();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const upcomingEvents = events.filter((e) => !isPast(e.endTime));
  const pastEvents = events.filter((e) => isPast(e.endTime));
  const displayedEvents = tab === "upcoming" ? upcomingEvents : pastEvents;

  const handleCardClick = (event: Event) => {
    setActiveEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveEvent(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Hub events</h2>

      <div className="bg-white rounded-2xl shadow-lg pb-10">
        {/* Tabs */}
        <div className="flex gap-8 border-b px-8 pt-6">
          <button
            className={`pb-3 text-lg font-semibold border-b-2 transition ${
              tab === "upcoming"
                ? "border-black text-black"
                : "border-transparent text-ink-muted hover:text-ink-muted"
            }`}
            onClick={() => setTab("upcoming")}
          >
            Upcoming events
            {upcomingEvents.length > 0 && (
              <span className="ml-2 text-xs bg-surface-muted text-ink-muted rounded-full px-2 py-0.5">
                {upcomingEvents.length}
              </span>
            )}
          </button>
          <button
            className={`pb-3 text-lg font-semibold border-b-2 transition ${
              tab === "past"
                ? "border-black text-black"
                : "border-transparent text-ink-muted hover:text-ink-muted"
            }`}
            onClick={() => setTab("past")}
          >
            Past events
            {pastEvents.length > 0 && (
              <span className="ml-2 text-xs bg-surface-muted text-ink-muted rounded-full px-2 py-0.5">
                {pastEvents.length}
              </span>
            )}
          </button>
        </div>

        <div className="px-8 pt-8">
          {/* Error state */}
          {error && !loading && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-4 mb-6 text-sm">
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 min-w-0-all">
              {[1, 2, 3].map((n) => (
                <EventSkeleton key={n} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && displayedEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center px-4 py-12 sm:py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-ink-muted"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"
                  />
                </svg>
              </div>
              <p className="text-ink-muted font-medium">
                No {tab} events at the moment
              </p>
              <p className="text-ink-muted text-sm mt-1">
                Check back later for new events.
              </p>
            </div>
          )}

          {/* Events grid */}
          {!loading && displayedEvents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 min-w-0-all">
              {displayedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <EventDetailsModal
        event={activeEvent}
        isOpen={modalOpen}
        isRsvped={activeEvent ? rsvpedEventIds.has(activeEvent.id) : false}
        onClose={handleCloseModal}
        onRsvp={rsvp}
      />
    </div>
  );
};
