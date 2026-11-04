// src/pages/landing/EventsShowcase.tsx
//
// Events highlight on the landing page: the next upcoming events, falling
// back to the most recent past ones when nothing is scheduled, so a populated
// calendar is never invisible just because the next event is not yet set.
// Uses the same data hook and card as the public /events page.

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../hooks/useEvents";
import { getEventStatus } from "../../types/event.types";
import PublicEventCard from "../../components/events/PublicEventCard";
import Section from "../../components/layout/Section";
import CardGridSkeleton from "../../components/layout/CardGridSkeleton";
import ViewAllButton from "../../components/layout/ViewAllButton";

const PREVIEW_COUNT = 3;

const EventsShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { events, loading, error, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // "Upcoming" is keyed off endTime, so an event in progress still counts.
  const upcoming = events
    .filter((event) => getEventStatus(event) === "upcoming")
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
  const recentPast = events
    .filter((event) => getEventStatus(event) === "past")
    .sort(
      (a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime(),
    );

  const hasUpcoming = upcoming.length > 0;
  const displaySource = hasUpcoming ? upcoming : recentPast;

  // Zero events at all (or a failed fetch) hides the section.
  if (!loading && (error || displaySource.length === 0)) return null;

  const showUpcoming = hasUpcoming || loading;

  return (
    <Section
      id="events"
      label={showUpcoming ? "Upcoming Events" : "Recent Events"}
      title={showUpcoming ? "Upcoming Events" : "Recent Events"}
      description={
        showUpcoming
          ? "Workshops, talks and meetups happening around the Hub."
          : "A look back at recent workshops, talks and meetups at the Hub."
      }
      action={
        !loading ? (
          <ViewAllButton onClick={() => navigate("/events")}>
            View All Events
          </ViewAllButton>
        ) : undefined
      }
    >
      {loading ? (
        <CardGridSkeleton
          label="Loading upcoming events"
          count={PREVIEW_COUNT}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {displaySource.slice(0, PREVIEW_COUNT).map((event) => (
            <PublicEventCard
              key={event.id}
              event={event}
              isPast={!hasUpcoming}
            />
          ))}
        </div>
      )}
    </Section>
  );
};

export default EventsShowcase;
