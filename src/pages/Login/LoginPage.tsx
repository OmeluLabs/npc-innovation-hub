import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CredentialResponse } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID, API_BASE_URL } from "../../config/env";
import Navbar from "../../components/Navbar";
import AuthPageMain from "../../components/AuthPageMain";
import PasswordInput from "../../components/PasswordInput";

// Extend the Window interface to include typed google object
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: object) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // "Remember me" remembers the email for next visit (a stored token would
  // let anyone on the machine straight into the account, so the box only
  // ever controls the email field - never how long the session lasts).
  useEffect(() => {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      // hl=en pins the rendered button (and any Google-hosted consent UI)
      // to English regardless of the visitor's OS/browser locale - it was
      // rendering as "Se connecter avec Google" for a French-locale
      // browser instead of a consistent, expected label.
      script.src = "https://accounts.google.com/gsi/client?hl=en";
      script.async = true;
      script.defer = true;
      script.id = "google-gsi-script";
      document.body.appendChild(script);
      script.onload = () => {
        waitForGoogleScript();
      };
    } else {
      waitForGoogleScript();
    }

    function waitForGoogleScript(tries = 0): void {
      if (window.google && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: CredentialResponse) => {
            const tokenId = response.credential;

            try {
              const res = await fetch(
                // Was hardcoded to the production onrender.com URL, which
                // meant this specifically worked in production but broke
                // local dev - now uses the same env-driven base URL as the
                // rest of the app instead of a URL that's only ever right
                // for one environment.
                `${API_BASE_URL}/api/users/auth/google/auth`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ tokenId }),
                },
              );
              const data = await res.json();
              if (!res.ok) {
                setErrorMessage(data.message || "Google login failed.");
                return;
              }

              if (data.data && data.data.user) {
                localStorage.setItem("email", data.data.user.email);
                localStorage.setItem("role", data.data.user.role);
              }
              localStorage.setItem("token", data.token);
              setErrorMessage("");
              navigate("/otp");
            } catch {
              setErrorMessage("Failed to login with Google.");
            }
          },
        });

        const googleBtnDiv = document.getElementById("google-login-btn");
        if (googleBtnDiv) {
          window.google.accounts.id.renderButton(googleBtnDiv, {
            theme: "outline",
            size: "large",
            width: "100%",
            // "Continue with Google" - reads naturally after the "OR"
            // divider above it, in English.
            text: "continue_with",
          });
          window.google.accounts.id.prompt();
        } else {
          setErrorMessage("Google button div not found!");
        }
      } else if (tries < 50) {
        setTimeout(() => waitForGoogleScript(tries + 1), 100);
      } else {
        setErrorMessage("Google script failed to load.");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      // Was hardcoded to http://localhost:5000 - the actual, literal login
      // form submission was unreachable from the real deployed site (a
      // user's browser has no way to reach "their own machine's port
      // 5000"), only ever working by coincidence during local dev.
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.message || "Sign in failed. Please try again.");
        setIsLoading(false);
        return;
      }

      const token = data?.token;
      const role = data?.data?.user?.role;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        setErrorMessage("");
        navigate("/otp");
      } else {
        setErrorMessage("Token not received. Sign in failed.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message.includes("Failed to fetch")
            ? "Network error. Please check your connection."
            : "An unexpected error occurred.",
        );
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // h-dvh, not h-screen: 100vh runs past the actually-visible area on
    // a phone with the address bar showing, which combined with
    // overflow-hidden here could clip the submit button below the fold
    // until the chrome auto-hides. 100dvh tracks the real visible
    // viewport instead.
    <div className="flex flex-col h-dvh overflow-hidden">
      {/* Header Section - was its own hand-rolled header with a broken
          "About Hub" link (/about doesn't exist - the real route is
          /Hub-information), plain <a> tags that force a full page reload
          on every click instead of client-side navigation, and no mobile
          menu at all. The shared Navbar already solves all three and is
          what every other public route uses - no reason this one page
          needed its own. */}
      <Navbar />

      {/* h-dvh + overflow-hidden on the root above, plus overflow-y-auto
          on AuthPageMain's form column, mean the page itself never scrolls
          on any device - only the form column scrolls internally if its
          content is ever taller than the space left. AuthPageMain is
          shared across Login/SignUp/OTP/Forgot Password so all four auth
          pages stay visually identical (one background, not a photo next
          to a separately-colored form column) instead of drifting apart. */}
      <AuthPageMain>
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center mb-2">
              <h1 className="text-2xl font-bold text-primary whitespace-nowrap">
                Sign In to Your Portal
              </h1>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-center text-sm">
                  {errorMessage}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-ink-muted text-sm font-medium mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2.5 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-ink-muted text-sm font-medium mb-1.5">
                  Password
                </label>
                <PasswordInput
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition-colors duration-200 shadow-lg"
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="flex justify-between items-center">
              <label className="flex items-center text-ink-muted">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-primary rounded focus:ring-primary"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-primary hover:text-secondary hover:underline text-sm font-medium"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-ink-muted text-xs tracking-wide">
                  OR
                </span>
              </div>
            </div>

            <div id="google-login-btn" className="w-full"></div>
          </form>
        </div>
      </AuthPageMain>
    </div>
  );
};

export default LoginPage;
