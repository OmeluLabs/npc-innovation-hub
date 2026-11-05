// src/components/dashboard/TaskOverview.tsx

import React from "react";
import type { Task } from "../../types/task.types";
import { isTaskOverdue } from "../../types/task.types";

interface TaskOverviewProps {
  tasks: Task[];
}

const TaskOverview: React.FC<TaskOverviewProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProg = tasks.filter((t) => t.status === "in-progress").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const overdue = tasks.filter((t) =>
    isTaskOverdue(t.dueDate, t.status),
  ).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG donut
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const filled = (pct / 100) * circ;
  const gap = circ - filled;

  // Two-tone scale: darker navy = more urgent, light gray-blue = least urgent.
  const segments = [
    { label: "Overdue", count: overdue, color: "rgb(var(--navy-900))" },
    { label: "Completed", count: completed, color: "rgb(var(--navy-600))" },
    { label: "In Progress", count: inProg, color: "rgb(var(--navy-400))" },
    { label: "Pending", count: pending, color: "rgb(var(--mist-400))" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-mist-300 p-5">
      <h3 className="text-sm font-bold text-navy-800 mb-4">Task Overview</h3>

      {total === 0 ? (
        <p className="text-xs text-mist-500 text-center py-4">No tasks yet</p>
      ) : (
        <>
          {/* Donut SVG */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  className="stroke-mist-300"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  strokeWidth="12"
                  strokeDasharray={`${filled} ${gap}`}
                  strokeLinecap="round"
                  className="stroke-navy-800 transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-navy-800">{pct}%</span>
                <span className="text-[10px] text-mist-500 font-medium">
                  done
                </span>
              </div>
            </div>
          </div>

          {/* Segmented bar */}
          <div className="w-full h-2.5 rounded-full overflow-hidden flex mb-4 bg-mist-200">
            {segments.map((s) =>
              s.count > 0 ? (
                <div
                  key={s.label}
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(s.count / total) * 100}%`,
                    backgroundColor: s.color,
                  }}
                />
              ) : null,
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-y-2 min-w-0-all">
            {segments.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-mist-400"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-xs text-mist-600">
                  {s.label} <strong className="text-navy-800">{s.count}</strong>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskOverview;
