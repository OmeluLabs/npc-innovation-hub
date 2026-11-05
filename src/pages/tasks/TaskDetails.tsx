// src/pages/tasks/TaskDetails.tsx

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import {
  getStatusColor,
  getPriorityColor,
  isTaskOverdue,
  getDaysUntilDue,
  getUserFullName,
  getUserInitials,
} from "../../types/task.types";

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const formatDateShort = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedTask,
    loading,
    error,
    fetchAssignedTaskById,
    clearSelectedTask,
  } = useTasks();

  useEffect(() => {
    if (id) fetchAssignedTaskById(id);
    return () => clearSelectedTask();
  }, [id, fetchAssignedTaskById, clearSelectedTask]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6 animate-pulse">
          <div className="w-8 h-8 bg-line rounded-full" />
          <div className="h-5 bg-line rounded w-32" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-line p-7 flex flex-col gap-5 animate-pulse">
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-line rounded-full" />
            <div className="h-6 w-16 bg-surface-muted rounded-full" />
          </div>
          <div className="h-7 bg-line rounded w-2/3" />
          <div className="h-4 bg-surface-muted rounded w-full" />
          <div className="h-4 bg-surface-muted rounded w-5/6" />
          <div className="h-4 bg-surface-muted rounded w-4/5" />
        </div>
      </div>
    );
  }

  // ── Error / Not found ──
  if (error || !selectedTask) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4 py-12 sm:py-20 text-ink-muted gap-4">
        <p className="text-lg font-semibold">{error || "Task not found."}</p>
        <button
          onClick={() => navigate("/dashboard/tasks")}
          className="flex items-center gap-2 text-secondary hover:underline text-sm"
        >
          <ArrowLeft size={15} />
          Back to My Tasks
        </button>
      </div>
    );
  }

  const task = selectedTask;
  const overdue = isTaskOverdue(task.dueDate, task.status);
  const dueLabel = getDaysUntilDue(task.dueDate);

  return (
    <div className="max-w-3xl">
      {/* Back navigation */}
      <button
        onClick={() => navigate("/dashboard/tasks")}
        className="flex items-center gap-2 text-ink-muted hover:text-primary
                   text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to My Tasks
      </button>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-sm border border-line overflow-hidden">
        {/* Overdue banner */}
        {overdue && (
          <div
            className="flex items-center gap-2 bg-red-50 border-b border-red-100
                          px-6 py-3 text-red-600 text-sm font-semibold"
          >
            <AlertCircle size={15} />
            This task is overdue — {dueLabel}
          </div>
        )}

        <div className="p-7 flex flex-col gap-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(task.status)}`}
            >
              {task.status === "in-progress"
                ? "In Progress"
                : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${getPriorityColor(task.priority)}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{" "}
              Priority
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-primary leading-snug">
            {task.title}
          </h1>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">
              Description
            </h3>
            <p className="text-primary text-sm leading-relaxed bg-surface-muted rounded-xl p-4 border border-line">
              {task.description}
            </p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due date */}
            <div className="bg-surface-muted rounded-xl p-4 border border-line">
              <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">
                <Calendar size={13} />
                Due Date
              </div>
              <div
                className={`text-sm font-semibold ${overdue ? "text-red-600" : "text-primary"}`}
              >
                {formatDate(task.dueDate)}
              </div>
              <div
                className={`text-xs mt-0.5 ${overdue ? "text-red-400" : "text-ink-muted"}`}
              >
                {dueLabel}
              </div>
            </div>

            {/* Created at */}
            <div className="bg-surface-muted rounded-xl p-4 border border-line">
              <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">
                <Clock size={13} />
                Created
              </div>
              <div className="text-sm font-semibold text-primary">
                {formatDateShort(task.createdAt)}
              </div>
            </div>
          </div>

          {/* GitHub link */}
          {task.githubIssueLink && (
            <div>
              <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">
                GitHub Issue
              </h3>
              <a
                href={task.githubIssueLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-secondary
                           hover:text-primary font-medium transition-colors"
              >
                <ExternalLink size={14} />
                {task.githubIssueLink}
              </a>
            </div>
          )}

          {/* People */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-line">
            {/* Creator */}
            {task.creator && (
              <div>
                <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">
                  Assigned By
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full bg-surface-muted text-primary
                                  flex items-center justify-center text-sm font-bold shrink-0"
                  >
                    {getUserInitials(task.creator)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-primary">
                      {getUserFullName(task.creator)}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {task.creator.email}
                    </div>
                    <div className="text-xs text-secondary font-medium">
                      {task.creator.role}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Assignee */}
            {task.assignee && (
              <div>
                <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">
                  Assigned To
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full bg-green-100 text-green-700
                                  flex items-center justify-center text-sm font-bold shrink-0"
                  >
                    {getUserInitials(task.assignee)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-primary">
                      {getUserFullName(task.assignee)}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {task.assignee.email}
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      {task.assignee.role}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
