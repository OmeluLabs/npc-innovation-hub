// src/components/events/PublicEventCard.tsx
//
// Event card for the public /events page: cover image, date, time, location
// (or "Online"), short description and a registration call to action.
// Registration (RSVP) needs an account, so the CTA goes to the member events
// page, which ProtectedRoute already bounces through login and back.

import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { Event } from "../../types/event.types";
import { stripEmoji } from "../../utils/stripEmoji";

const ONLINE_PATTERN = /\b(online|virtual|zoom|google meet|teams|webinar)\b/i;

interface PublicEventCardProps {
  event: Event;
  isPast: boolean;
}

const PublicEventCard: React.FC<PublicEventCardProps> = ({ event, isPast }) => {
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  const online = ONLINE_PATTERN.test(event.location);

  const date = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };
  const time = `${start.toLocaleTimeString("en-US", timeFormat)} - ${end.toLocaleTimeString("en-US", timeFormat)}`;

  return (
    <article className="flex flex-col h-full bg-white rounded-2xl border border-line shadow-soft overflow-hidden transition-shadow duration-200 hover:shadow-medium">
      <div className="relative aspect-[16/9] bg-mist-200">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : null}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
            isPast ? "bg-mist-600 text-white" : "bg-npc-navy text-white"
          }`}
        >
          {isPast ? "Past event" : online ? "Online" : "Upcoming"}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-npc-navy line-clamp-2">
          {stripEmoji(event.title)}
        </h3>

        <ul className="mt-3 space-y-1.5 text-sm text-npc-text-secondary">
          <li className="flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{date}</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{time}</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              {online ? `Online - ${event.location}` : event.location}
            </span>
          </li>
        </ul>

        <p className="mt-3 text-sm text-npc-text-secondary line-clamp-3 flex-1">
          {stripEmoji(event.description)}
        </p>

        {!isPast && (
          <Link
            to="/dashboard/events"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-npc-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-npc-navy-light focus:outline-none focus-visible:ring-2 focus-visible:ring-npc-navy focus-visible:ring-offset-2"
          >
            Register
          </Link>
        )}
      </div>
    </article>
  );
};

export default PublicEventCard;
