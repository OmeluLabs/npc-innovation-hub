// src/pages/add-project-page/AddProject.tsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  FileText,
  Globe,
  Github,
  ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { createProject } from "../../api/member/project.api";

interface FormState {
  title: string;
  description: string;
  link: string;
  demo: string;
  image: File | null;
}

const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const imageRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    link: "",
    demo: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    if (form.link) payload.append("link", form.link.trim());
    if (form.demo) payload.append("demo", form.demo.trim());
    if (form.image) payload.append("image", form.image);

    setSubmitting(true);
    setError(null);

    try {
      await createProject(payload);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/projects"), 1800);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to create project. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-primary">Project Created!</h2>
        <p className="text-sm text-ink-muted">
          Redirecting you to your projects…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-primary mb-6 transition"
      >
        <ArrowLeft size={15} />
        Back to Projects
      </button>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-line overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-5">
          <h1 className="text-xl font-bold text-white">Add New Project</h1>
          <p className="text-accent text-sm mt-0.5">
            Share your work with the Innovation Hub community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Project Image */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Project Image
            </label>
            <div
              className="relative border-2 border-dashed border-line rounded-xl overflow-hidden cursor-pointer hover:border-primary transition-colors group"
              onClick={() => imageRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative h-44">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="reveal-on-hover absolute inset-0 bg-black/30 flex items-center justify-center">
                    <p className="text-white text-sm font-medium">
                      Change image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center gap-2 text-ink-muted">
                  <ImageIcon size={28} />
                  <p className="text-sm">Click to upload project image</p>
                  <p className="text-xs text-ink-muted">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">
              Project Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. AI Chatbot for Customer Support"
                required
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what this project does, the tech stack used, and any key highlights…"
              rows={4}
              required
              className="w-full px-4 py-2.5 text-sm border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
            />
          </div>

          {/* Links row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Repository URL
              </label>
              <div className="relative">
                <Github
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                />
                <input
                  name="link"
                  type="url"
                  value={form.link}
                  onChange={handleChange}
                  placeholder="https://github.com/…"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Live Demo URL
              </label>
              <div className="relative">
                <Globe
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                />
                <input
                  name="demo"
                  type="url"
                  value={form.demo}
                  onChange={handleChange}
                  placeholder="https://your-app.vercel.app"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="dialog-actions pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-medium text-ink-muted bg-surface-muted hover:bg-line rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary rounded-lg transition disabled:opacity-60 shadow-sm"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Upload size={15} />
                  Publish Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
