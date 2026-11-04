// src/pages/landing/ProjectsShowcase.tsx
//
// "Projects" section of the single-page Home story (id="projects" - see
// AllRoutes.tsx / Navbar.tsx). Home never had a projects section at all
// before this, despite "Projects" being one of the four primary nav items -
// reuses the same real API and card component the full /projects page
// already uses (getAllProjects, ProjectCard), rather than inventing a
// second, parallel data source.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects } from "../../api/member/project.api";
import type { MemberProject } from "../../api/member/project.api";
import ProjectCard from "../../components/projects/ProjectCard";

const PREVIEW_COUNT = 3;

const SkeletonGrid: React.FC = () => (
  <div
    className="grid grid-cols-1 md:grid-cols-3 gap-8"
    aria-label="Loading projects"
  >
    {[...Array(PREVIEW_COUNT)].map((_, i) => (
      <div
        key={i}
        className="rounded-md overflow-hidden shadow-md animate-pulse bg-surface-muted"
      >
        <div className="w-full h-48 bg-line" />
        <div className="p-6 space-y-3">
          <div className="h-5 w-2/3 rounded bg-line" />
          <div className="h-4 w-full rounded bg-line" />
          <div className="h-4 w-4/5 rounded bg-line" />
        </div>
      </div>
    ))}
  </div>
);

const ProjectsShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<MemberProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAllProjects()
      .then((response) => {
        if (cancelled) return;
        const all = response.data?.projects ?? [];
        // Most recent first, same "featured = newest" convention the full
        // /projects page already uses.
        const sorted = [...all].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setProjects(sorted.slice(0, PREVIEW_COUNT));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("Failed to load projects for the Home showcase:", err);
        setError("Couldn't load projects right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="projects"
      aria-label="Our Projects"
      className="scroll-mt-16 lg:scroll-mt-20 py-20 px-4 md:px-8 bg-white"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            What We Build
          </h2>
          <p className="text-xl font-medium text-primary/80 max-w-3xl mx-auto">
            Real, member-built software - a sample of what the hub has shipped.
          </p>
        </div>

        {error && !loading && (
          <p className="text-center text-primary/70 mb-8">{error}</p>
        )}

        {loading ? (
          <SkeletonGrid />
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        ) : (
          !error && (
            <p className="text-center text-lg text-primary/70">
              Member projects are on their way — check back soon.
            </p>
          )
        )}

        <div className="flex justify-center mt-16">
          <button
            className="text-lg py-3 px-12 border-2 border-primary text-primary rounded-[33px] shadow-md hover:bg-line transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            onClick={() => navigate("/projects")}
          >
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;
