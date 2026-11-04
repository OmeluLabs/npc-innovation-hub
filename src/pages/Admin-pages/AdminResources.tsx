/**
 * AdminResources Page
 *
 * Resource management dashboard with full CRUD operations
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminLayout from "../../components/admin-components/AdminLayout";
import ResourceTable from "../../components/admin-components/ResourceTable";
import ConfirmationModal from "../../components/admin-components/ConfirmationModal";
import { useAdminResources } from "../../hooks/useAdminResources";
import type { Resource, ResourceQueryParams } from "../../types/resource.types";

// ==================== RESOURCE DETAILS MODAL ====================

const ResourceDetailsModal = ({
  resource,
  onClose,
}: {
  resource: Resource;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-page-title font-bold text-gray-900 mb-2">
                {resource.title}
              </h2>
              <p className="text-gray-600">{resource.description}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Image */}
          {resource.imageUrl && (
            <div className="mb-6">
              <img
                src={resource.imageUrl}
                alt={resource.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Category</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {resource.category}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Type</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {resource.type}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Difficulty</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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

            <div>
              <p className="text-sm text-gray-500 mb-1">Author</p>
              <p className="text-gray-900">{resource.author}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Price</p>
              {resource.isPaid ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ${resource.price}
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Free
                </span>
              )}
            </div>

            {resource.platform && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Platform</p>
                <p className="text-gray-900">{resource.platform}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500 mb-1">Duration</p>
              <p className="text-gray-900">
                {Math.floor(resource.duration / 3600)}h{" "}
                {Math.floor((resource.duration % 3600) / 60)}m
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Upvotes</p>
              <p className="text-gray-900">{resource.upvotes}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Created By</p>
              <p className="text-gray-900">
                {resource.User.firstName} {resource.User.lastName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Created At</p>
              <p className="text-gray-900">
                {new Date(resource.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* URL */}
          {resource.url && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Resource URL</p>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {resource.url}
              </a>
            </div>
          )}

          {/* Badges */}
          <div className="flex gap-2">
            {resource.isFeatured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Featured
              </span>
            )}
            {resource.isHosted && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                Self-Hosted
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== FILTER SECTION ====================

const FilterSection = ({
  onFilterChange,
  initialSearch,
}: {
  onFilterChange: (params: ResourceQueryParams) => void;
  initialSearch?: string;
}) => {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [search, setSearch] = useState(initialSearch || "");

  const handleApplyFilters = () => {
    const params: ResourceQueryParams = {};
    if (category) params.category = category;
    if (type) params.type = type;
    if (difficulty) params.difficulty = difficulty;
    if (search) params.search = search;

    onFilterChange(params);
  };

  const handleClearFilters = () => {
    setCategory("");
    setType("");
    setDifficulty("");
    setSearch("");
    onFilterChange({});
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6">
      <h3 className="font-semibold text-lg mb-4">Filters</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <input
            type="text"
            className="border rounded-lg px-4 py-2 w-full"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <select
            className="border rounded-lg px-4 py-2 w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <select
            className="border rounded-lg px-4 py-2 w-full"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Video">Video</option>
            <option value="Documentation">Documentation</option>
            <option value="Book">Book</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <select
            className="border rounded-lg px-4 py-2 w-full"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleApplyFilters}
          className="bg-[#2d3155] text-white px-6 py-2 rounded-lg hover:bg-[#1f2340] transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearFilters}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

export default function AdminResources() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    resources,
    pagination,
    loading,
    error,
    fetchResources,
    deleteResource,
    clearError,
  } = useAdminResources();

  // State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  // Seeded from ?q= so the Topbar's search dropdown can link here with
  // the query already applied instead of landing on an unfiltered list.
  const [filterParams, setFilterParams] = useState<ResourceQueryParams>(() => {
    const q = searchParams.get("q");
    return q ? { search: q } : {};
  });

  // Fetch resources on mount and when filters/page changes
  useEffect(() => {
    fetchResources({
      ...filterParams,
      page: pagination.currentPage,
      limit: 12,
    });
  }, [pagination.currentPage, filterParams]);

  // ==================== HANDLERS ====================

  const handleView = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const handleEdit = (resource: Resource) => {
    navigate(`/add-resource?edit=${resource.id}`, { state: { resource } });
  };

  const handleDeleteClick = (resourceId: string) => {
    setResourceToDelete(resourceId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return;

    const success = await deleteResource(resourceToDelete);

    if (success) {
      setShowDeleteModal(false);
      setResourceToDelete(null);

      // Refresh resources
      fetchResources({
        ...filterParams,
        page: pagination.currentPage,
        limit: 12,
      });
    }
  };

  const handlePageChange = (page: number) => {
    fetchResources({
      ...filterParams,
      page,
      limit: 12,
    });
  };

  const handleAddNew = () => {
    navigate("/add-resource");
  };

  const handleFilterChange = (params: ResourceQueryParams) => {
    setFilterParams(params);
  };

  // ==================== RENDER ====================

  return (
    <AdminLayout
      title="Resource Management"
      actions={
        <button
          onClick={handleAddNew}
          className="bg-[#2d3155] text-white px-6 py-3 rounded-lg hover:bg-[#1f2340] transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add New Resource
        </button>
      }
    >
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <FilterSection
        onFilterChange={handleFilterChange}
        initialSearch={filterParams.search}
      />

      {/* Table */}
      <ResourceTable
        resources={resources}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onView={handleView}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        onAddNew={handleAddNew}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Resource"
        message="Are you sure you want to delete this resource? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={loading}
      />

      {/* Resource Details Modal */}
      {selectedResource && (
        <ResourceDetailsModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </AdminLayout>
  );
}
