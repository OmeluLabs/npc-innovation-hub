// src/pages/resources-page/Resources.tsx

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ResourceTable from "../../components/resources/ResourceTable";
import ResourceDetailsModal from "../../components/resources/ResourceDetailsModal";
import ResourceFilters from "../../components/resources/ResourceFilters";
import { useResources } from "../../hooks/useResources";
import type { Resource } from "../../types/resource.types";

export const Resources: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    resources,
    selectedResource,
    userInteraction,
    savedResources,
    loading,
    error,
    filters,
    setFilters,
    fetchResources,
    fetchResourceById,
    fetchSavedResources,
    upvote,
    save,
    clearSelectedResource,
  } = useResources();

  const [modalOpen, setModalOpen] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchResources();
    fetchSavedResources();
  }, [fetchResources, fetchSavedResources]);

  // Seed the search filter from ?q= - lets the Topbar's search dropdown
  // link here with the query already applied instead of landing on an
  // unfiltered list.
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setFilters((prev) => ({ ...prev, search: q }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savedResourceIds = useMemo(
    () => new Set(savedResources.map((r) => r.id)),
    [savedResources],
  );

  const handleUpvote = async (id: string) => {
    await upvote(id);
    setUpvotedIds((prev) => new Set(prev).add(id));
  };

  const handleSave = async (id: string) => {
    await save(id);
    fetchSavedResources();
  };

  const handleView = async (resource: Resource) => {
    await fetchResourceById(resource.id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    clearSelectedResource();
  };

  // Filter callbacks — client-side only for the member dashboard
  // (the member Resources page does not call server filter endpoints,
  //  it fetches all once and filters locally for instant UX)
  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handleTypeChange = (type: string) => {
    setFilters((prev) => ({ ...prev, type }));
  };

  // Client-side filtering
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        !filters.search ||
        r.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.author.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.tags.some((tag) =>
          tag.toLowerCase().includes(filters.search.toLowerCase()),
        );

      const matchesCategory =
        !filters.category || r.category === filters.category;

      const matchesType = !filters.type || r.type === filters.type;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [resources, filters]);

  return (
    <div>
      {/* flex-col below sm - title + link were both text-2xl side by side,
          together wider than a phone screen. Link drops back to text-2xl
          once there's room for both on one line. */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold">Resources</h2>
        <button
          onClick={() => navigate("/resources-room")}
          className="text-base sm:text-2xl text-secondary hover:text-primary font-medium transition-colors duration-200 cursor-pointer text-left"
        >
          Resources Room →
        </button>
      </div>

      {/* Error banner */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-4 mb-5 text-sm">
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Filters */}
      <ResourceFilters
        filters={filters}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onTypeChange={handleTypeChange}
        className="mb-5"
      />

      {/* Table */}
      <ResourceTable
        resources={filteredResources}
        loading={loading}
        savedResourceIds={savedResourceIds}
        upvotedResourceIds={upvotedIds}
        onView={handleView}
        onUpvote={handleUpvote}
        onSave={handleSave}
      />

      {/* Modal */}
      <ResourceDetailsModal
        resource={selectedResource}
        userInteraction={userInteraction}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onUpvote={handleUpvote}
        onSave={handleSave}
      />
    </div>
  );
};
