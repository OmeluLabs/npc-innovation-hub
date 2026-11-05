// src/components/events/EventCard.tsx

import React from "react";
import type { Event } from "../../types/event.types";

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
}

const formatDateTime = (iso: string): string => {
  const date = new Date(iso);
  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " · " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <div
      onClick={() => onClick(event)}
      className="rounded-2xl bg-white shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
    >
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-2 min-w-0">
        <h3 className="font-bold text-base text-primary line-clamp-2">
          {event.title}
        </h3>

        <div className="flex items-start gap-1.5 text-ink-muted text-sm">
          <svg
            className="w-4 h-4 mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <span className="line-clamp-1">{event.location}</span>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-muted mt-1">
          <div>
            <div className="font-semibold text-primary mb-0.5">Start</div>
            <div>{formatDateTime(event.startTime)}</div>
          </div>
          <div>
            <div className="font-semibold text-primary mb-0.5">End</div>
            <div>{formatDateTime(event.endTime)}</div>
          </div>
        </div>

        <p className="text-ink-muted text-sm line-clamp-2 mt-1">
          {event.description}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
