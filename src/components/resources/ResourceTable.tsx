// src/components/resources/ResourceTable.tsx

import React from "react";
import { Eye, Download, FileText, Video, BookOpen } from "lucide-react";
import type { Resource } from "../../types/resource.types";
import ResourceSkeleton from "./ResourceSkeleton";
import UpvoteButton from "./UpvoteButton";
import SaveButton from "./SaveButton";
import ResponsiveTable from "../ui/ResponsiveTable";
import MobileCardRow from "../ui/MobileCardRow";

interface ResourceTableProps {
  resources: Resource[];
  loading: boolean;
  savedResourceIds: Set<string>;
  upvotedResourceIds: Set<string>;
  onView: (resource: Resource) => void;
  onUpvote: (id: string) => Promise<void>;
  onSave: (id: string) => Promise<void>;
  /** Pass false for public pages where auth actions are hidden */
  showAuthActions?: boolean;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Video":
      return <Video size={16} className="text-red-500" />;
    case "Book":
      return <BookOpen size={16} className="text-secondary" />;
    case "Documentation":
      return <FileText size={16} className="text-secondary" />;
    default:
      return <FileText size={16} className="text-ink-muted" />;
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

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const ResourceTable: React.FC<ResourceTableProps> = ({
  resources,
  loading,
  savedResourceIds,
  upvotedResourceIds,
  onView,
  onUpvote,
  onSave,
  showAuthActions = true,
}) => {
  const renderActions = (resource: Resource) => (
    <div className="flex items-center gap-1">
      {/* View - always visible */}
      <button
        onClick={() => onView(resource)}
        className="text-secondary hover:text-primary transition-colors p-1 rounded-md hover:bg-surface-muted"
        title="View Resource"
      >
        <Eye size={16} />
      </button>

      {/* Auth-only actions */}
      {showAuthActions && (
        <>
          <UpvoteButton
            resourceId={resource.id}
            upvotes={resource.upvotes}
            hasUpvoted={upvotedResourceIds.has(resource.id)}
            onUpvote={onUpvote}
            compact
          />
          <SaveButton
            resourceId={resource.id}
            hasSaved={savedResourceIds.has(resource.id)}
            onSave={onSave}
            compact
          />
        </>
      )}

      {/* Download - always visible */}
      {resource.url && (
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-900 transition-colors p-1 rounded-md hover:bg-green-50"
          title="Open / Download"
        >
          <Download size={16} />
        </a>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-line">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Resource Library</h2>
        <p className="text-ink-muted text-sm mt-1">
          Browse resources and documents from the hub
        </p>
      </div>

      {/* Table */}
      <ResponsiveTable
        table={
          <table className="min-w-full divide-y divide-line border-separate border-spacing-0">
            <thead className="bg-surface-muted">
              <tr>
                {/* Sticky first column - see admin EventsTable.tsx for why. */}
                <th className="px-6 py-4 text-left text-xs font-medium text-ink-muted uppercase tracking-wider sticky left-0 z-10 bg-surface-muted">
                  Resource
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-line">
              {loading ? (
                <ResourceSkeleton />
              ) : resources.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-ink-muted">
                      <FileText size={36} className="opacity-40" />
                      <p className="text-sm font-medium">No resources found</p>
                      <p className="text-xs">
                        Try adjusting your filters or check back later.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                resources.map((resource) => (
                  <tr
                    key={resource.id}
                    className="hover:bg-surface-muted transition-colors duration-200"
                  >
                    {/* Title + thumbnail */}
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 z-[1] bg-white border-r border-line">
                      <div className="flex items-center gap-3">
                        {resource.imageUrl ? (
                          <img
                            src={resource.imageUrl}
                            alt={resource.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-line"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center shrink-0">
                            {getTypeIcon(resource.type)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-primary max-w-xs truncate">
                            {resource.title}
                          </div>
                          <div className="text-xs text-ink-muted">
                            {resource.author}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}
                      >
                        {resource.category}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-muted text-ink-muted">
                        {getTypeIcon(resource.type)}
                        {resource.type}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      {formatDate(resource.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {renderActions(resource)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        }
        cards={
          loading ? (
            <>
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-4 animate-pulse">
                  <div className="h-14 bg-line rounded-lg" />
                </div>
              ))}
            </>
          ) : resources.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="flex flex-col items-center gap-2 text-ink-muted">
                <FileText size={36} className="opacity-40" />
                <p className="text-sm font-medium">No resources found</p>
                <p className="text-xs">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            </div>
          ) : (
            <>
              {resources.map((resource) => (
                <div key={resource.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {resource.imageUrl ? (
                      <img
                        src={resource.imageUrl}
                        alt={resource.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-line"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center shrink-0">
                        {getTypeIcon(resource.type)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-primary truncate">
                        {resource.title}
                      </div>
                      <div className="text-xs text-ink-muted truncate">
                        {resource.author}
                      </div>
                    </div>
                  </div>
                  <dl className="flex flex-col gap-1">
                    <MobileCardRow label="Category">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}
                      >
                        {resource.category}
                      </span>
                    </MobileCardRow>
                    <MobileCardRow label="Type">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-muted text-ink-muted">
                        {getTypeIcon(resource.type)}
                        {resource.type}
                      </span>
                    </MobileCardRow>
                    <MobileCardRow label="Date Added">
                      {formatDate(resource.createdAt)}
                    </MobileCardRow>
                  </dl>
                  <div className="pt-1 border-t border-line">
                    {renderActions(resource)}
                  </div>
                </div>
              ))}
            </>
          )
        }
      />

      {/* Footer */}
      {!loading && resources.length > 0 && (
        <div className="bg-surface-muted px-6 py-3 border-t border-line">
          <div className="text-sm text-ink-muted">
            Showing {resources.length} resource
            {resources.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceTable;
