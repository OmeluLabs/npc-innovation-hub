// src/components/tasks/TaskCard.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ExternalLink, AlertCircle } from "lucide-react";
import type { Task } from "../../types/task.types";
import {
  getStatusColor,
  getPriorityColor,
  isTaskOverdue,
  getDaysUntilDue,
} from "../../types/task.types";

interface TaskCardProps {
  task: Task;
}

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();
  const overdue = isTaskOverdue(task.dueDate, task.status);
  const dueLabel = getDaysUntilDue(task.dueDate);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border transition-all duration-200
                  hover:shadow-md hover:-translate-y-0.5 flex flex-col
                  ${overdue ? "border-red-300 ring-1 ring-red-200" : "border-line"}`}
    >
      {/* Overdue banner */}
      {overdue && (
        <div className="flex items-center gap-1.5 bg-red-50 px-4 py-2 rounded-t-xl border-b border-red-100 text-red-600 text-xs font-semibold">
          <AlertCircle size={13} />
          Overdue — {dueLabel}
        </div>
      )}

      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1 min-w-0">
        {/* Badges row */}
        <div className="flex flex-wrap gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusColor(task.status)}`}
          >
            {task.status === "in-progress"
              ? "In Progress"
              : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-primary text-sm leading-snug line-clamp-2">
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-ink-muted line-clamp-2 flex-1">
          {task.description}
        </p>

        {/* Due date */}
        <div
          className={`flex items-center gap-1.5 text-xs font-medium
                      ${overdue ? "text-red-500" : "text-ink-muted"}`}
        >
          <Calendar size={13} />
          <span>Due {formatDate(task.dueDate)}</span>
          {!overdue && (
            <span className="ml-1 text-ink-muted">· {dueLabel}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-1 pt-3 border-t border-line">
          <button
            onClick={() => navigate(`/dashboard/tasks/${task.id}`)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-white
                       bg-secondary hover:bg-primary transition-colors duration-200"
          >
            View Details
          </button>

          {task.githubIssueLink && (
            <a
              href={task.githubIssueLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-line text-ink-muted
                         hover:border-line hover:text-primary transition-colors"
              title="Open GitHub Issue"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
