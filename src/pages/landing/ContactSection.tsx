// src/pages/landing/ContactSection.tsx
//
// The actual "how to reach us" content - a navy info card on the left
// (location/phone/email, matching the /hire-us form's existing contact
// card layout) and, on the right, a real working message form plus a
// chat option. Used identically both inline on Home (as part of the
// single-page scroll story) and on the standalone /contact-us page (see
// ContactUs.tsx) - same reuse pattern as AboutIntro/MissionSection.
//
// The message form used to be a mailto: form (action={HUB_EMAIL_HREF},
// encType="text/plain") - it opened the VISITOR's own email client with
// the fields pre-filled, so the site had no way to know whether anything
// was actually sent, and couldn't have replied with a confirmation email
// even in principle. Now a real POST to /api/contact (see
// api/contactService.ts): the backend stores the message for Admin review
// and emails the submitter a confirmation at the address they typed -
// mirrors HireUsModal.tsx's loading/success/error state pattern. The
// direct mailto link in the info card on the left is untouched - it's
// still a legitimate fallback for anyone who'd rather email directly.
import { useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, MessageCircle, Send } from "lucide-react";
import { submitContactMessage } from "../../api/contactService";
import { OPEN_ASSISTANT_CHAT_EVENT } from "../../components/assistant/AssistantWidget";

const HUB_LOCATION = "Musanze, North, Rwanda";
const HUB_PHONE = "+250 783 330 443";
const HUB_PHONE_HREF = "tel:+250783330443";
const HUB_EMAIL = "npcinnovationhub2024@gmail.com";
const HUB_EMAIL_HREF = `mailto:${HUB_EMAIL}?subject=${encodeURIComponent("Message from the NPC Innovation Hub website")}`;

type SubmitStatus = "idle" | "loading" | "success" | "error";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    try {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 md:px-8">
      <div className="flex flex-col md:flex-row rounded-xl shadow-lg overflow-hidden">
        {/* Left - Info card */}
        <div className="bg-primary text-white p-8 md:w-2/5 flex flex-col">
          <h3 className="text-2xl font-bold mb-3">Get in Touch</h3>
          <p className="text-white/70 mb-8">
            Have a question about NPC Innovation Hub, a project, or joining us?
            Reach out directly, or send a message and we&apos;ll get back to
            you.
          </p>

          <div className="space-y-6 mt-auto">
            <div className="flex items-start gap-3">
              <MapPin
                className="w-5 h-5 text-primary mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-sm">Our Location</p>
                <p className="text-white/70 text-sm">{HUB_LOCATION}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone
                className="w-5 h-5 text-primary mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-sm">Telephone</p>
                <a
                  href={HUB_PHONE_HREF}
                  className="text-white/70 text-sm hover:text-white hover:underline"
                >
                  {HUB_PHONE}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail
                className="w-5 h-5 text-primary mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-sm">Email Address</p>
                <a
                  href={HUB_EMAIL_HREF}
                  className="text-white/70 text-sm hover:text-white hover:underline"
                >
                  {HUB_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Message form + chat option */}
        <div className="bg-white p-8 md:w-3/5 flex flex-col gap-6">
          {status === "success" ? (
            /* ── Success state - mirrors HireUsModal.tsx's own success
                panel (navy checkmark badge, confirmation copy naming the
                submitted email, a way to send another). ── */
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-secondary)))",
                  boxShadow: "0 8px 24px rgb(var(--color-primary) / 0.3)",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-primary text-2xl font-bold">Message Sent!</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                Thank you for reaching out. We&apos;ve sent a confirmation to{" "}
                <strong className="text-primary">{email}</strong> - our team
                will review your message and get back to you as soon as
                possible.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-1 px-6 py-2.5 rounded-full border-2 border-primary bg-transparent text-primary text-sm font-bold transition-all hover:bg-primary hover:text-white"
              >
                Send another message
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Send a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={status === "loading"}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={status === "loading"}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    disabled={status === "loading"}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none resize-y focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                  />
                </div>

                {status === "error" && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
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
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6 flex items-start gap-3">
            <MessageCircle
              className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-primary text-sm">
                Prefer to chat?
              </p>
              <p className="text-gray-600 text-sm mb-1">
                Get an instant answer from our assistant.
              </p>
              {/* The assistant is a floating widget now (see
                  Navbar.tsx -> AssistantWidget), not its own page - this
                  opens it right here instead of navigating away. */}
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new Event(OPEN_ASSISTANT_CHAT_EVENT))
                }
                className="text-primary font-semibold text-sm hover:underline"
              >
                Start a chat →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
