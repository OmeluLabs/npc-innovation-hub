// src/pages/resources-room/SubcategoryResults.tsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavMenu from "../../components/resources/NavMenu";
import PublicResourceDetailsModal from "../../components/resources/PublicResourceDetailsModal";
import { useResources } from "../../hooks/useResources";
import type { Resource } from "../../types/resource.types";
import { FileText, Video, BookOpen, ThumbsUp, ArrowLeft } from "lucide-react";

// Map subcategory label → API category param
const SUBCATEGORY_TO_CATEGORY: Record<string, string> = {
  "Authentication & Authorization": "Cybersecurity",
  "Network Security": "Cybersecurity",
  "Vulnerability Management": "Cybersecurity",
  "Security Tools": "Cybersecurity",
  DevSecOps: "Cybersecurity",
  "Incident Response": "Cybersecurity",
  "UI Libraries & Frameworks": "Frontend",
  "State Management": "Frontend",
  "Component Design": "Frontend",
  "Routing & Navigation": "Frontend",
  "Performance Optimization": "Frontend",
  Testing: "Frontend",
  "API Development": "Backend",
  Authentication: "Backend",
  "Database Integration": "Backend",
  "Server Frameworks": "Backend",
  "DevOps & Deployment": "Backend",
  "Error Handling & Logging": "Backend",
  "Caching & Performance": "Backend",
};

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

const SubcategoryResults: React.FC = () => {
  const { subcategory } = useParams<{ subcategory: string }>();
  const decodedSub = subcategory ? decodeURIComponent(subcategory) : "";
  const apiCategory = SUBCATEGORY_TO_CATEGORY[decodedSub] || "";

  const { resources, loading, error, filterByCategory, fetchResources } =
    useResources();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (apiCategory) {
      filterByCategory(apiCategory);
    } else {
      fetchResources();
    }
  }, [apiCategory, filterByCategory, fetchResources]);

  return (
    <div>
      {/* Nav */}
      <div className="bg-primary w-full">
        <div className="max-w-6xl mx-auto flex space-x-8 py-2">
          <NavMenu active="CATEGORIES" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 px-4 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link
            to="/resources-room/categories"
            className="flex items-center gap-1 hover:text-secondary transition"
          >
            <ArrowLeft size={14} />
            Categories
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{decodedSub}</span>
          {apiCategory && (
            <>
              <span>/</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(apiCategory)}`}
              >
                {apiCategory}
              </span>
            </>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-8">{decodedSub}</h2>

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-5 py-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl shadow p-4 flex flex-col gap-3 animate-pulse"
              >
                <div className="w-full h-32 bg-gray-200 rounded-lg" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-400 gap-3">
            <FileText size={40} className="opacity-40" />
            <p className="font-medium">No resources in this subcategory yet.</p>
            <Link
              to="/resources-room/all-resources"
              className="text-sm text-secondary hover:underline"
            >
              Browse all resources →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {resources.map((res) => (
              <div
                key={res.id}
                onClick={() => {
                  setSelectedResource(res);
                  setModalOpen(true);
                }}
                className="bg-white rounded-xl shadow hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
              >
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

                  <div className="flex flex-wrap gap-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(res.category)}`}
                    >
                      {res.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">
                      {res.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-auto pt-1">
                    <ThumbsUp size={11} />
                    <span>{res.upvotes}</span>
                    <span className="ml-auto text-secondary font-medium truncate">
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

export default SubcategoryResults;
