// src/pages/tasks/MyTasks.tsx

import React, { useEffect, useState, useMemo } from "react";
import { useTasks } from "../../hooks/useTasks";
import TaskStats from "../../components/tasks/TaskStats";
import TaskList from "../../components/tasks/TaskList";
import TaskFilters from "../../components/tasks/TaskFilters";
import type { TaskStatus, TaskPriority } from "../../types/task.types";

const TABS: { label: string; value: TaskStatus }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

const MyTasks: React.FC = () => {
  const { tasks, loading, error, fetchAssignedTasks } = useTasks();

  const [activeTab, setActiveTab] = useState<TaskStatus>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority>("all");

  useEffect(() => {
    fetchAssignedTasks();
  }, [fetchAssignedTasks]);

  // Tab counts
  const tabCount = (status: TaskStatus) =>
    status === "all"
      ? tasks.length
      : tasks.filter((t) => t.status === status).length;

  // Filtered tasks
  const displayedTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesTab = activeTab === "all" || t.status === activeTab;
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || t.priority === priorityFilter;
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());

      return matchesTab && matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, activeTab, statusFilter, priorityFilter, search]);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">My Tasks</h2>
          <p className="text-sm text-ink-muted mt-0.5">
            Tasks assigned to you by your admin
          </p>
        </div>
      </div>

      {/* Stats + progress bar */}
      {!loading && tasks.length > 0 && <TaskStats tasks={tasks} />}

      {/* Error banner */}
      {error && !loading && (
        <div
          className="flex items-center gap-3 bg-red-50 border border-red-100
                        text-red-600 rounded-xl px-5 py-4 mb-5 text-sm"
        >
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
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0
                 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898
                 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-muted p-1 rounded-xl mb-5 max-w-full overflow-x-auto hide-scrollbar sm:w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex flex-shrink-0 whitespace-nowrap items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold
                        transition-all duration-200
                        ${
                          activeTab === tab.value
                            ? "bg-white text-primary shadow-sm"
                            : "text-ink-muted hover:text-primary"
                        }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                          ${
                            activeTab === tab.value
                              ? "bg-surface-muted text-primary"
                              : "bg-line text-ink-muted"
                          }`}
            >
              {tabCount(tab.value)}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TaskFilters
          search={search}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onSearch={setSearch}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
        />
      </div>

      {/* Task list */}
      <TaskList tasks={displayedTasks} loading={loading} />
    </div>
  );
};

export default MyTasks;
