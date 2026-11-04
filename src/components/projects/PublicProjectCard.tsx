// src/components/projects/PublicProjectCard.tsx
//
// Project card for the public Projects page: cover image, title, short
// description, status, tech-stack tags and repository / demo links.

import React from "react";
import { ExternalLink, Github } from "lucide-react";
import type { MemberProject } from "../../api/member/project.api";
import { stripEmoji } from "../../utils/stripEmoji";

const STATUS_STYLES: Record<string, string> = {
  Completed: "bg-primary text-white",
  "In Progress": "bg-secondary text-white",
  Planned: "bg-accent text-primary",
};

interface PublicProjectCardProps {
  project: MemberProject;
}

const linkClasses =
  "inline-flex items-center gap-1.5 text-sm font-semibold text-secondary transition-colors duration-200 hover:text-primary focus:outline-none focus-visible:underline";

const PublicProjectCard: React.FC<PublicProjectCardProps> = ({ project }) => {
  const title = stripEmoji(project.title);
  const status = project.status ?? "In Progress";
  const techStack = project.techStack ?? [];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-shadow duration-200 hover:shadow-medium">
      <div className="relative aspect-[16/9] bg-surface-muted">
        {project.image && (
          <img
            src={project.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
            STATUS_STYLES[status] ?? STATUS_STYLES["In Progress"]
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2">{title}</h3>
        <p className="mt-2 flex-1 text-sm text-ink-muted line-clamp-3">
          {stripEmoji(project.description)}
        </p>

        {techStack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
            {techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-secondary"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <p className="text-xs text-ink-muted">By {project.owner}</p>
          <div className="flex items-center gap-4">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} repository`}
                className={linkClasses}
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                Code
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} live demo`}
                className={linkClasses}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PublicProjectCard;
