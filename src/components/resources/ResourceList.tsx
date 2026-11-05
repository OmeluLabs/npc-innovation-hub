// src/components/resources/ResourceList.tsx

import React, { useEffect, useState } from "react";
import { ThumbsUp, FileText, Video, BookOpen } from "lucide-react";
import type { Resource } from "../../types/resource.types";
import { getAllResources } from "../../api/member/resource.api";
import type { PaginatedResourcesResponse } from "../../types/resource.types";

interface Props {
  title?: string;
  onSelect?: (resource: Resource) => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Video":
      return <Video size={14} className="text-red-400" />;
    case "Book":
      return <BookOpen size={14} className="text-secondary" />;
    default:
      return <FileText size={14} className="text-secondary" />;
  }
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Frontend":
      return "text-secondary";
    case "Backend":
      return "text-secondary";
    case "Cybersecurity":
      return "text-secondary";
    default:
      return "text-ink-muted";
  }
};

const ResourceList: React.FC<Props> = ({ title, onSelect }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAllResources();
        const data = response.data as PaginatedResourcesResponse;
        const sorted = [...(data.data?.resources || [])].sort(
          (a, b) => b.upvotes - a.upvotes,
        );
        setResources(sorted.slice(0, 10));
      } catch (err) {
        console.error("ResourceList: failed to load resources", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const mid = Math.ceil(resources.length / 2);
  const columns = [resources.slice(0, mid), resources.slice(mid)];

  return (
    <div>
      {title && <h3 className="text-xl font-bold text-center mb-6">{title}</h3>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-w-0-all">
          {[0, 1].map((col) => (
            <ul key={col} className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <li
                  key={n}
                  className="flex items-center gap-3 border-b pb-2 animate-pulse"
                >
                  <div className="w-8 h-8 bg-line rounded-lg shrink-0" />
                  <div className="flex-1 h-4 bg-line rounded" />
                  <div className="w-10 h-4 bg-surface-muted rounded" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <p className="text-center text-ink-muted text-sm py-8">
          No resources available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-w-0-all">
          {columns.map((col, idx) => (
            <ul key={idx} className="space-y-3">
              {col.map((res) => (
                <li
                  key={res.id}
                  onClick={() => onSelect?.(res)}
                  className={`flex items-center gap-3 border-b last:border-b-0 pb-3 group ${
                    onSelect
                      ? "cursor-pointer hover:bg-surface-muted rounded-lg px-2 -mx-2 transition"
                      : ""
                  }`}
                >
                  {/* Thumbnail */}
                  {res.imageUrl ? (
                    <img
                      src={res.imageUrl}
                      alt={res.title}
                      className="w-8 h-8 rounded-lg object-cover shrink-0 border border-line"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center shrink-0">
                      {getTypeIcon(res.type)}
                    </div>
                  )}

                  {/* Title & category */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-primary truncate group-hover:text-secondary transition">
                      {res.title}
                    </div>
                    <div
                      className={`text-xs font-medium ${getCategoryColor(res.category)}`}
                    >
                      {res.category}
                    </div>
                  </div>

                  {/* Upvotes */}
                  <div className="flex items-center gap-1 text-ink-muted text-xs shrink-0">
                    <ThumbsUp size={12} />
                    <span>{res.upvotes}</span>
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceList;
