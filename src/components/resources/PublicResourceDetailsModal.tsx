// src/components/resources/PublicResourceDetailsModal.tsx

import React from "react";
import { X, ExternalLink, Clock, User, Tag, ThumbsUp } from "lucide-react";
import type { Resource } from "../../types/resource.types";

interface PublicResourceDetailsModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDuration = (seconds: number): string => {
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-700";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-700";
    case "Advanced":
      return "bg-red-100 text-red-700";
    default:
      return "bg-surface-muted text-ink-muted";
  }
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Frontend":
      return "bg-surface-muted text-primary";
    case "Backend":
      return "bg-surface-muted text-primary";
    case "Cybersecurity":
      return "bg-surface-muted text-primary";
    default:
      return "bg-surface-muted text-ink-muted";
  }
};

const PublicResourceDetailsModal: React.FC<PublicResourceDetailsModalProps> = ({
  resource,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !resource) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image / Video */}
        <div className="relative w-full overflow-hidden rounded-t-2xl bg-surface-muted">
          {resource.videoUrl ? (
            <video
              src={resource.videoUrl}
              controls
              className="w-full max-h-64 object-cover"
            />
          ) : resource.imageUrl ? (
            <img
              src={resource.imageUrl}
              alt={resource.title}
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className="w-full h-40 flex items-center justify-center bg-line text-ink-muted text-sm">
              No preview available
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition shadow"
          >
            <X size={18} className="text-primary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex flex-col gap-5">
          {/* Title & badges */}
          <div>
            <h2 className="text-xl font-bold text-primary mb-3">
              {resource.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getCategoryColor(resource.category)}`}
              >
                {resource.category}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-muted text-ink-muted">
                {resource.type}
              </span>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getDifficultyColor(resource.difficulty)}`}
              >
                {resource.difficulty}
              </span>
              {resource.isPaid && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  Paid · ${resource.price}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-ink-muted text-sm leading-relaxed">
            {resource.description}
          </p>

          {/* Meta */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <User size={15} className="text-ink-muted shrink-0" />
              <span>{resource.author}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <Clock size={15} className="text-ink-muted shrink-0" />
              <span>{formatDuration(resource.duration)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <ThumbsUp size={15} className="text-ink-muted shrink-0" />
              <span>{resource.upvotes} upvotes</span>
            </div>
          </div>

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <Tag size={14} className="text-ink-muted shrink-0" />
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-surface-muted text-ink-muted px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* External link */}
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-secondary hover:text-primary font-medium transition-colors"
            >
              <ExternalLink size={15} />
              Open Resource
            </a>
          )}

          {/* Added by */}
          <div className="pt-3 border-t border-line text-xs text-ink-muted">
            Added by {resource.User.firstName} {resource.User.lastName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicResourceDetailsModal;
