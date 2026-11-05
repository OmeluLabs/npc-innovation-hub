// src/components/PasswordInput.tsx
//
// A drop-in replacement for <input type="password">, with a show/hide
// eye toggle. Takes the same props as a normal input (value, onChange,
// placeholder, required, disabled, id, name, autoComplete, className,
// ...) and manages the masked/visible state itself, so existing password
// fields only need `type="password"` swapped for this component - no
// other state to wire up.

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className = "", disabled, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          type={visible ? "text" : "password"}
          disabled={disabled}
          // pr-11: room for the toggle button so it never sits over the
          // typed text, whatever the field's own className brings.
          className={`${className} pr-11`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
