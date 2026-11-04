// src/pages/project-page/ProjectsPage.tsx
//
// Public Projects page: a filterable grid of everything the Hub has built.
// Filters (status and tech stack) are built from the data that comes back, so
// a new status or technology appears as a filter automatically.

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllProjects } from "../../api/member/project.api";
import type { MemberProject } from "../../api/member/project.api";
import PageHeader from "../../components/layout/PageHeader";
import EmptyState from "../../components/layout/EmptyState";
import PublicProjectCard from "../../components/projects/PublicProjectCard";

const ALL = "All";

const chipClasses = (active: boolean): string =>
  `rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
    active
      ? "bg-primary text-white"
      : "bg-white text-secondary border border-line hover:border-secondary"
  }`;

const SkeletonGrid = () => (
  <div
    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    aria-busy="true"
    aria-label="Loading projects"
  >
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="animate-pulse overflow-hidden rounded-2xl border border-line bg-white"
      >
        <div className="aspect-[16/9] bg-line" />
        <div className="space-y-3 p-5">
          <div className="h-5 w-2/3 rounded bg-line" />
          <div className="h-4 w-full rounded bg-line" />
          <div className="h-4 w-4/5 rounded bg-line" />
        </div>
      </div>
    ))}
  </div>
);

const ProjectsPage = () => {
  const [projects, setProjects] = useState<MemberProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(ALL);
  const [tech, setTech] = useState(ALL);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getAllProjects()
      .then((res) => {
        // De-duplicate by id: the API can return a project more than once.
        const unique = new Map(res.data.projects.map((p) => [p.id, p]));
        setProjects([...unique.values()]);
      })
      .catch(() => {
        setError("We could not load projects right now. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const statuses = useMemo(
    () => [
      ALL,
      ...new Set(projects.map((p) => p.status).filter(Boolean) as string[]),
    ],
    [projects],
  );
  const technologies = useMemo(
    () => [...new Set(projects.flatMap((p) => p.techStack ?? []))].sort(),
    [projects],
  );

  const shown = projects.filter(
    (p) =>
      (status === ALL || p.status === status) &&
      (tech === ALL || (p.techStack ?? []).includes(tech)),
  );

  const filtersActive = status !== ALL || tech !== ALL;

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="What we have built"
        description="Real software shipped by Hub members, from first prototype to production."
      />

      <section className="bg-surface-muted">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12 lg:py-16">
          {!loading && !error && projects.length > 0 && (
            <div className="mb-8 space-y-4">
              {statuses.length > 2 && (
                <div
                  role="group"
                  aria-label="Filter by status"
                  className="flex flex-wrap gap-2"
                >
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      aria-pressed={status === s}
                      className={chipClasses(status === s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {technologies.length > 0 && (
                <div
                  role="group"
                  aria-label="Filter by technology"
                  className="flex flex-wrap gap-2"
                >
                  {[ALL, ...technologies].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTech(t)}
                      aria-pressed={tech === t}
                      className={chipClasses(tech === t)}
                    >
                      {t === ALL ? "All technologies" : t}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-sm text-ink-muted" aria-live="polite">
                Showing {shown.length} of {projects.length} projects
              </p>
            </div>
          )}

          {loading ? (
            <SkeletonGrid />
          ) : error ? (
            <EmptyState
              title="We could not load projects"
              message={error}
              action={
                <button
                  onClick={load}
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Try again
                </button>
              }
            />
          ) : projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              message="Projects will appear here as members publish them."
            />
          ) : shown.length === 0 ? (
            <EmptyState
              title="No projects match these filters"
              action={
                filtersActive ? (
                  <button
                    onClick={() => {
                      setStatus(ALL);
                      setTech(ALL);
                    }}
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Clear filters
                  </button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((project) => (
                <PublicProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;
