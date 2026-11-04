// src/pages/all-member-page/MemberDetailPage.tsx
//
// Public profile for one member: photo, role, bio, links, education and
// skills. Everything shown comes from the API; sections with no data are
// simply not rendered.

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Github,
  Globe,
  GraduationCap,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getMemberById } from "../../api/member/member.api";
import type { Member } from "../../types/member.types";
import EmptyState from "../../components/layout/EmptyState";

const CONTACT_LINKS: {
  key: keyof NonNullable<Member["contacts"]>;
  label: string;
  Icon: LucideIcon;
}[] = [
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "github", label: "GitHub", Icon: Github },
  { key: "twitter", label: "Twitter", Icon: Twitter },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "portfolio", label: "Portfolio", Icon: Globe },
];

const initials = (name: string): string =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const formatEducationYears = (education: Member["education"]): string | null =>
  education?.startYear
    ? `${education.startYear} - ${education.endYear ?? "Present"}`
    : null;

const documentLinkClasses =
  "inline-flex items-center gap-2 rounded-lg border border-secondary px-4 py-2 text-sm font-semibold text-secondary transition-colors duration-200 hover:bg-secondary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2";

export const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        setMember(await getMemberById(id));
      } catch (e) {
        const apiErr = e as { statusCode?: number; message?: string };
        setError(
          apiErr.statusCode === 404
            ? "This member doesn't exist or may have been removed."
            : (apiErr.message ?? "Failed to load member."),
        );
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-surface-muted min-h-screen px-6 lg:px-12 py-10">
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 w-40 rounded bg-line" />
          <div className="h-72 rounded-2xl bg-line" />
          <div className="h-40 rounded-2xl bg-line" />
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="bg-surface-muted min-h-screen px-6 lg:px-12 py-16">
        <div className="max-w-xl mx-auto">
          <EmptyState
            title="Member not found"
            message={
              error ?? "This member doesn't exist or may have been removed."
            }
            action={
              <button
                onClick={() => navigate("/members")}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Back to members
              </button>
            }
          />
        </div>
      </div>
    );
  }

  const links = CONTACT_LINKS.filter(({ key }) => member.contacts?.[key]);
  const educationYears = formatEducationYears(member.education);
  const hashtags = member.hashtags ?? [];
  const skillCategories = member.skillCategories ?? [];

  return (
    <div className="bg-surface-muted min-h-screen">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-10 space-y-8">
        <button
          onClick={() => navigate("/members")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary focus:outline-none focus-visible:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to members
        </button>

        <section className="flex flex-col gap-8 rounded-2xl border border-line bg-white p-6 shadow-soft sm:flex-row sm:p-10">
          <div className="h-40 w-40 shrink-0 self-center overflow-hidden rounded-full bg-surface-muted ring-4 ring-accent sm:self-start flex items-center justify-center">
            {member.imageUrl ? (
              <img
                src={member.imageUrl}
                alt={member.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="text-4xl font-bold text-secondary"
              >
                {initials(member.name)}
              </span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1>{member.name}</h1>
            <p className="mt-1 text-lg font-semibold text-secondary">
              {member.role}
            </p>
            {member.education?.institution && (
              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-ink-muted sm:justify-start">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                {member.education.institution}
              </p>
            )}

            {member.bio && <p className="mt-5 text-ink-muted">{member.bio}</p>}

            {hashtags.length > 0 && (
              <ul className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                {hashtags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-secondary"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            )}

            {(member.cvUrl || member.resumeUrl) && (
              <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                {member.cvUrl && (
                  <a
                    href={member.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={documentLinkClasses}
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    View CV
                  </a>
                )}
                {member.resumeUrl && (
                  <a
                    href={member.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={documentLinkClasses}
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    Resume
                  </a>
                )}
              </div>
            )}

            {links.length > 0 && (
              <ul className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">
                {links.map(({ key, label, Icon }) => (
                  <li key={key}>
                    <a
                      href={member.contacts?.[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on ${label}`}
                      className="inline-flex rounded-full p-2.5 text-secondary transition-colors duration-200 hover:bg-surface-muted hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {member.education && (
          <section
            aria-labelledby="education-heading"
            className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-10"
          >
            <h2 id="education-heading">Education</h2>
            <p className="mt-4 font-semibold text-primary">
              {member.education.degree}
            </p>
            <p className="text-ink-muted">
              {[
                member.education.institution,
                member.education.department,
                educationYears,
                member.education.status,
              ]
                .filter(Boolean)
                .join(" | ")}
            </p>
            {member.education.description && (
              <p className="mt-3 text-ink-muted">
                {member.education.description}
              </p>
            )}
          </section>
        )}

        {skillCategories.length > 0 && (
          <section aria-labelledby="skills-heading">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="skills-heading">Skills and technologies</h2>
              <button
                onClick={() => navigate("/projects")}
                className="text-sm font-semibold text-secondary hover:text-primary focus:outline-none focus-visible:underline"
              >
                View projects
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {skillCategories.map((category) => (
                <article
                  key={category.category}
                  className="rounded-2xl border border-line bg-white p-6 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <h3>{category.category}</h3>
                    <span className="text-sm font-semibold text-secondary">
                      {category.overall}%
                    </span>
                  </div>
                  <ul className="mt-4 space-y-4">
                    {category.skills.map((skill) => (
                      <li key={skill.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-primary">
                            {skill.name}
                          </span>
                          <span className="text-ink-muted">
                            {skill.percent}%
                          </span>
                        </div>
                        <div
                          className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted"
                          role="progressbar"
                          aria-label={`${skill.name} proficiency`}
                          aria-valuenow={skill.percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-full rounded-full bg-secondary"
                            style={{ width: `${skill.percent}%` }}
                          />
                        </div>
                        {skill.technologies.length > 0 && (
                          <p className="mt-1.5 text-xs text-ink-muted">
                            {skill.technologies.join(", ")}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
