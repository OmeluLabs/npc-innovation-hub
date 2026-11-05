// src/components/tasks/TaskFilters.tsx

import React from "react";
import { Search } from "lucide-react";
import { TASK_STATUSES, TASK_PRIORITIES } from "../../types/task.types";
import type { TaskStatus, TaskPriority } from "../../types/task.types";

interface TaskFiltersProps {
  search: string;
  statusFilter: TaskStatus;
  priorityFilter: TaskPriority;
  onSearch: (value: string) => void;
  onStatusChange: (value: TaskStatus) => void;
  onPriorityChange: (value: TaskPriority) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  search,
  statusFilter,
  priorityFilter,
  onSearch,
  onStatusChange,
  onPriorityChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-line rounded-xl text-sm
                     bg-white focus:outline-none focus:ring-2 focus:ring-accent
                     focus:border-transparent transition"
        />
      </div>

      {/* Status */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
        className="px-3 py-2.5 border border-line rounded-xl text-sm text-ink-muted
                   bg-white focus:outline-none focus:ring-2 focus:ring-accent
                   focus:border-transparent transition"
      >
        {TASK_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Priority */}
      <select
        value={priorityFilter}
        onChange={(e) => onPriorityChange(e.target.value as TaskPriority)}
        className="px-3 py-2.5 border border-line rounded-xl text-sm text-ink-muted
                   bg-white focus:outline-none focus:ring-2 focus:ring-accent
                   focus:border-transparent transition"
      >
        {TASK_PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TaskFilters;
