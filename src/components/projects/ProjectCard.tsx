import React from "react";
import type { MemberProject as Project } from "../../api/member/project.api";

interface ProjectCardProps extends Project {
  variant?: "default" | "featured";
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  image,
  title,
  description,
  link,
  variant = "default",
  className = "",
}) => {
  if (variant === "featured") {
    return (
      <div
        className={`flex flex-col md:flex-row bg-primary rounded-md overflow-hidden shadow-md min-h-[350px] ${className}`}
      >
        <div className="md:w-1/2 w-full h-60 md:h-auto">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        {/* ml-12 was unconditional - on the mobile single-column layout
            (flex-col) that's 48px lost on just the left edge on top of
            this side's own p-8, on a card that can be as narrow as
            ~300px. Scoped to md: where the row layout (and the room for
            it) actually applies. */}
        <div className="flex flex-col justify-start md:ml-12 p-8 md:w-1/2 w-full text-gray-100 text-left">
          <h3 className="text-gray-200 text-3xl font-light mb-3">{title}</h3>
          <p className="text-gray-300  mt-5">{description}</p>
          {/* Was a justify-between row with a "who created this" block
              (avatar/name/role) on the left - dropped, this is a public
              showcase card, not a byline. mt-5 preserved here (it used to
              live on the owner block) so "View more" keeps the same
              spacing below the description. */}
          <div className="flex items-center justify-end mt-5">
            <a
              href={link}
              className="flex items-center px-3 py-1.5 text-xs rounded-full bg-white/20 text-gray-200 border border-white/30 hover:bg-white/30 transition"
            >
              View more
              <svg
                className="ml-1 w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  d="M14 3h7v7m0 0L10 21l-7-7L14 3z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // default variant
  return (
    <div
      className={`relative rounded-md overflow-hidden shadow-lg bg-gray-200 group ${className}`}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-96 object-cover transition-transform duration-300 "
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-950/50 to-transparent flex flex-col p-5">
        {/* Centered content */}
        <div className="flex-grow flex flex-col items-center justify-center">
          <h3 className="text-gray-100 text-2xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-200 mt-4 text-center">{description}</p>
        </div>

        {/* Bottom content - was a justify-between row with a "who created
            this" block (avatar/name/role) on the left; dropped, this is a
            public showcase card, not a byline. */}
        <div className="flex px-6 items-center justify-end w-full">
          <a
            href={link}
            className="flex items-center px-3 py-1.5 text-xs rounded-full bg-white/20 text-gray-200 border border-white/30 hover:bg-white/40 transition"
          >
            View more
            <svg
              className="ml-1 w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M14 3h7v7m0 0L10 21l-7-7L14 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
