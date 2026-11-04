// src/components/HireUsModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { submitHireInquiry } from "../api/hireService";
import type { HireInquiryPayload } from "../types/hire.types";

interface HireUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_FORM: HireInquiryPayload = {
  first_name: "",
  last_name: "",
  email: "",
  company_name: "",
  job_title: "",
  country: "",
  message: "",
  consent: false,
};

type Status = "idle" | "loading" | "success" | "error";

/* ─── tiny keyframe block (only what Tailwind can't express) ─── */
const KEYFRAMES = `
  @keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 } }
  @keyframes slideUp  { from { opacity:0; transform: translateY(28px) scale(.97) }
                        to   { opacity:1; transform: translateY(0)    scale(1)   } }
  @keyframes successPop {
    0%   { transform: scale(.7);    opacity: 0 }
    60%  { transform: scale(1.08);             }
    100% { transform: scale(1);     opacity: 1 }
  }
  @keyframes spin { to { transform: rotate(360deg) } }

  .anim-fadeIn   { animation: fadeIn   .25s ease          both }
  .anim-slideUp  { animation: slideUp  .32s cubic-bezier(.22,.61,.36,1) both }
  .anim-success  { animation: successPop .4s cubic-bezier(.22,.61,.36,1) both }
  .anim-spin     { animation: spin .7s linear infinite }

  .close-btn:hover { transform: rotate(90deg) }

  /* custom thin scrollbar */
  .modal-scroll::-webkit-scrollbar       { width: 5px }
  .modal-scroll::-webkit-scrollbar-track { background: #f0f4f8 }
  .modal-scroll::-webkit-scrollbar-thumb { background: #c8d8ef; border-radius: 99px }
`;

const HireUsModal: React.FC<HireUsModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<HireInquiryPayload>(INITIAL_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [touched, setTouched] = useState<
    Partial<Record<keyof HireInquiryPayload, boolean>>
  >({});
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setTimeout(() => {
        setForm(INITIAL_FORM);
        setStatus("idle");
        setErrorMsg("");
        setTouched({});
      }, 300);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleBlur = (name: keyof HireInquiryPayload) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  const getError = (field: keyof HireInquiryPayload): string => {
    if (!touched[field]) return "";
    if (field === "email") {
      if (!form.email) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        return "Enter a valid email";
    }
    if (field === "consent") return "";
    const val = form[field];
    if (typeof val === "string" && !val.trim())
      return `${field.replace("_", " ")} is required`;
    return "";
  };

  const isFormValid = (): boolean =>
    !!form.first_name.trim() &&
    !!form.last_name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    !!form.company_name.trim() &&
    !!form.job_title.trim() &&
    !!form.country.trim() &&
    !!form.message.trim() &&
    form.consent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      company_name: true,
      job_title: true,
      country: true,
      message: true,
    });
    if (!isFormValid()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await submitHireInquiry(form);
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorMsg(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  if (!isOpen) return null;

  /* ── reusable field classes ── */
  const baseInput =
    "w-full font-sans text-sm text-[#1a2d4a] bg-[#f5f8fc] border-[1.5px] border-[#dce8f5] rounded-xl px-3.5 py-2.5 outline-none " +
    "transition-all duration-200 ease-in-out placeholder:text-[#a4b5cc] " +
    "focus:border-[#002B56] focus:bg-white focus:ring-2 focus:ring-[#002B56]/10 " +
    "hover:border-[#afc8e8]";

  const errorInput =
    "border-[#e05252] bg-[#fff8f8] focus:border-[#e05252] focus:ring-red-100";

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── Overlay ── */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hum-title"
        className="anim-fadeIn fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{
          background: "rgba(0,18,38,0.72)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* ── Modal card ── */}
        <div
          className="modal-scroll anim-slideUp relative w-full max-w-[680px] max-h-[92vh] overflow-y-auto bg-white rounded-[20px]"
          style={{
            boxShadow:
              "0 32px 80px rgba(0,30,70,.22), 0 8px 24px rgba(0,30,70,.12)",
          }}
        >
          {/* ── Header ── */}
          <div
            className="relative overflow-hidden px-9 pt-8 pb-7 rounded-t-[20px]"
            style={{
              background: "linear-gradient(135deg,#002B56 0%,#003366 100%)",
            }}
          >
            {/* decorative circles */}
            <span className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/[.06]" />
            <span className="pointer-events-none absolute -bottom-14 left-8 w-36 h-36 rounded-full bg-white/[.04]" />

            {/* close btn */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              type="button"
              className="close-btn absolute top-5 right-5 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/[.14] text-white text-sm border-0 cursor-pointer transition-all duration-200 hover:bg-white/25"
            >
              ✕
            </button>

            <p className="text-[#7ec8f5] text-[0.72rem] font-medium tracking-[.16em] uppercase mb-1.5">
              NPC Innovation Hub
            </p>
            <h2
              id="hum-title"
              className="text-white font-extrabold text-[1.75rem] leading-[1.15] mb-1.5"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              This Is the Best Choice You&apos;ve Made
            </h2>
            <p className="text-white/70 text-sm leading-[1.55] max-w-[380px] m-0">
              The smartest choice for your future.
              <br />
              Tell us about your project and we&apos;ll get back to you within
              24 hours.
            </p>
          </div>

          {/* ── Body ── */}
          {status === "success" ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center gap-4 px-9 py-12 text-center">
              <div
                className="anim-success flex items-center justify-center w-[72px] h-[72px] rounded-full"
                style={{
                  background: "linear-gradient(135deg,#002B56,#003366)",
                  boxShadow: "0 8px 24px rgba(0,43,86,.3)",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h3
                className="text-[#002B56] text-[1.5rem] font-extrabold m-0"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Inquiry Submitted!
              </h3>
              <p className="text-[#5a7091] text-sm leading-[1.6] max-w-[320px] m-0">
                Thank you for reaching out. Our team will review your request
                and contact you at{" "}
                <strong className="text-[#002B56]">{form.email}</strong>{" "}
                shortly.
              </p>
              <button
                onClick={onClose}
                type="button"
                className="mt-2 px-7 py-2.5 rounded-full border-2 border-[#002B56] bg-transparent text-[#002B56] text-sm font-bold cursor-pointer transition-all duration-200 hover:bg-[#002B56] hover:text-white active:scale-95"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Close
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <form className="px-9 pt-7 pb-8" onSubmit={handleSubmit} noValidate>
              {/* Personal Info */}
              <SectionLabel>Personal Information</SectionLabel>
              <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
                <Field
                  id="hum-first-name"
                  label="First Name"
                  required
                  error={getError("first_name")}
                >
                  <input
                    id="hum-first-name"
                    className={`${baseInput} ${getError("first_name") ? errorInput : ""}`}
                    type="text"
                    name="first_name"
                    placeholder="John"
                    value={form.first_name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("first_name")}
                    autoComplete="given-name"
                  />
                </Field>
                <Field
                  id="hum-last-name"
                  label="Last Name"
                  required
                  error={getError("last_name")}
                >
                  <input
                    id="hum-last-name"
                    className={`${baseInput} ${getError("last_name") ? errorInput : ""}`}
                    type="text"
                    name="last_name"
                    placeholder="Doe"
                    value={form.last_name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("last_name")}
                    autoComplete="family-name"
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field
                  id="hum-email"
                  label="Email Address"
                  required
                  error={getError("email")}
                >
                  <input
                    id="hum-email"
                    className={`${baseInput} ${getError("email") ? errorInput : ""}`}
                    type="email"
                    name="email"
                    placeholder="john.doe@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    autoComplete="email"
                  />
                </Field>
              </div>

              <Divider />

              {/* Company Details */}
              <SectionLabel>Company Details</SectionLabel>
              <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
                <Field
                  id="hum-company"
                  label="Company Name"
                  required
                  error={getError("company_name")}
                >
                  <input
                    id="hum-company"
                    className={`${baseInput} ${getError("company_name") ? errorInput : ""}`}
                    type="text"
                    name="company_name"
                    placeholder="Acme Corporation"
                    value={form.company_name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("company_name")}
                    autoComplete="organization"
                  />
                </Field>
                <Field
                  id="hum-job-title"
                  label="Job Title"
                  required
                  error={getError("job_title")}
                >
                  <input
                    id="hum-job-title"
                    className={`${baseInput} ${getError("job_title") ? errorInput : ""}`}
                    type="text"
                    name="job_title"
                    placeholder="Chief Technology Officer"
                    value={form.job_title}
                    onChange={handleChange}
                    onBlur={() => handleBlur("job_title")}
                    autoComplete="organization-title"
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field
                  id="hum-country"
                  label="Country"
                  required
                  error={getError("country")}
                >
                  <div className="relative">
                    <select
                      id="hum-country"
                      className={`${baseInput} pr-9 cursor-pointer appearance-none ${getError("country") ? errorInput : ""}`}
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      onBlur={() => handleBlur("country")}
                    >
                      <option value="" className="text-[#a4b5cc]">
                        Select your country
                      </option>
                      {[
                        "Rwanda",
                        "Uganda",
                        "Kenya",
                        "Tanzania",
                        "Ethiopia",
                        "Nigeria",
                        "South Africa",
                        "Ghana",
                        "United States",
                        "United Kingdom",
                        "Canada",
                        "Germany",
                        "France",
                        "Netherlands",
                        "Other",
                      ].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    {/* custom chevron */}
                    <svg
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#667eea]"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <path d="M6 8L1 3h10z" />
                    </svg>
                  </div>
                </Field>
              </div>

              <Divider />

              {/* Project */}
              <SectionLabel>Your Project</SectionLabel>
              <Field
                id="hum-message"
                label="Tell us about your project"
                required
                error={getError("message")}
              >
                <textarea
                  id="hum-message"
                  className={`${baseInput} resize-y min-h-[110px] leading-[1.55] ${getError("message") ? errorInput : ""}`}
                  name="message"
                  placeholder="We are looking for a technology partner to help us develop our new platform…"
                  value={form.message}
                  onChange={handleChange}
                  onBlur={() => handleBlur("message")}
                  maxLength={1000}
                />
                <p className="text-right text-[0.72rem] text-[#a4b5cc] -mt-1">
                  {form.message.length} / 1000
                </p>
              </Field>

              {/* Consent */}
              <div className="mt-5">
                <label className="flex items-start gap-3 px-4 py-3.5 bg-[#f0f6ff] border-[1.5px] border-[#dce8f5] rounded-xl cursor-pointer transition-all duration-200 hover:border-[#002B56] hover:bg-[#e8f1ff] group">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    onChange={handleChange}
                    className="flex-shrink-0 mt-0.5 w-[18px] h-[18px] accent-[#002B56] cursor-pointer"
                  />
                  <span className="text-[0.8rem] text-[#4a6080] leading-[1.55]">
                    I agree to the{" "}
                    <a
                      href="#"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#002B56] no-underline hover:underline transition-colors"
                    >
                      Privacy Policy
                    </a>{" "}
                    and consent to NPC Innovation Hub processing my data to
                    respond to this inquiry.
                  </span>
                </label>
              </div>

              {/* Global error */}
              {status === "error" && errorMsg && (
                <div className="flex items-center gap-2 mt-3 px-4 py-3 bg-[#fff2f2] border border-[#f5c6c6] rounded-xl text-[0.83rem] text-[#c0392b]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="flex-shrink-0"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={status === "loading" || !form.consent}
                  className={[
                    "relative w-full py-3.5 rounded-xl border-0 text-white text-[0.95rem] font-bold tracking-wide overflow-hidden",
                    "transition-all duration-200 cursor-pointer select-none",
                    "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[.08] before:to-transparent before:pointer-events-none",
                    status === "loading" || !form.consent
                      ? "opacity-55 cursor-not-allowed"
                      : "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,43,86,.35)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(0,43,86,.2)]",
                  ].join(" ")}
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    background: "linear-gradient(135deg,#002B56,#003366)",
                    boxShadow: "0 4px 16px rgba(0,43,86,.3)",
                  }}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="anim-spin inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                      Submitting…
                    </span>
                  ) : (
                    "Submit Inquiry →"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

/* ── tiny helper sub-components ── */

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <p
    className="text-[0.7rem] font-bold tracking-[.14em] uppercase text-[#002B56]/45 mb-4 m-0"
    style={{ fontFamily: "'Syne', sans-serif" }}
  >
    {children}
  </p>
);

const Divider = () => (
  <div
    className="my-6 h-px"
    style={{ background: "linear-gradient(90deg,#e2eaf4,transparent)" }}
  />
);

const Field: React.FC<{
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ id, label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="text-[0.8rem] font-medium text-[#2d3f5c] tracking-[.01em]"
    >
      {label}
      {required && <span className="text-[#e05252] ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <span className="text-[0.75rem] text-[#e05252] -mt-0.5 flex items-center gap-1">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        {error}
      </span>
    )}
  </div>
);

export default HireUsModal;
