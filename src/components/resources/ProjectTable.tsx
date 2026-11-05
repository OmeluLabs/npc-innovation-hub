// src/components/resources/ProjectTable.tsx
import React, { useState } from "react";
import {
  Eye,
  Trash2,
  ExternalLink,
  Github,
  Calendar,
  User,
  Pencil,
} from "lucide-react";
import type { MemberProject } from "../../api/member/project.api";
import ProjectViewModal from "./ProjectViewModal";
import ProjectDeleteModal from "./ProjectDeleteModal";
import ProjectEditModal from "./ProjectEditModal";
import ResponsiveTable from "../ui/ResponsiveTable";
import MobileCardRow from "../ui/MobileCardRow";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  projects: MemberProject[];
  onDelete: (id: string) => Promise<void>;
  onUpdate?: (id: string, payload: FormData) => Promise<void>;
}

const ProjectTable: React.FC<Props> = ({ projects, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [viewProject, setViewProject] = useState<MemberProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MemberProject | null>(null);
  const [editTarget, setEditTarget] = useState<MemberProject | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await onDelete(deleteTarget.id);
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const renderLinks = (project: MemberProject) => (
    <div className="flex items-center gap-2">
      {project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          title="Source Code"
          className="w-7 h-7 flex items-center justify-center rounded-md bg-primary text-white hover:bg-primary transition"
        >
          <Github size={13} />
        </a>
      ) : (
        <span className="w-7 h-7 flex items-center justify-center rounded-md bg-surface-muted text-ink-muted cursor-not-allowed">
          <Github size={13} />
        </span>
      )}
      {project.demo ? (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          title="Live Demo"
          className="w-7 h-7 flex items-center justify-center rounded-md bg-primary text-white hover:bg-primary transition"
        >
          <ExternalLink size={13} />
        </a>
      ) : (
        <span className="w-7 h-7 flex items-center justify-center rounded-md bg-surface-muted text-ink-muted cursor-not-allowed">
          <ExternalLink size={13} />
        </span>
      )}
    </div>
  );

  // "All Projects" (see Projects.tsx's view toggle) lists every member's
  // projects, not just the viewer's own - Edit/Delete used to render
  // unconditionally for every row regardless of whose project it was. The
  // backend already rejects an edit/delete the viewer doesn't own (see
  // assertOwnerOrAdmin in project.controller.ts), so this was never an
  // actual security gap, but showing an action a Member has no legitimate
  // reason to attempt is a real UX defect - View stays available to
  // everyone (this is a legitimate read-only showcase of others' work).
  const renderActions = (project: MemberProject) => {
    const isMine = !!user && project.userId === user.id;

    return (
      <div className="flex items-center gap-2">
        <button
          title="View project"
          onClick={() => setViewProject(project)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition group"
        >
          <Eye
            size={15}
            className="group-hover:scale-110 transition-transform"
          />
        </button>
        {isMine && onUpdate && (
          <button
            title="Edit project"
            onClick={() => setEditTarget(project)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-muted text-secondary hover:bg-surface-muted transition group"
          >
            <Pencil
              size={15}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
        )}
        {isMine && (
          <button
            title="Delete project"
            onClick={() => setDeleteTarget(project)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition group"
          >
            <Trash2
              size={15}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-line overflow-hidden">
        <ResponsiveTable
          table={
            <table className="min-w-full divide-y divide-line border-separate border-spacing-0">
              <thead>
                <tr className="bg-surface-muted">
                  {/* Sticky first column - see admin EventsTable.tsx for why. */}
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider sticky left-0 z-10 bg-surface-muted">
                    Project
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Links
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-surface-muted/70 transition-colors"
                  >
                    {/* Project */}
                    <td className="px-6 py-4 sticky left-0 z-[1] bg-white border-r border-line">
                      <div className="flex items-center gap-3">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-line"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary text-sm font-bold">
                              {project.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-primary leading-tight">
                            {project.title}
                          </p>
                          <p className="text-xs text-ink-muted mt-0.5 max-w-[200px] truncate">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={project.ownerAvatar}
                          alt={project.owner}
                          className="w-7 h-7 rounded-full border border-line object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://randomuser.me/api/portraits/lego/1.jpg";
                          }}
                        />
                        <span className="text-sm text-primary">
                          {project.owner &&
                          project.owner !== "undefined undefined"
                            ? project.owner
                            : "—"}
                        </span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          project.ownerRole === "Admin"
                            ? "bg-surface-muted text-primary border-accent"
                            : "bg-surface-muted text-primary border-accent"
                        }`}
                      >
                        {project.ownerRole}
                      </span>
                    </td>

                    {/* Links */}
                    <td className="px-6 py-4">{renderLinks(project)}</td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                        <Calendar size={12} />
                        {new Date(project.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">{renderActions(project)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          cards={
            <>
              {projects.map((project) => (
                <div key={project.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-line"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary text-sm font-bold">
                          {project.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary leading-tight truncate">
                        {project.title}
                      </p>
                      <p className="text-xs text-ink-muted mt-0.5 truncate">
                        {project.description}
                      </p>
                    </div>
                  </div>
                  <dl className="flex flex-col gap-1">
                    <MobileCardRow label="Owner">
                      <span className="inline-flex items-center gap-2">
                        <img
                          src={project.ownerAvatar}
                          alt={project.owner}
                          className="w-5 h-5 rounded-full border border-line object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://randomuser.me/api/portraits/lego/1.jpg";
                          }}
                        />
                        {project.owner &&
                        project.owner !== "undefined undefined"
                          ? project.owner
                          : "—"}
                      </span>
                    </MobileCardRow>
                    <MobileCardRow label="Role">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          project.ownerRole === "Admin"
                            ? "bg-surface-muted text-primary border-accent"
                            : "bg-surface-muted text-primary border-accent"
                        }`}
                      >
                        {project.ownerRole}
                      </span>
                    </MobileCardRow>
                    <MobileCardRow label="Created">
                      <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                        <Calendar size={12} />
                        {new Date(project.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    </MobileCardRow>
                  </dl>
                  <div className="flex items-center justify-between pt-1 border-t border-line">
                    {renderLinks(project)}
                    {renderActions(project)}
                  </div>
                </div>
              ))}
            </>
          }
        />

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-line bg-surface-muted">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <User size={12} />
            Showing {projects.length} project{projects.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewProject && (
        <ProjectViewModal
          project={viewProject}
          onClose={() => setViewProject(null)}
        />
      )}
      {editTarget && onUpdate && (
        <ProjectEditModal
          project={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={onUpdate}
        />
      )}
      {deleteTarget && (
        <ProjectDeleteModal
          projectTitle={deleteTarget.title}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

export default ProjectTable;
