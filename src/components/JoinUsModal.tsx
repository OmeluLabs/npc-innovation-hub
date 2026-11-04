// src/components/JoinUsModal.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { submitMembershipApplication } from "../api/applicationService";
import { APPLICATION_GENDERS } from "../types/application.types";
import type {
  ApplicationGender,
  MembershipApplicationFormValues,
} from "../types/application.types";

interface JoinUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "error";
type ErrorKind = "duplicate" | "generic";
type FieldErrors = Partial<
  Record<keyof MembershipApplicationFormValues, string>
>;

const INITIAL_FORM: MembershipApplicationFormValues = {
  fullName: "",
  email: "",
  githubUrl: "",
  skills: [],
  phoneNumber: "",
  gender: "",
  strengths: "",
  weaknesses: "",
  applicationLetter: null,
  image: null,
};

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PDF_EXTENSION_RE = /\.pdf$/i;
const IMAGE_EXTENSION_RE = /\.(jpe?g|png|gif)$/i;

export const isValidEmail = (value: string): boolean =>
  EMAIL_RE.test(value.trim());

export const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const isValidPdfFile = (file: File | null): boolean => {
  if (!file) return false;
  return (
    PDF_EXTENSION_RE.test(file.name) &&
    file.size > 0 &&
    file.size <= MAX_FILE_SIZE_BYTES
  );
};

export const isValidImageFile = (file: File | null): boolean => {
  if (!file) return false;
  return (
    IMAGE_EXTENSION_RE.test(file.name) &&
    file.size > 0 &&
    file.size <= MAX_FILE_SIZE_BYTES
  );
};

export const getApplicationFormErrors = (
  form: MembershipApplicationFormValues,
): FieldErrors => {
  const errors: FieldErrors = {};

  if (!form.fullName.trim()) errors.fullName = "Full name is required";

  if (!form.email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(form.email))
    errors.email = "Enter a valid email address";

  if (!form.githubUrl.trim()) errors.githubUrl = "GitHub URL is required";
  else if (!isValidHttpUrl(form.githubUrl))
    errors.githubUrl = "Enter a valid URL starting with http:// or https://";

  if (!form.skills.length) errors.skills = "Add at least one skill";

  if (!form.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";

  if (!form.gender) errors.gender = "Select a gender";
  else if (!APPLICATION_GENDERS.includes(form.gender as ApplicationGender))
    errors.gender = "Select a valid gender";

  if (!form.strengths.trim()) errors.strengths = "Tell us about your strengths";
  if (!form.weaknesses.trim())
    errors.weaknesses = "Tell us about your weaknesses";

  if (!form.applicationLetter)
    errors.applicationLetter = "Attach your application letter (PDF)";
  else if (!isValidPdfFile(form.applicationLetter))
    errors.applicationLetter = "Application letter must be a PDF under 5MB";

  if (!form.image) errors.image = "Attach a profile photo";
  else if (!isValidImageFile(form.image))
    errors.image = "Photo must be a JPG, PNG or GIF under 5MB";

  return errors;
};

const buildApplicationFormData = (
  form: MembershipApplicationFormValues,
): FormData => {
  const data = new FormData();
  data.append("fullName", form.fullName.trim());
  data.append("email", form.email.trim());
  data.append("githubUrl", form.githubUrl.trim());
  data.append("skills", JSON.stringify(form.skills));
  data.append("phoneNumber", form.phoneNumber.trim());
  data.append("gender", form.gender);
  data.append("strengths", form.strengths.trim());
  data.append("weaknesses", form.weaknesses.trim());
  if (form.applicationLetter)
    data.append("applicationLetter", form.applicationLetter);
  if (form.image) data.append("image", form.image);
  return data;
};

const formatFileSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const KEYFRAMES = `
  @keyframes jumFadeIn   { from { opacity: 0 } to { opacity: 1 } }
  @keyframes jumSlideUp  { from { opacity:0; transform: translateY(28px) scale(.97) }
                           to   { opacity:1; transform: translateY(0)    scale(1)   } }
  @keyframes jumSuccessPop {
    0%   { transform: scale(.7);    opacity: 0 }
    60%  { transform: scale(1.08);             }
    100% { transform: scale(1);     opacity: 1 }
  }
  @keyframes jumSpin { to { transform: rotate(360deg) } }

  .jum-anim-fadeIn  { animation: jumFadeIn   .25s ease          both }
  .jum-anim-slideUp { animation: jumSlideUp  .32s cubic-bezier(.22,.61,.36,1) both }
  .jum-anim-success { animation: jumSuccessPop .4s cubic-bezier(.22,.61,.36,1) both }
  .jum-anim-spin    { animation: jumSpin .7s linear infinite }

  .jum-close-btn:hover { transform: rotate(90deg) }

  .jum-modal-scroll::-webkit-scrollbar       { width: 5px }
  .jum-modal-scroll::-webkit-scrollbar-track { background: rgb(var(--color-surface-muted)) }
  .jum-modal-scroll::-webkit-scrollbar-thumb { background: rgb(var(--color-accent)); border-radius: 99px }
`;

const baseInput =
  "w-full font-sans text-sm text-primary bg-surface-muted border-[1.5px] border-line rounded-xl px-3.5 py-2.5 outline-none " +
  "transition-all duration-200 ease-in-out placeholder:text-ink-muted " +
  "focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 " +
  "hover:border-accent";

const errorInput =
  "border-red-600 bg-red-50 focus:border-red-600 focus:ring-red-100";

const JoinUsModal: React.FC<JoinUsModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] =
    useState<MembershipApplicationFormValues>(INITIAL_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind>("generic");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadPercent, setUploadPercent] = useState(0);
  const [skillInput, setSkillInput] = useState("");
  const [touched, setTouched] = useState<
    Partial<Record<keyof MembershipApplicationFormValues, boolean>>
  >({});

  const overlayRef = useRef<HTMLDivElement>(null);
  const letterInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const timer = setTimeout(() => {
        setForm(INITIAL_FORM);
        setStatus("idle");
        setErrorKind("generic");
        setErrorMsg("");
        setSuccessMsg("");
        setUploadPercent(0);
        setSkillInput("");
        setTouched({});
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const errors = useMemo(() => getApplicationFormErrors(form), [form]);

  const getError = (field: keyof MembershipApplicationFormValues): string =>
    touched[field] ? errors[field] || "" : "";

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: keyof MembershipApplicationFormValues) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value || form.skills.includes(value)) {
      setSkillInput("");
      return;
    }
    setForm((prev) => ({ ...prev, skills: [...prev.skills, value] }));
    setSkillInput("");
    setTouched((prev) => ({ ...prev, skills: true }));
  };

  const removeSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, applicationLetter: file }));
    setTouched((prev) => ({ ...prev, applicationLetter: true }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, image: file }));
    setTouched((prev) => ({ ...prev, image: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      githubUrl: true,
      skills: true,
      phoneNumber: true,
      gender: true,
      strengths: true,
      weaknesses: true,
      applicationLetter: true,
      image: true,
    });
    if (Object.keys(errors).length > 0) return;

    setStatus("loading");
    setErrorMsg("");
    setUploadPercent(0);
    try {
      const formData = buildApplicationFormData(form);
      const response = await submitMembershipApplication(
        formData,
        setUploadPercent,
      );
      setSuccessMsg(response.message);
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      const apiErr = err as { statusCode?: number; message?: string };
      if (apiErr.statusCode === 409) {
        setErrorKind("duplicate");
        setErrorMsg(
          apiErr.message ||
            "An application from this email is already pending review",
        );
      } else {
        setErrorKind("generic");
        setErrorMsg(
          apiErr.message || "Something went wrong. Please try again.",
        );
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="jum-title"
        className="jum-anim-fadeIn fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{
          background: "rgb(var(--color-primary) / 0.8)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          className="jum-modal-scroll jum-anim-slideUp relative w-full max-w-[680px] max-h-[92vh] overflow-y-auto bg-white rounded-[20px]"
          style={{
            boxShadow:
              "0 32px 80px rgb(var(--color-primary) / 0.22), 0 8px 24px rgb(var(--color-primary) / 0.12)",
          }}
        >
          {/* Header */}
          <div
            className="relative overflow-hidden px-9 pt-8 pb-7 rounded-t-[20px]"
            style={{
              background:
                "linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-secondary)) 100%)",
            }}
          >
            <span className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/[.06]" />
            <span className="pointer-events-none absolute -bottom-14 left-8 w-36 h-36 rounded-full bg-white/[.04]" />

            <button
              onClick={onClose}
              aria-label="Close modal"
              type="button"
              className="jum-close-btn absolute top-5 right-5 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/[.14] text-white text-sm border-0 cursor-pointer transition-all duration-200 hover:bg-white/25"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>

            <p className="text-accent text-[0.72rem] font-medium tracking-[.16em] uppercase mb-1.5">
              NPC Innovation Hub
            </p>
            <h2
              id="jum-title"
              className="text-white font-extrabold text-[1.75rem] leading-[1.15] mb-1.5"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Join the Hub
            </h2>
            <p className="text-white/70 text-sm leading-[1.55] max-w-[380px] m-0">
              Tell us about yourself and attach your application letter — we'll
              review it and get back to you.
            </p>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 px-9 py-12 text-center">
              <div
                className="jum-anim-success flex items-center justify-center w-[72px] h-[72px] rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-secondary)))",
                  boxShadow: "0 8px 24px rgb(var(--color-primary) / 0.3)",
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
                className="text-primary text-[1.5rem] font-extrabold m-0"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Application Submitted!
              </h3>
              <p className="text-ink-muted text-sm leading-[1.6] max-w-[380px] m-0">
                {successMsg ||
                  "Application submitted successfully. We will review it and get back to you."}
              </p>
              <button
                onClick={onClose}
                type="button"
                className="mt-2 px-7 py-2.5 rounded-full border-2 border-primary bg-transparent text-primary text-sm font-bold cursor-pointer transition-all duration-200 hover:bg-primary hover:text-white active:scale-95"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Close
              </button>
            </div>
          ) : (
            <form className="px-9 pt-7 pb-8" onSubmit={handleSubmit} noValidate>
              <SectionLabel>Personal Information</SectionLabel>
              <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
                <Field
                  id="jum-full-name"
                  label="Full Name"
                  required
                  error={getError("fullName")}
                >
                  <input
                    id="jum-full-name"
                    className={`${baseInput} ${getError("fullName") ? errorInput : ""}`}
                    type="text"
                    name="fullName"
                    placeholder="Jane Doe"
                    value={form.fullName}
                    onChange={handleChange}
                    onBlur={() => handleBlur("fullName")}
                    autoComplete="name"
                  />
                </Field>
                <Field
                  id="jum-email"
                  label="Email Address"
                  required
                  error={getError("email")}
                >
                  <input
                    id="jum-email"
                    className={`${baseInput} ${getError("email") ? errorInput : ""}`}
                    type="email"
                    name="email"
                    placeholder="jane.doe@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    autoComplete="email"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1 mt-4">
                <Field
                  id="jum-phone"
                  label="Phone Number"
                  required
                  error={getError("phoneNumber")}
                >
                  <input
                    id="jum-phone"
                    className={`${baseInput} ${getError("phoneNumber") ? errorInput : ""}`}
                    type="tel"
                    name="phoneNumber"
                    placeholder="+250781234567"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    onBlur={() => handleBlur("phoneNumber")}
                    autoComplete="tel"
                  />
                </Field>
                <Field
                  id="jum-gender"
                  label="Gender"
                  required
                  error={getError("gender")}
                >
                  <select
                    id="jum-gender"
                    className={`${baseInput} cursor-pointer ${getError("gender") ? errorInput : ""}`}
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    onBlur={() => handleBlur("gender")}
                  >
                    <option value="">Select gender</option>
                    {APPLICATION_GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Divider />

              <SectionLabel>Links &amp; Skills</SectionLabel>
              <Field
                id="jum-github"
                label="GitHub URL"
                required
                error={getError("githubUrl")}
              >
                <input
                  id="jum-github"
                  className={`${baseInput} ${getError("githubUrl") ? errorInput : ""}`}
                  type="url"
                  name="githubUrl"
                  placeholder="https://github.com/username"
                  value={form.githubUrl}
                  onChange={handleChange}
                  onBlur={() => handleBlur("githubUrl")}
                  autoComplete="url"
                />
              </Field>

              <div className="mt-4">
                <Field
                  id="jum-skill-input"
                  label="Add a skill"
                  required
                  error={getError("skills")}
                >
                  <div className="flex gap-2">
                    <input
                      id="jum-skill-input"
                      className={baseInput}
                      type="text"
                      placeholder="e.g. React, Node.js…"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onBlur={() => handleBlur("skills")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-secondary transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </Field>
                {form.skills.length > 0 && (
                  <ul
                    aria-label="Selected skills"
                    className="flex flex-wrap gap-2 mt-3 list-none p-0 m-0"
                  >
                    {form.skills.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-center gap-1.5 bg-line text-primary text-xs font-semibold px-3 py-1.5 rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          aria-label={`Remove ${skill}`}
                          onClick={() => removeSkill(skill)}
                          className="text-primary/60 hover:text-red-600"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">Remove skill</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Divider />

              <SectionLabel>About You</SectionLabel>
              <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
                <Field
                  id="jum-strengths"
                  label="Your Strengths"
                  required
                  error={getError("strengths")}
                >
                  <textarea
                    id="jum-strengths"
                    className={`${baseInput} resize-y min-h-[90px] leading-[1.55] ${getError("strengths") ? errorInput : ""}`}
                    name="strengths"
                    placeholder="What are you good at?"
                    value={form.strengths}
                    onChange={handleChange}
                    onBlur={() => handleBlur("strengths")}
                  />
                </Field>
                <Field
                  id="jum-weaknesses"
                  label="Your Weaknesses"
                  required
                  error={getError("weaknesses")}
                >
                  <textarea
                    id="jum-weaknesses"
                    className={`${baseInput} resize-y min-h-[90px] leading-[1.55] ${getError("weaknesses") ? errorInput : ""}`}
                    name="weaknesses"
                    placeholder="Where do you want to grow?"
                    value={form.weaknesses}
                    onChange={handleChange}
                    onBlur={() => handleBlur("weaknesses")}
                  />
                </Field>
              </div>

              <Divider />

              <SectionLabel>Documents</SectionLabel>
              <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
                <Field
                  id="jum-letter"
                  label="Application Letter (PDF)"
                  required
                  error={getError("applicationLetter")}
                >
                  <button
                    type="button"
                    onClick={() => letterInputRef.current?.click()}
                    className={`${baseInput} text-left ${getError("applicationLetter") ? errorInput : ""}`}
                  >
                    {form.applicationLetter
                      ? `${form.applicationLetter.name} (${formatFileSize(form.applicationLetter.size)})`
                      : "Click to choose a PDF file"}
                  </button>
                  <input
                    id="jum-letter"
                    ref={letterInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleLetterChange}
                  />
                </Field>

                <Field
                  id="jum-photo"
                  label="Profile Photo"
                  required
                  error={getError("image")}
                >
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className={`${baseInput} text-left ${getError("image") ? errorInput : ""}`}
                  >
                    {form.image
                      ? `${form.image.name} (${formatFileSize(form.image.size)})`
                      : "Click to choose a photo"}
                  </button>
                  <input
                    id="jum-photo"
                    ref={imageInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </Field>
              </div>

              {status === "error" && errorMsg && errorKind === "duplicate" && (
                <div className="flex items-start gap-2.5 mt-5 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl text-[0.83rem] text-amber-800">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="flex-shrink-0 mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 2" />
                  </svg>
                  <div>
                    <p className="font-bold m-0">You've already applied</p>
                    <p className="m-0 mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              {status === "error" && errorMsg && errorKind === "generic" && (
                <div className="flex items-center gap-2 mt-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[0.83rem] text-red-600">
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

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={[
                    "relative w-full py-3.5 rounded-xl border-0 text-white text-[0.95rem] font-bold tracking-wide overflow-hidden",
                    "transition-all duration-200 cursor-pointer select-none",
                    status === "loading"
                      ? "opacity-55 cursor-not-allowed"
                      : "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(var(--color-primary)/0.35)] active:translate-y-0",
                  ].join(" ")}
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    background:
                      "linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-secondary)))",
                    boxShadow: "0 4px 16px rgb(var(--color-primary) / 0.3)",
                  }}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="jum-anim-spin inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                      Uploading… {uploadPercent}%
                    </span>
                  ) : (
                    "Submit Application →"
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

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <p
    className="text-[0.7rem] font-bold tracking-[.14em] uppercase text-primary/45 mb-4 m-0"
    style={{ fontFamily: "'Syne', sans-serif" }}
  >
    {children}
  </p>
);

const Divider = () => (
  <div
    className="my-6 h-px"
    style={{
      background: "linear-gradient(90deg, rgb(var(--color-line)), transparent)",
    }}
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
      className="text-[0.8rem] font-medium text-primary tracking-[.01em]"
    >
      {label}
      {required && <span className="text-red-600 ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <span className="text-[0.75rem] text-red-600 -mt-0.5 flex items-center gap-1">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        {error}
      </span>
    )}
  </div>
);

export default JoinUsModal;
