// src/components/events/EventDetailsModal.tsx

import React from "react";
import type { Event } from "../../types/event.types";
import RSVPButton from "./RSVPButton";

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  isRsvped: boolean;
  onClose: () => void;
  onRsvp: (eventId: string) => Promise<boolean>;
}

const formatFullDateTime = (iso: string): string => {
  const date = new Date(iso);
  return (
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  isRsvped,
  onClose,
  onRsvp,
}) => {
  if (!isOpen || !event) return null;

  const creatorInitials = event.creator
    ? `${event.creator.firstName[0]}${event.creator.lastName[0]}`
    : "?";

  const creatorName = event.creator
    ? `${event.creator.firstName} ${event.creator.lastName}`
    : "Unknown";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative w-full h-64 overflow-hidden rounded-t-2xl">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition shadow"
          >
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex flex-col gap-5">
          <h2 className="text-2xl font-bold text-primary">{event.title}</h2>

          {/* Location */}
          <div className="flex items-start gap-2 text-ink-muted">
            <svg
              className="w-5 h-5 mt-0.5 shrink-0 text-ink-muted"
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
            <span className="text-sm">{event.location}</span>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-muted rounded-xl p-4">
              <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1">
                Start
              </div>
              <div className="text-sm font-medium text-primary">
                {formatFullDateTime(event.startTime)}
              </div>
            </div>
            <div className="bg-surface-muted rounded-xl p-4">
              <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1">
                End
              </div>
              <div className="text-sm font-medium text-primary">
                {formatFullDateTime(event.endTime)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">
              About this event
            </div>
            <p className="text-ink-muted text-sm leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Creator + RSVP */}
          <div className="flex items-center gap-3 pt-2 border-t border-line">
            <div className="w-9 h-9 rounded-full bg-line flex items-center justify-center text-sm font-semibold text-ink-muted shrink-0 overflow-hidden">
              {event.creator?.image ? (
                <img
                  src={event.creator.image}
                  alt="creator"
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                creatorInitials
              )}
            </div>
            <div>
              <div className="text-xs text-ink-muted">Organized by</div>
              <div className="text-sm font-semibold text-primary">
                {creatorName}
              </div>
            </div>

            <div className="ml-auto">
              <RSVPButton
                eventId={event.id}
                isRsvped={isRsvped}
                onRsvp={onRsvp}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
