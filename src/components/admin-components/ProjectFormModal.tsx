/**
 * ProjectFormModal Component
 * Modal for creating and editing projects
 */

import React from "react";
import { useState, useEffect } from "react";
import type { Project } from "../../types/project.types";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  initialData?: Project | null;
  isLoading?: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  demo?: string;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    demo: "",
    techStack: "",
    status: "In Progress",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        image: initialData.image,
        link: initialData.link,
        demo: initialData.demo,
        techStack: (initialData.techStack ?? []).join(", "),
        status: initialData.status ?? "In Progress",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        image: "",
        link: "",
        demo: "",
        techStack: "",
        status: "In Progress",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = "Please enter a valid URL";
    }

    if (!formData.link.trim()) {
      newErrors.link = "GitHub link is required";
    } else if (!isValidUrl(formData.link)) {
      newErrors.link = "Please enter a valid URL";
    }

    if (!formData.demo.trim()) {
      newErrors.demo = "Demo link is required";
    } else if (!isValidUrl(formData.demo)) {
      newErrors.demo = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="dialog-panel relative bg-white rounded-2xl shadow-2xl max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-mist-300 px-4 sm:px-8 py-5 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-2xl font-bold text-navy-800 min-w-0 break-words">
            {initialData ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={onClose}
            className="text-mist-400 hover:text-mist-600 transition-colors"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 px-4 sm:px-8 py-5 sm:py-6 overflow-y-auto"
        >
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-4 py-2.5 border ${
                  errors.title ? "border-red-500" : "border-mist-300"
                } rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all`}
                placeholder="E.g., Modern E-Commerce Platform"
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className={`w-full px-4 py-2.5 border ${
                  errors.description ? "border-red-500" : "border-mist-300"
                } rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all resize-none`}
                placeholder="Describe your project..."
                disabled={isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Tech stack + status (shown as tags and a badge on the public Projects page) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-navy-800 mb-2">
                  Tech stack (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) =>
                    setFormData({ ...formData, techStack: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
                  placeholder="React, Node.js, PostgreSQL"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all bg-white"
                  disabled={isLoading}
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-2">
                Project Image URL *
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className={`w-full px-4 py-2.5 border ${
                  errors.image ? "border-red-500" : "border-mist-300"
                } rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all`}
                placeholder="https://example.com/image.jpg"
                disabled={isLoading}
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            {/* GitHub Link */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-2">
                GitHub Repository URL *
              </label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className={`w-full px-4 py-2.5 border ${
                  errors.link ? "border-red-500" : "border-mist-300"
                } rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all`}
                placeholder="https://github.com/username/project"
                disabled={isLoading}
              />
              {errors.link && (
                <p className="mt-1 text-sm text-red-600">{errors.link}</p>
              )}
            </div>

            {/* Demo Link */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-2">
                Live Demo URL *
              </label>
              <input
                type="text"
                value={formData.demo}
                onChange={(e) =>
                  setFormData({ ...formData, demo: e.target.value })
                }
                className={`w-full px-4 py-2.5 border ${
                  errors.demo ? "border-red-500" : "border-mist-300"
                } rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all`}
                placeholder="https://project-demo.vercel.app"
                disabled={isLoading}
              />
              {errors.demo && (
                <p className="mt-1 text-sm text-red-600">{errors.demo}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="dialog-actions flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-navy-800 bg-mist-100 rounded-lg hover:bg-mist-200 transition-all font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-white bg-navy-800 rounded-lg hover:bg-navy-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                  Saving...
                </>
              ) : initialData ? (
                "Update Project"
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
