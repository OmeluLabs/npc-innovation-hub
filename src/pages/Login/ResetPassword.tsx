//

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PasswordInput from "../../components/PasswordInput";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const { resetPassword, error, isLoading, clearError } = useAuth();

  const token = searchParams.get("token");

  // ==================== VALIDATION ====================

  useEffect(() => {
    if (!token) {
      setLocalError(
        "Invalid or missing reset token. Please request a new password reset link.",
      );
    }
  }, [token]);

  // ==================== FORM SUBMISSION ====================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    // Validation
    if (!token) {
      setLocalError("Reset token is missing.");
      return;
    }

    if (!password || !confirmPassword) {
      setLocalError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ token, newPassword: password });
      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const displayError = localError || error;

  // ==================== SUCCESS VIEW ====================

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-green-600"
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
            <h2 className="mt-6 text-3xl font-bold text-primary">
              Password Reset Successful!
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Your password has been successfully reset.
            </p>
            <p className="mt-4 text-sm text-ink-muted">
              You will be redirected to the sign in page in a few seconds...
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== FORM VIEW ====================

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Set New Password</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Please enter your new password below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {displayError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center text-sm">{displayError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                New Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || !token}
                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent disabled:bg-surface-muted disabled:cursor-not-allowed"
                placeholder="Enter new password (min. 8 characters)"
                minLength={8}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-ink-muted mb-2"
              >
                Confirm New Password
              </label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading || !token}
                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent disabled:bg-surface-muted disabled:cursor-not-allowed"
                placeholder="Confirm new password"
                minLength={8}
              />
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-surface-muted border border-accent rounded-lg p-4">
            <p className="text-sm text-secondary font-medium mb-2">
              Password Requirements:
            </p>
            <ul className="text-sm text-secondary space-y-1 list-disc list-inside">
              <li>At least 8 characters long</li>
              <li>Mix of letters, numbers, and symbols recommended</li>
            </ul>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-line text-primary rounded-lg font-semibold hover:bg-line transition-colors disabled:opacity-50"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
