import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { API_BASE_URL } from "../../config/env";

type FormData = {
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  job_title: string;
  country: string;
  message: string;
  consent: boolean;
};

type SubmitStatus = {
  success: boolean;
  message: string;
} | null;

function LetTalk() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    first_name: "",
    last_name: "",
    company_name: "",
    job_title: "",
    country: "",
    message: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      setSubmitStatus({
        success: false,
        message: "Please agree to the terms and conditions",
      });
      return;
    }

    const requiredFields: (keyof FormData)[] = [
      "email",
      "first_name",
      "last_name",
      "company_name",
      "job_title",
      "country",
      "message",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setSubmitStatus({
        success: false,
        message: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Was hardcoded to http://localhost:5000 - the real Hire Us contact
      // form was unreachable from the deployed site, only ever working
      // during local dev by coincidence.
      const response = await fetch(`${API_BASE_URL}/api/hire-us`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Your inquiry has been submitted successfully!",
        });
        setFormData({
          email: "",
          first_name: "",
          last_name: "",
          company_name: "",
          job_title: "",
          country: "",
          message: "",
          consent: false,
        });
      } else {
        throw new Error(data.message || "Failed to submit inquiry");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred while submitting your inquiry";
      setSubmitStatus({
        success: false,
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="hire-us-form"
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-surface-muted p-4 md:p-8 scroll-mt-20"
    >
      {/* Contact Info Section */}
      <div className="bg-primary text-white rounded-xl shadow-lg p-8 w-full max-w-md mb-8 md:mb-0 md:mr-8">
        <div className="flex items-center mb-8">
          <svg
            className="w-12 h-12 mr-4 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <h2 className="text-3xl font-bold">Let's talk</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-start">
            <svg
              className="w-10 h-10 mr-4 text-accent mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657m10.614-10.614L13.414 2.9a1.998 1.998 0 00-2.828 0L6.343 6.043m10.614 10.614A8.967 8.967 0 0012 21.5c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z"
              />
            </svg>
            <div>
              <h3 className="text-xl font-semibold mb-1">Our location</h3>
              <p className="text-accent">Musanze, North, Rwanda</p>
            </div>
          </div>

          <div className="flex items-start">
            <svg
              className="w-10 h-10 mr-4 text-accent mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"
              />
            </svg>
            <div>
              <h3 className="text-xl font-semibold mb-1">Email address</h3>
              <a
                href="mailto:kingcoders@programmers.com"
                className="text-accent hover:underline"
              >
                kingcoders@programmers.com
              </a>
            </div>
          </div>

          <div className="flex items-start">
            <svg
              className="w-10 h-10 mr-4 text-accent mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.135a11.042 11.042 0 005.516 5.516l1.135-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
              />
            </svg>
            <div>
              <h3 className="text-xl font-semibold mb-1">Telephone</h3>
              <a
                href="tel:+250783330443"
                className="text-accent hover:underline"
              >
                +250 783 330 443
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Get in touch
        </h2>

        {submitStatus && (
          <div
            className={`mb-6 p-4 rounded-lg ${submitStatus.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {submitStatus.message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-ink-muted mb-1"
              >
                First Name*
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-line rounded-lg focus:ring-secondary focus:border-secondary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-ink-muted mb-1"
              >
                Last Name*
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-line rounded-lg focus:ring-secondary focus:border-secondary"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-ink-muted mb-1"
            >
              Work Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-line rounded-lg focus:ring-secondary focus:border-secondary"
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium text-ink-muted mb-1"
              >
                Company Name*
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-line rounded-lg focus:ring-secondary focus:border-secondary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="job_title"
                className="block text-sm font-medium text-ink-muted mb-1"
              >
                Job Title*
              </label>
              <input
                type="text"
                id="job_title"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-line rounded-lg focus:ring-secondary focus:border-secondary"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-ink-muted mb-1"
            >
              Country*
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-line rounded-lg focus:ring-secondary focus:border-secondary"
              required
            >
              <option value="">Select your country</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-ink-muted mb-1"
            >
              Your Message*
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border border-line rounded-lg focus:ring-secondary focus:border-secondary"
              required
            />
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="h-5 w-5 text-secondary rounded border-line focus:ring-secondary mr-3 mt-1"
              required
            />
            <label htmlFor="consent" className="text-sm text-ink-muted">
              I agree to the processing of my personal data in accordance with
              your privacy policy.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 bg-secondary text-white font-semibold rounded-lg hover:bg-primary transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Inquiry"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LetTalk;
