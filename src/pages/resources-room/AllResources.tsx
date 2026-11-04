// src/pages/resources-room/AllResources.tsx

import React, { useEffect, useState, useMemo } from "react";
import NavMenu from "../../components/resources/NavMenu";
import { useResources } from "../../hooks/useResources";
import type { Resource } from "../../types/resource.types";
import ResourceFilters from "../../components/resources/ResourceFilters";
import PublicResourceDetailsModal from "../../components/resources/PublicResourceDetailsModal";
import { FileText, Video, BookOpen, ThumbsUp } from "lucide-react";

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Video":
      return <Video size={14} className="text-red-400" />;
    case "Book":
      return <BookOpen size={14} className="text-blue-400" />;
    default:
      return <FileText size={14} className="text-purple-400" />;
  }
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Frontend":
      return "bg-pink-100 text-pink-700";
    case "Backend":
      return "bg-blue-100 text-blue-700";
    case "Cybersecurity":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getTypeColor = (type: string): string => {
  switch (type) {
    case "Video":
      return "bg-red-100 text-red-600";
    case "Book":
      return "bg-blue-100 text-blue-600";
    case "Documentation":
      return "bg-purple-100 text-purple-600";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

const AllResources: React.FC = () => {
  const {
    resources,
    loading,
    error,
    filters,
    setFilters,
    fetchResources,
    filterByCategory,
    filterByType,
    search,
  } = useResources();

  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleSearch = async (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
    if (query.trim()) {
      await search(query);
    } else {
      await fetchResources();
    }
  };

  const handleCategory = async (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
    if (category) {
      await filterByCategory(category);
    } else {
      await fetchResources();
    }
  };

  const handleType = async (type: string) => {
    setFilters((prev) => ({ ...prev, type }));
    if (type) {
      await filterByType(type);
    } else {
      await fetchResources();
    }
  };

  const handleCardClick = (resource: Resource) => {
    setSelectedResource(resource);
    setModalOpen(true);
  };

  // Client-side filter fallback (in case server does not support all combinations)
  const displayedResources = useMemo(() => {
    return resources.filter((r) => {
      const matchSearch =
        !filters.search ||
        r.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.tags.some((t) =>
          t.toLowerCase().includes(filters.search.toLowerCase()),
        );
      const matchCat = !filters.category || r.category === filters.category;
      const matchType = !filters.type || r.type === filters.type;
      return matchSearch && matchCat && matchType;
    });
  }, [resources, filters]);

  return (
    <div>
      {/* Nav */}
      <div className="bg-primary w-full">
        <div className="max-w-6xl mx-auto flex space-x-8 py-2">
          <NavMenu active="ALL RESOURCES" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-14 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">ALL RESOURCES</h2>

        {/* Filters */}
        <ResourceFilters
          filters={filters}
          onSearch={handleSearch}
          onCategoryChange={handleCategory}
          onTypeChange={handleType}
          className="mb-8"
        />

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-5 py-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-3 animate-pulse"
              >
                <div className="w-24 h-24 rounded-xl bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : displayedResources.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-400 gap-3">
            <FileText size={40} className="opacity-40" />
            <p className="font-medium">No resources found</p>
            <p className="text-sm">Try changing your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-16">
            {displayedResources.map((res) => (
              <div
                key={res.id}
                onClick={() => handleCardClick(res)}
                className="bg-white rounded-xl shadow hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
              >
                {/* Thumbnail */}
                <div className="w-full h-32 bg-gray-100 overflow-hidden">
                  {res.imageUrl ? (
                    <img
                      src={res.imageUrl}
                      alt={res.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getTypeIcon(res.type)}
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="font-semibold text-sm text-gray-900 line-clamp-2">
                    {res.title}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(res.category)}`}
                    >
                      {res.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(res.type)}`}
                    >
                      {res.type}
                    </span>
                  </div>

                  {/* Tags */}
                  {res.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {res.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {res.tags.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{res.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-gray-400 text-xs mt-auto pt-1">
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={11} /> {res.upvotes}
                    </span>
                    <span className="ml-auto font-semibold text-secondary">
                      {res.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <PublicResourceDetailsModal
        resource={selectedResource}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedResource(null);
        }}
      />
    </div>
  );
};

export default AllResources;
