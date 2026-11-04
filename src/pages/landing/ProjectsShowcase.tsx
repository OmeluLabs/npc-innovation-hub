// src/pages/landing/ProjectsShowcase.tsx
//
// "What We Build" highlight on the landing page (id="projects", the target of
// the navbar's Projects link): the newest projects, using the same data
// source and card as the full /projects page.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects } from "../../api/member/project.api";
import type { MemberProject } from "../../api/member/project.api";
import PublicProjectCard from "../../components/projects/PublicProjectCard";
import Section from "../../components/layout/Section";
import CardGridSkeleton from "../../components/layout/CardGridSkeleton";
import ViewAllButton from "../../components/layout/ViewAllButton";

const PREVIEW_COUNT = 3;

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
        const sorted = [...all].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setProjects(sorted.slice(0, PREVIEW_COUNT));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("Failed to load projects for the Home showcase:", err);
        setError("We could not load projects right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section
      id="projects"
      label="Our Projects"
      title="What We Build"
      description="Real, member-built software: a sample of what the Hub has shipped."
      action={
        <ViewAllButton onClick={() => navigate("/projects")}>
          View All Projects
        </ViewAllButton>
      }
    >
      {error && !loading && (
        <p className="mb-8 text-center text-ink-muted">{error}</p>
      )}

      {loading ? (
        <CardGridSkeleton label="Loading projects" count={PREVIEW_COUNT} />
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <PublicProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        !error && (
          <p className="text-center text-lg text-ink-muted">
            Member projects are on their way. Check back soon.
          </p>
        )
      )}
    </Section>
  );
};

export default ProjectsShowcase;
