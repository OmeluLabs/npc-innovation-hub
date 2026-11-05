// src/components/resources/ResourceFilters.tsx

import React, { useRef } from "react";
import { Search } from "lucide-react";
import type { ResourceFilterState } from "../../types/resource.types";
import { ResourceCategory, ResourceType } from "../../types/resource.types";

interface ResourceFiltersProps {
  filters: ResourceFilterState;
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onTypeChange: (type: string) => void;
  className?: string;
}

const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  filters,
  onSearch,
  onCategoryChange,
  onTypeChange,
  className = "",
}) => {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 400);
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          placeholder="Search resources..."
          defaultValue={filters.search}
          onChange={handleSearch}
          className="w-full pl-9 pr-4 py-2.5 border border-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition bg-white"
        />
      </div>

      {/* Category */}
      <select
        value={filters.category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-3 py-2.5 border border-line rounded-xl text-sm text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition bg-white"
      >
        <option value="">All Categories</option>
        {Object.values(ResourceCategory).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Type */}
      <select
        value={filters.type}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-3 py-2.5 border border-line rounded-xl text-sm text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition bg-white"
      >
        <option value="">All Types</option>
        {Object.values(ResourceType).map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ResourceFilters;
