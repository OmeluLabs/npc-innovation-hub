// src/components/resources/ResourceSkeleton.tsx

import React from "react";

const ResourceSkeleton: React.FC = () => {
  return (
    <>
      {[1, 2, 3, 4].map((n) => (
        <tr key={n} className="animate-pulse">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-line rounded" />
              <div className="h-4 bg-line rounded w-48" />
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 bg-line rounded-full w-20" />
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-line rounded w-16" />
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-line rounded w-24" />
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex gap-2">
              <div className="w-7 h-7 bg-line rounded-md" />
              <div className="w-7 h-7 bg-line rounded-md" />
              <div className="w-7 h-7 bg-line rounded-md" />
              <div className="w-7 h-7 bg-line rounded-md" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default ResourceSkeleton;
