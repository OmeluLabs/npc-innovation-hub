// src/components/events/RSVPButton.tsx

import React, { useState } from "react";

interface RSVPButtonProps {
  eventId: string;
  isRsvped: boolean;
  onRsvp: (eventId: string) => Promise<boolean>;
}

const RSVPButton: React.FC<RSVPButtonProps> = ({
  eventId,
  isRsvped,
  onRsvp,
}) => {
  const [loading, setLoading] = useState(false);
  const [rsvped, setRsvped] = useState(isRsvped);

  const handleClick = async () => {
    if (rsvped || loading) return;
    setLoading(true);
    const success = await onRsvp(eventId);
    if (success) setRsvped(true);
    setLoading(false);
  };

  if (rsvped) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-100 text-green-700 font-semibold text-sm cursor-not-allowed"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
        Going
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black text-white font-semibold text-sm hover:bg-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          RSVPing...
        </>
      ) : (
        "RSVP"
      )}
    </button>
  );
};

export default RSVPButton;
