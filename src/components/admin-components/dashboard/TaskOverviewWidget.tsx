// // ============================================================
// // TaskOverviewWidget.tsx
// // Donut chart of task statuses + overdue warning badge
// // ============================================================

// import React from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// import type { TaskAnalytics } from "../../../types/dashboard.types";

// interface TaskOverviewWidgetProps {
//   analytics: TaskAnalytics | null;
//   loading: boolean;
// }

// const STATUS_CONFIG = {
// };

// interface TooltipPayload {
//   name: string;
//   value: number;
//   payload: {
//     label: string;
//     color: string;
//   };
// }

// const CustomTooltip: React.FC<{
//   active?: boolean;
//   payload?: TooltipPayload[];
// }> = ({ active, payload }) => {
//   if (!active || !payload?.length) return null;
//   const item = payload[0];
//   return (
//     <div className="bg-white px-3 py-2 rounded-xl shadow-lg border border-line text-sm">
//       <span className="font-semibold text-primary">{item.name}</span>
//       <span className="ml-2 text-ink-muted">{item.value} tasks</span>
//     </div>
//   );
// };

// const SkeletonWidget: React.FC = () => (
//   <div className="bg-white rounded-2xl p-6 border border-line shadow-sm animate-pulse">
//     <div className="flex justify-between items-center mb-4">
//       <div className="w-32 h-5 bg-line rounded" />
//       <div className="w-20 h-5 bg-line rounded-full" />
//     </div>
//     <div className="w-40 h-40 bg-line rounded-full mx-auto my-6" />
//     <div className="space-y-2">
//       {[1, 2, 3].map((i) => (
//         <div key={i} className="flex justify-between">
//           <div className="w-24 h-3 bg-line rounded" />
//           <div className="w-8 h-3 bg-line rounded" />
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const TaskOverviewWidget: React.FC<TaskOverviewWidgetProps> = ({
//   analytics,
//   loading,
// }) => {
//   if (loading) return <SkeletonWidget />;

//   if (!analytics) {
//     return (
//       <div className="bg-white rounded-2xl p-6 border border-line shadow-sm flex items-center justify-center h-72">
//         <p className="text-ink-muted text-sm">No task data available</p>
//       </div>
//     );
//   }

//   const chartData = Object.entries(STATUS_CONFIG)
//     .map(([key, config]) => ({
//       name: config.label,
//       value: analytics.byStatus[key as keyof typeof analytics.byStatus] ?? 0,
//       color: config.color,
//       label: config.label,
//     }))
//     .filter((d) => d.value > 0);

//   const hasData = chartData.length > 0;

//   return (
//     <div className="bg-white rounded-2xl p-6 border border-line shadow-sm hover:shadow-md transition-shadow duration-200">
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
//         <div>
//           <h3 className="font-semibold text-primary text-sm">Task Overview</h3>
//           <p className="text-xs text-ink-muted mt-0.5">
//             {analytics.total} total tasks
//           </p>
//         </div>
//         {analytics.overdue > 0 && (
//           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full ring-1 ring-red-200 animate-pulse">
//             <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
//             {analytics.overdue} Overdue
//           </span>
//         )}
//       </div>

//       {/* Completion Rate */}
//       <div className="mb-4">
//         <div className="flex justify-between items-center mb-1.5">
//           <span className="text-xs text-ink-muted">Completion Rate</span>
//           <span className="text-xs font-bold text-emerald-600">
//             {analytics.completionRate}%
//           </span>
//         </div>
//         <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
//           <div
//             className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700"
//             style={{ width: `${analytics.completionRate}%` }}
//           />
//         </div>
//       </div>

//       {/* Donut Chart */}
//       {hasData ? (
//         <ResponsiveContainer width="100%" height={180}>
//           <PieChart>
//             <Pie
//               data={chartData}
//               cx="50%"
//               cy="50%"
//               innerRadius={48}
//               outerRadius={75}
//               paddingAngle={3}
//               dataKey="value"
//             >
//               {chartData.map((entry, index) => (
//                 <Cell key={index} fill={entry.color} stroke="none" />
//               ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//           </PieChart>
//         </ResponsiveContainer>
//       ) : (
//         <div className="h-[180px] flex items-center justify-center">
//           <p className="text-ink-muted text-xs">No task data to display</p>
//         </div>
//       )}

//       {/* Legend */}
//       <div className="mt-3 space-y-2">
//         {Object.entries(STATUS_CONFIG).map(([key, config]) => {
//           const count =
//             analytics.byStatus[key as keyof typeof analytics.byStatus] ?? 0;
//           if (count === 0) return null;
//           return (
//             <div key={key} className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <span
//                   className="w-2 h-2 rounded-full"
//                   style={{ backgroundColor: config.color }}
//                 />
//                 <span className="text-xs text-ink-muted">{config.label}</span>
//               </div>
//               <span className="text-xs font-semibold text-primary">
//                 {count}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default TaskOverviewWidget;

// ============================================================
// TaskOverviewWidget.tsx
// Donut chart — statuses: pending | in-progress | completed
// ============================================================

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { TaskAnalytics } from "../../../types/dashboard.types";

interface TaskOverviewWidgetProps {
  analytics: TaskAnalytics | null;
  loading: boolean;
}

// Keys match task.types.ts exactly — "in-progress" with hyphen
const STATUS_CONFIG: Record<
  "pending" | "in-progress" | "completed",
  { label: string; color: string }
> = {
  completed: { label: "Completed", color: "rgb(var(--color-success))" },
  "in-progress": { label: "In Progress", color: "rgb(var(--navy-700))" },
  pending: { label: "Pending", color: "rgb(var(--color-warning))" },
};

interface TooltipPayload {
  name: string;
  value: number;
}

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipPayload[];
}> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-3 py-2 rounded-xl shadow-lg border border-mist-300 text-sm">
      <span className="font-semibold text-navy-800">{payload[0].name}</span>
      <span className="ml-2 text-mist-600">{payload[0].value} tasks</span>
    </div>
  );
};

const SkeletonWidget: React.FC = () => (
  <div className="chart-box bg-white rounded-2xl p-4 border border-mist-300 shadow-sm animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="w-32 h-5 bg-mist-200 rounded" />
      <div className="w-20 h-5 bg-mist-200 rounded-full" />
    </div>
    <div className="w-40 h-40 bg-mist-200 rounded-full mx-auto my-6" />
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between">
          <div className="w-24 h-3 bg-mist-200 rounded" />
          <div className="w-8 h-3 bg-mist-200 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const TaskOverviewWidget: React.FC<TaskOverviewWidgetProps> = ({
  analytics,
  loading,
}) => {
  if (loading) return <SkeletonWidget />;

  if (!analytics) {
    return (
      <div className="chart-box bg-white rounded-2xl p-4 border border-mist-300 shadow-sm flex items-center justify-center h-72">
        <p className="text-mist-500 text-sm">No task data available</p>
      </div>
    );
  }

  // Build chart data using correct hyphenated key
  const chartData = (
    Object.entries(STATUS_CONFIG) as Array<
      [keyof typeof STATUS_CONFIG, { label: string; color: string }]
    >
  )
    .map(([key, config]) => ({
      name: config.label,
      value: analytics.byStatus[key] ?? 0,
      color: config.color,
    }))
    .filter((d) => d.value > 0);

  const hasData = chartData.length > 0;

  return (
    <div className="chart-box bg-white rounded-2xl p-4 border border-mist-300 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="font-semibold text-navy-800 text-sm">Task Overview</h3>
          <p className="text-xs text-mist-500 mt-0.5">
            {analytics.total} total tasks
          </p>
        </div>
        {analytics.overdue > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full ring-1 ring-red-200 animate-pulse">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            {analytics.overdue} Overdue
          </span>
        )}
      </div>

      {/* Completion Rate bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-mist-600">Completion Rate</span>
          <span className="text-xs font-bold text-emerald-600">
            {analytics.completionRate}%
          </span>
        </div>
        <div className="w-full h-2 bg-mist-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${analytics.completionRate}%` }}
          />
        </div>
      </div>

      {/* Donut Chart - 140px, not the original 180px, part of fitting
          this whole row in view without scrolling. */}
      {hasData ? (
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={60}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[140px] flex items-center justify-center">
          <p className="text-mist-500 text-xs">No task data to display</p>
        </div>
      )}

      {/* Legend — only shows statuses with count > 0 */}
      <div className="mt-2 space-y-1.5">
        {(
          Object.entries(STATUS_CONFIG) as Array<
            [keyof typeof STATUS_CONFIG, { label: string; color: string }]
          >
        ).map(([key, config]) => {
          const count = analytics.byStatus[key] ?? 0;
          if (count === 0) return null;
          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-xs text-mist-600">{config.label}</span>
              </div>
              <span className="text-xs font-semibold text-navy-700">
                {count}
              </span>
            </div>
          );
        })}

        {/* Overdue shown as a separate warning row if any */}
        {analytics.overdue > 0 && (
          <div className="flex items-center justify-between pt-1 border-t border-mist-200 mt-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
              <span className="text-xs text-rose-500">Overdue</span>
            </div>
            <span className="text-xs font-semibold text-rose-600">
              {analytics.overdue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskOverviewWidget;
