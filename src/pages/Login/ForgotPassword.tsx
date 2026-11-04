/**
 * Forgot Password Component
 *
 * Allows users to request a password reset link via email. Was a bare,
 * centered single-column form with no Navbar and none of the shared
 * Login/SignUp/OTP shell - the one auth page that looked like it belonged
 * to a different system. Now uses the same shell (AuthPageMain + Navbar +
 * no-scroll layout) as the rest of the auth flow.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/Navbar";
import AuthPageMain from "../../components/AuthPageMain";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();
  const { requestPasswordReset, error, isLoading, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!email) {
      setLocalError("Please enter your email address.");
      return;
    }

    try {
      await requestPasswordReset({ email });
      setIsSubmitted(true);
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const displayError = localError || error;

  return (
    // h-dvh, not h-screen: 100vh runs past the actually-visible area on
    // a phone with the address bar showing, which combined with
    // overflow-hidden here could clip the submit button below the fold
    // until the chrome auto-hides. 100dvh tracks the real visible
    // viewport instead.
    <div className="flex flex-col h-dvh overflow-hidden">
      <Navbar />

      <AuthPageMain>
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
          {isSubmitted ? (
            <div className="text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-primary">
                Check Your Email
              </h1>
              <p className="mt-2 text-sm text-ink-muted">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="mt-3 text-sm text-ink-muted">
                Click the link in the email to reset your password. If you don't
                see it, check your spam folder.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition-colors"
                >
                  Back to Sign In
                </button>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  className="w-full py-3 bg-surface-muted text-primary rounded-xl font-semibold hover:bg-line transition-colors"
                >
                  Try Another Email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center mb-2">
                <h1 className="text-2xl font-bold text-primary">
                  Reset Your Password
                </h1>
                <p className="text-ink-muted text-sm mt-2">
                  We'll send you a link to reset your password.
                </p>
              </div>

              {displayError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-center text-sm">
                    {displayError}
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-ink-muted text-sm font-medium mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-surface-muted disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                disabled={isLoading}
                className="w-full py-3 bg-surface-muted text-primary rounded-xl font-semibold hover:bg-line transition-colors disabled:opacity-50"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </AuthPageMain>
    </div>
  );
};

export default ForgotPassword;
