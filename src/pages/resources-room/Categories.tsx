// src/pages/resources-room/Categories.tsx

import React, { useState } from "react";
import NavMenu from "../../components/resources/NavMenu";
import CategorySection from "../../components/resources/CategorySection";
import ResourceList from "../../components/resources/ResourceList";
import PublicResourceDetailsModal from "../../components/resources/PublicResourceDetailsModal";
import type { Resource } from "../../types/resource.types";

const Categories: React.FC = () => {
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
          <NavMenu active="CATEGORIES" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-16 px-4">
        <h2 className="text-3xl font-extrabold text-center mb-8">CATEGORIES</h2>
        <CategorySection />
      </div>

      <div className="max-w-5xl mx-auto py-16 px-4">
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

export default Categories;
