import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../api/authService";
import Navbar from "../../components/Navbar";
import AuthPageMain from "../../components/AuthPageMain";
import OtpInput from "../../components/OtpInput";

// A code was just sent to get to this page, so the cooldown starts
// immediately on load, not only after a manual resend click - matches
// how the email was actually delivered, and stops a visitor mashing
// "Resend" the instant the page renders.
const RESEND_COOLDOWN_SECONDS = 45;

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");
  const [showSecurityTips, setShowSecurityTips] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  // Use authentication context
  const { verifyOTP, user, error, isLoading, clearError } = useAuth();

  const email = user?.email || localStorage.getItem("email") || "";

  useEffect(() => {
    const timer = setInterval(() => {
      setResendCooldown((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Was a bare alert("Resend OTP functionality coming soon!") with no real
  // call behind it - the backend's POST /api/users/send-otp genuinely
  // works now (see otp.middleware.ts's resendOTP), so this sends a real
  // request instead of pretending to.
  const handleResend = async () => {
    setLocalError("");
    setResendMessage("");
    clearError();

    if (!email) {
      setLocalError("Email is missing. Please try signing in again.");
      return;
    }

    setIsResending(true);
    try {
      await authService.resendOTP(email);
      setResendMessage("A new code has been sent to your email.");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp("");
    } catch (err: unknown) {
      setLocalError(
        err instanceof Error ? err.message : "Failed to resend the code.",
      );
    } finally {
      setIsResending(false);
    }
  };

  // ==================== OTP VERIFICATION ====================

  // Takes the code directly rather than reading the `otp` state - when
  // OtpInput's onComplete fires (typing/pasting the last digit), it hands
  // over the just-completed code as an argument because `otp` state
  // itself hasn't re-rendered yet at that exact moment.
  const submitOtp = async (code: string) => {
    setLocalError("");
    clearError();

    // Validation
    if (!code) {
      setLocalError("Please enter the OTP.");
      return;
    }

    if (!email) {
      setLocalError("Email is missing. Please try signing in again.");
      return;
    }

    try {
      // Use auth context for OTP verification
      await verifyOTP({ email, otp: code });
      // Navigation is handled by AuthContext based on user role
    } catch (err: unknown) {
      // Error is already set in context, but we can display it locally too
      setLocalError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitOtp(otp);
  };

  // Display error from either local state or auth context
  const displayError = localError || error;

  return (
    // h-dvh, not h-screen: 100vh runs past the actually-visible area on
    // a phone with the address bar showing, which combined with
    // overflow-hidden here could clip the verify button below the fold
    // until the chrome auto-hides. 100dvh tracks the real visible
    // viewport instead.
    <div className="flex flex-col h-dvh overflow-hidden">
      {/* Same shell as Login/SignUp/Forgot Password - shared Navbar,
          AuthPageMain's single hubimage.jpg backdrop, and a page that never
          needs to scroll on its own. This page used to be the odd one out:
          no Navbar at all, a leftover Unsplash stock photo, cyan-tinted
          "Innovate. Create. Lead." text and emoji "icons" in mismatched
          colors - visually a completely different page from Login/SignUp
          instead of the next step in the same flow. */}
      <Navbar />

      <AuthPageMain>
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center mb-2">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted">
                <MailCheck
                  className="h-7 w-7 text-primary"
                  aria-hidden="true"
                />
              </div>
              <h1 className="text-2xl font-bold text-primary">
                OTP Verification
              </h1>
              <p className="text-gray-600 text-sm mt-2">
                Enter the 6-digit code sent to{" "}
                {email ? (
                  <span className="font-semibold">{email}</span>
                ) : (
                  "your email address"
                )}
              </p>
            </div>

            {displayError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-center text-sm">
                  {displayError}
                </p>
              </div>
            )}

            {resendMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-700 text-center text-sm">
                  {resendMessage}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="otp-digit-0"
                className="block text-gray-700 text-sm font-medium mb-2 text-center"
              >
                Enter OTP Code
              </label>
              <OtpInput
                id="otp-digit-0"
                value={otp}
                onChange={setOtp}
                onComplete={(code) => void submitOtp(code)}
                disabled={isLoading}
                autoFocus
                hasError={!!displayError}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
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
                  Verifying...
                </span>
              ) : (
                "Verify OTP"
              )}
            </button>

            <div className="text-center pt-2 border-t border-gray-200">
              <p className="text-gray-600 text-sm pt-2">
                Didn't receive the code?{" "}
                {resendCooldown > 0 ? (
                  <span className="text-gray-400 font-semibold">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    className="text-primary hover:text-secondary hover:underline font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                    disabled={isLoading || isResending}
                    onClick={() => void handleResend()}
                  >
                    {isResending ? "Sending..." : "Resend OTP"}
                  </button>
                )}
              </p>
              <button
                type="button"
                className="text-primary font-medium hover:underline text-sm mt-2"
                onClick={() => setShowSecurityTips(true)}
              >
                View Security Tips
              </button>
              <p className="text-sm mt-3">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-primary hover:underline"
                >
                  ← Back to Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </AuthPageMain>

      {/* Security Tips Popup */}
      {showSecurityTips && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="border-b border-gray-200 py-4 px-6">
              <h1 className="text-xl font-bold text-red-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-red-600 mr-2"
                >
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                </svg>
                SECURITY TIPS
              </h1>
            </div>
            <div className="py-4 px-6">
              <p className="mb-3">
                To ensure your account security, please follow these steps when
                signing in:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Fill in your email and password</li>
                <li>Click on the Sign In button</li>
                <li>
                  You'll receive an OTP (One-Time Password) containing
                  verification digits via email
                </li>
                <li>Enter that OTP in the provided form</li>
                <li>
                  If you don't have an account, apply through the "Join the Hub"
                  form on the homepage - an admin reviews your application and,
                  once approved, creates your account
                </li>
              </ol>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Never share your OTP with anyone.
                  The Hub team will never ask for your OTP.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 py-3 px-6 flex justify-center">
              <button
                className="py-2 px-10 bg-primary text-white font-bold rounded hover:bg-secondary transition-colors"
                onClick={() => setShowSecurityTips(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPVerification;
