// src/pages/resources-room/Home.tsx

import React, { useState } from "react";
import ResourceList from "../../components/resources/ResourceList";
import { Link } from "react-router-dom";
import NavMenu from "../../components/resources/NavMenu";
import PublicResourceDetailsModal from "../../components/resources/PublicResourceDetailsModal";
import type { Resource } from "../../types/resource.types";

const Home: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleResourceSelect = (resource: Resource) => {
    setSelectedResource(resource);
    setModalOpen(true);
  };

  return (
    <div>
      {/* Nav */}
      <div className="bg-primary w-full">
        <div className="max-w-6xl mx-auto flex space-x-8 py-2">
          <NavMenu active="HOME" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 text-center px-4">
        <h2 className="text-2xl font-semibold mb-2">Access resources</h2>
        <p className="mb-6 text-gray-700">
          Browse guides, templates, and reference material shared by NPC
          Innovation Hub members, organized by category so you can find what you
          need for your project.
        </p>
        <div className="flex justify-center gap-6 mb-12">
          <Link to="/resources-room/all-resources">
            <button className="px-10 py-4 bg-gray-200 rounded-lg font-semibold text-xl hover:bg-gray-300 transition">
              ALL RESOURCES
            </button>
          </Link>
          <Link to="/resources-room/categories">
            <button className="px-10 py-4 bg-gray-200 rounded-lg font-semibold text-xl hover:bg-gray-300 transition">
              CATEGORIES
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-4">
        <ResourceList
          title="Most liked resources by visitors"
          onSelect={handleResourceSelect}
        />
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

export default Home;
