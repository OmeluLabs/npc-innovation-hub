// src/components/tasks/TaskList.tsx

import React from "react";
import type { Task } from "../../types/task.types";
import TaskCard from "./TaskCard";
import { ClipboardList } from "lucide-react";

// ── Skeleton ──
const TaskCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-line p-5 flex flex-col gap-3 animate-pulse">
    <div className="flex gap-2">
      <div className="h-5 w-20 bg-line rounded-full" />
      <div className="h-5 w-14 bg-surface-muted rounded-full" />
    </div>
    <div className="h-4 bg-line rounded w-3/4" />
    <div className="h-3 bg-surface-muted rounded w-full" />
    <div className="h-3 bg-surface-muted rounded w-5/6" />
    <div className="h-3 bg-surface-muted rounded w-1/3 mt-1" />
    <div className="h-8 bg-line rounded-lg mt-2" />
  </div>
);

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 min-w-0-all">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <TaskCardSkeleton key={n} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4 py-12 sm:py-20 text-ink-muted gap-3">
        <ClipboardList size={44} className="opacity-30" />
        <p className="font-semibold text-ink-muted text-base">
          No tasks assigned yet
        </p>
        <p className="text-sm text-center max-w-xs">
          Tasks assigned to you by your admin will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 min-w-0-all">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
