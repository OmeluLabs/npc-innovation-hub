// src/components/OtpInput.tsx
//
// Segmented one-digit-per-box code entry, replacing a single free-text
// "Enter 6-digit OTP" field - the pattern used by most modern auth flows.
// Each box is flex-1/min-w-0 with a max-width cap rather than a fixed
// pixel size, so the row always fits down to a 320px screen without
// needing separate hand-tuned sizes per breakpoint.

import React, { useEffect, useRef } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  id?: string;
  hasError?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  autoFocus = false,
  id,
  hasError = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  useEffect(() => {
    if (autoFocus) inputRefs.current[0]?.focus();
    // Only ever run once, on mount - re-focusing on every value change
    // would steal focus back from the user mid-type.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusBox = (index: number) => {
    const el = inputRefs.current[index];
    el?.focus();
    el?.select();
  };

  const setDigitAt = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    return next.join("");
  };

  const handleChange = (index: number, raw: string) => {
    // Only the last character matters - autofill/IME/mobile keyboards can
    // report more than one at once even with maxLength={1}.
    const digit = raw.replace(/\D/g, "").slice(-1);
    const joined = setDigitAt(index, digit);
    onChange(joined);

    if (digit && index < length - 1) {
      focusBox(index + 1);
    }
    if (joined.length === length && !joined.includes("")) {
      onComplete?.(joined);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusBox(index - 1);
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusBox(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    focusBox(Math.min(pasted.length, length - 1));
    if (pasted.length === length) onComplete?.(pasted);
  };

  return (
    <div
      className="flex justify-center gap-2 sm:gap-3"
      role="group"
      aria-label="One-time verification code"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          id={index === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          pattern="\d*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          className={`flex-1 min-w-0 max-w-[52px] aspect-[4/5] text-center text-lg sm:text-2xl font-semibold rounded-xl border-2 outline-none transition-colors ${
            hasError
              ? "border-red-300 text-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-line text-primary focus:border-primary focus:ring-2 focus:ring-primary/25"
          } disabled:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
