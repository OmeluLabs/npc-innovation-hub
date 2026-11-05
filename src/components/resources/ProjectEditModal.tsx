// src/components/resources/ProjectEditModal.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Github,
  Globe,
  FileText,
  ImageIcon,
  Loader2,
  Upload,
} from "lucide-react";
import type { MemberProject } from "../../api/member/project.api";

interface Props {
  project: MemberProject;
  onClose: () => void;
  onSave: (id: string, payload: FormData) => Promise<void>;
}

interface FormState {
  title: string;
  description: string;
  link: string;
  demo: string;
  image: File | null;
}

const ProjectEditModal: React.FC<Props> = ({ project, onClose, onSave }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>({
    title: project.title,
    description: project.description,
    link: project.link ?? "",
    demo: project.demo ?? "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    project.image ?? null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

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
      await onSave(project.id, payload);
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update project.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="text-lg font-bold text-primary">Edit Project</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-muted text-ink-muted hover:bg-line transition"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">
              Project Image
            </label>
            <div
              className="relative border-2 border-dashed border-line rounded-xl overflow-hidden cursor-pointer hover:border-primary transition-colors group"
              onClick={() => imageRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative h-36">
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
                <div className="h-36 flex flex-col items-center justify-center gap-2 text-ink-muted">
                  <ImageIcon size={24} />
                  <p className="text-sm">Click to upload a new image</p>
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
              Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
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
              rows={3}
              required
              className="w-full px-4 py-2.5 text-sm border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Repository URL
              </label>
              <div className="relative">
                <Github
                  size={14}
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
                  size={14}
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

          {/* Actions */}
          <div className="dialog-actions flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 text-sm font-medium text-ink-muted bg-surface-muted hover:bg-line rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary rounded-lg transition disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Upload size={14} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEditModal;
