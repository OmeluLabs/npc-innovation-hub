// src/components/resources/ProjectViewModal.tsx
import React from "react";
import { X, ExternalLink, Github, Calendar, User, Shield } from "lucide-react";
import type { MemberProject } from "../../api/member/project.api";

interface Props {
  project: MemberProject | null;
  onClose: () => void;
}

const ProjectViewModal: React.FC<Props> = ({ project, onClose }) => {
  if (!project) return null;

  const formattedDate = new Date(project.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image banner */}
        {project.image && (
          <div className="relative h-52 rounded-t-2xl overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="p-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-primary leading-tight">
              {project.title}
            </h2>
            {!project.image && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-muted text-ink-muted hover:bg-line transition shrink-0"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Description */}
          <p className="text-ink-muted text-sm leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Meta info */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <User size={14} className="shrink-0" />
              <span>{project.owner || "Unknown Owner"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <Shield size={14} className="shrink-0" />
              <span>{project.ownerRole}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <Calendar size={14} className="shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Links */}
          {(project.link || project.demo) && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-line">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary transition"
                >
                  <Github size={15} />
                  Source Code
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary transition"
                >
                  <ExternalLink size={15} />
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectViewModal;
