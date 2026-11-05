// import { resourceList } from "../../data/admin-data/resources";

// export default function ResourceTable() {
//   return (
//     <div className="mt-6 bg-white shadow rounded-xl p-0 overflow-x-auto">
//       <table className="w-full text-left">
//         <thead>
//           <tr className="bg-primary text-white rounded-t-xl">
//             <th className="py-4 px-6">Date</th>
//             <th className="py-4 px-6">Time</th>
//             <th className="py-4 px-6">Title</th>
//             <th className="py-4 px-6">category</th>
//             <th className="py-4 px-6">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {resourceList.map((r, idx) => (
//             <tr key={idx} className="border-b last:border-b-0 bg-surface-muted">
//               <td className="py-4 px-6">{r.date}</td>
//               <td className="py-4 px-6">{r.time}</td>
//               <td className="py-4 px-6">{r.title}</td>
//               <td className="py-4 px-6">{r.category}</td>
//               <td className="py-4 px-6">
//                 <button>
//                   <svg width="24" height="24" fill="none">
//                   </svg>
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="px-6 py-4 flex justify-between items-center">
//         {/* Pagination */}
//         <div className="flex gap-2">
//           <button className="px-2 py-1 rounded bg-line">&lt;</button>
//           <button className="px-2 py-1 rounded bg-line">1</button>
//           <button className="px-2 py-1 rounded bg-line">2</button>
//           <button className="px-2 py-1 rounded bg-secondary text-white">
//             3
//           </button>
//           <button className="px-2 py-1 rounded bg-line">4</button>
//           <span>...</span>
//           <button className="px-2 py-1 rounded bg-line">&gt;</button>
//         </div>
//         <button className="bg-primary text-white px-6 py-2 rounded-lg">
//           Add new resource
//         </button>
//       </div>
//     </div>
//   );
// }

/**
 * ResourceTable Component
 *
 * Displays resources in a table with actions
 */

import { useState } from "react";
import type { Resource } from "../../types/resource.types";
import ResponsiveTable from "../ui/ResponsiveTable";
import MobileCardRow from "../ui/MobileCardRow";

// ==================== TYPES ====================

interface ResourceTableProps {
  resources: Resource[];
  loading?: boolean;
  onEdit: (resource: Resource) => void;
  onDelete: (resourceId: string) => void;
  onView: (resource: Resource) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAddNew: () => void;
}

// ==================== HELPER FUNCTIONS ====================

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// ==================== SKELETON LOADER ====================

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, idx) => (
      <tr
        key={idx}
        className="border-b border-mist-200 bg-mist-100 animate-pulse"
      >
        <td className="py-4 px-6">
          <div className="h-4 bg-mist-200 rounded w-20"></div>
        </td>
        <td className="py-4 px-6">
          <div className="h-4 bg-mist-200 rounded w-16"></div>
        </td>
        <td className="py-4 px-6">
          <div className="h-10 bg-mist-200 rounded-lg w-full"></div>
        </td>
        <td className="py-4 px-6">
          <div className="h-4 bg-mist-200 rounded w-24"></div>
        </td>
        <td className="py-4 px-6">
          <div className="h-4 bg-mist-200 rounded w-20"></div>
        </td>
        <td className="py-4 px-6">
          <div className="h-4 bg-mist-200 rounded w-20"></div>
        </td>
        <td className="py-4 px-6">
          <div className="h-8 bg-mist-200 rounded w-8"></div>
        </td>
      </tr>
    ))}
  </>
);

// ==================== EMPTY STATE ====================

const EmptyState = ({ onAddNew }: { onAddNew: () => void }) => (
  <tr>
    <td colSpan={7} className="py-12 text-center">
      <div className="flex flex-col items-center gap-4">
        <svg
          className="w-16 h-16 text-mist-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div>
          <p className="text-mist-600 text-lg font-medium mb-1">
            No resources found
          </p>
          <p className="text-mist-500 text-sm">
            Get started by creating your first resource
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="mt-2 bg-navy-800 text-white px-6 py-2 rounded-lg hover:bg-navy-700 transition-colors"
        >
          Add New Resource
        </button>
      </div>
    </td>
  </tr>
);

// ==================== ACTIONS DROPDOWN ====================

const ActionsDropdown = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-mist-200 rounded transition-colors"
      >
        <svg width="24" height="24" fill="none">
          <circle cx="12" cy="6" r="2" className="fill-navy-800" />
          <circle cx="12" cy="12" r="2" className="fill-navy-800" />
          <circle cx="12" cy="18" r="2" className="fill-navy-800" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-mist-300 py-1 z-20">
            <button
              onClick={() => {
                onView();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-mist-100 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View
            </button>
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-mist-100 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ==================== MOBILE CARDS ====================
// The card's identity block (image/avatar, title, description, author,
// paid/free + difficulty badges) is the ResourceTable table cell's JSX
// reused verbatim. Rows below it are curated, not every column stacked:
// Category, Type, Stats, and Date+Time merged into one "Added" row (they
// were two columns only because a wide table had room).

const ResourceCardSkeleton = () => (
  <>
    {[...Array(3)].map((_, idx) => (
      <div key={idx} className="p-4 animate-pulse">
        <div className="h-16 bg-mist-200 rounded-lg"></div>
      </div>
    ))}
  </>
);

const ResourceCardEmptyState = ({ onAddNew }: { onAddNew: () => void }) => (
  <div className="py-12 px-4 text-center">
    <div className="flex flex-col items-center gap-4">
      <svg
        className="w-16 h-16 text-mist-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <div>
        <p className="text-mist-600 text-lg font-medium mb-1">
          No resources found
        </p>
        <p className="text-mist-500 text-sm">
          Get started by creating your first resource
        </p>
      </div>
      <button
        onClick={onAddNew}
        className="mt-2 bg-navy-800 text-white px-6 py-2 rounded-lg hover:bg-navy-700 transition-colors"
      >
        Add New Resource
      </button>
    </div>
  </div>
);

const ResourceCards = ({
  resources,
  loading,
  onEdit,
  onDelete,
  onView,
  onAddNew,
}: {
  resources: Resource[];
  loading: boolean;
  onEdit: (resource: Resource) => void;
  onDelete: (resourceId: string) => void;
  onView: (resource: Resource) => void;
  onAddNew: () => void;
}) => {
  if (loading) return <ResourceCardSkeleton />;
  if (resources.length === 0)
    return <ResourceCardEmptyState onAddNew={onAddNew} />;

  return (
    <>
      {resources.map((resource) => (
        <div key={resource.id} className="p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-mist-200">
                {resource.imageUrl ? (
                  <img
                    src={resource.imageUrl}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-mist-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-navy-800 truncate">
                  {resource.title}
                </h3>
                <p className="text-xs text-mist-600 truncate">
                  {resource.description}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-mist-600">
                    by {resource.author}
                  </span>
                  {resource.isPaid ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-100 text-navy-800">
                      ${resource.price}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-mist-200 text-mist-600">
                      Free
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      resource.difficulty === "Beginner"
                        ? "bg-green-100 text-green-800"
                        : resource.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {resource.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <ActionsDropdown
              onView={() => onView(resource)}
              onEdit={() => onEdit(resource)}
              onDelete={() => onDelete(resource.id)}
            />
          </div>

          <dl className="flex flex-col gap-1">
            <MobileCardRow label="Category">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-navy-50 text-navy-700">
                {resource.category}
              </span>
            </MobileCardRow>
            <MobileCardRow label="Type">{resource.type}</MobileCardRow>
            <MobileCardRow label="Stats">
              {formatDuration(resource.duration)} · {resource.upvotes} upvotes
            </MobileCardRow>
            <MobileCardRow label="Added">
              {formatDate(resource.createdAt)} {formatTime(resource.createdAt)}
            </MobileCardRow>
          </dl>
        </div>
      ))}
    </>
  );
};

// ==================== MAIN COMPONENT ====================

export default function ResourceTable({
  resources,
  loading = false,
  onEdit,
  onDelete,
  onView,
  currentPage,
  totalPages,
  onPageChange,
  onAddNew,
}: ResourceTableProps) {
  return (
    <div className="mt-6 bg-white shadow rounded-xl overflow-hidden">
      <ResponsiveTable
        cards={
          <ResourceCards
            resources={resources}
            loading={loading}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onAddNew={onAddNew}
          />
        }
        table={
          <table className="w-full text-left">
            <thead>
              <tr className="bg-navy-800 text-white">
                <th className="py-4 px-6 font-medium">Date</th>
                <th className="py-4 px-6 font-medium">Time</th>
                <th className="py-4 px-6 font-medium">Resource Details</th>
                <th className="py-4 px-6 font-medium">Category</th>
                <th className="py-4 px-6 font-medium">Type</th>
                <th className="py-4 px-6 font-medium">Stats</th>
                <th className="py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton />
              ) : resources.length === 0 ? (
                <EmptyState onAddNew={onAddNew} />
              ) : (
                resources.map((resource) => (
                  <tr
                    key={resource.id}
                    className="border-b border-mist-200 last:border-b-0 bg-white hover:bg-mist-100 transition-colors"
                  >
                    {/* Date */}
                    <td className="py-4 px-6 text-sm text-mist-600">
                      {formatDate(resource.createdAt)}
                    </td>

                    {/* Time */}
                    <td className="py-4 px-6 text-sm text-mist-600">
                      {formatTime(resource.createdAt)}
                    </td>

                    {/* Resource Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {/* Image/Video Avatar */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-mist-200">
                          {resource.imageUrl ? (
                            <img
                              src={resource.imageUrl}
                              alt={resource.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-mist-400">
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Title & Description */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-navy-800 truncate">
                            {resource.title}
                          </h3>
                          <p className="text-xs text-mist-600 truncate">
                            {resource.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {/* Author */}
                            <span className="text-xs text-mist-600">
                              by {resource.author}
                            </span>
                            {/* Paid/Free Badge */}
                            {resource.isPaid ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-100 text-navy-800">
                                ${resource.price}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-mist-200 text-mist-600">
                                Free
                              </span>
                            )}
                            {/* Difficulty Badge */}
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                resource.difficulty === "Beginner"
                                  ? "bg-green-100 text-green-800"
                                  : resource.difficulty === "Intermediate"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {resource.difficulty}
                            </span>
                          </div>
                          {/* Tags */}
                          {resource.tags && resource.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {resource.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-mist-200 text-mist-700"
                                >
                                  {tag}
                                </span>
                              ))}
                              {resource.tags.length > 3 && (
                                <span className="text-xs text-mist-500">
                                  +{resource.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-navy-50 text-navy-700">
                        {resource.category}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-sm text-mist-600">
                        {resource.type === "Video" && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                        {resource.type === "Documentation" && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        )}
                        {resource.type === "Book" && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        )}
                        {resource.type}
                      </span>
                    </td>

                    {/* Stats */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1 text-xs text-mist-600">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {formatDuration(resource.duration)}
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                            />
                          </svg>
                          {resource.upvotes}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <ActionsDropdown
                        onView={() => onView(resource)}
                        onEdit={() => onEdit(resource)}
                        onDelete={() => onDelete(resource.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        }
      />

      {/* Footer with Pagination */}
      {!loading && resources.length > 0 && (
        <div className="px-6 py-4 flex justify-between items-center border-t border-mist-200 bg-mist-100">
          {/* Pagination */}
          <div className="flex gap-2 items-center">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-mist-200 hover:bg-mist-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &lt;
            </button>

            {/* Page numbers */}
            {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
              let pageNum: number;

              if (totalPages <= 5) {
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === pageNum
                      ? "bg-navy-800 text-white"
                      : "bg-mist-200 hover:bg-mist-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-mist-500">...</span>
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-1 rounded bg-mist-200 hover:bg-mist-300 transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-mist-200 hover:bg-mist-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &gt;
            </button>
          </div>

          {/* Add New Button */}
          <button
            onClick={onAddNew}
            className="bg-navy-800 text-white px-6 py-2 rounded-lg hover:bg-navy-700 transition-colors"
          >
            Add new resource
          </button>
        </div>
      )}
    </div>
  );
}
