// /**
//  * TasksTable Component
//  * Main table for displaying and managing tasks
//  */

// import React from "react";
// import { useState, useEffect, useRef } from "react";
// import type {
//   Task,
//   User,
//   TaskStatus,
//   TaskPriority,
// } from "../../types/task.types";
// import { useTasks } from "../../hooks/useTasks";
// import { TaskFilters } from "./TaskFilters";
// import { TaskFormModal } from "./TaskFormModal";
// import { TaskDetailsModal } from "./TaskDetailsModal";
// import { AssignTaskModal } from "./AssignTaskModal";
// import { DeleteConfirmModal } from "./DeleteConfirmModal";
// import { Toast, useToast } from "./Toast";
// import { StatusBadge } from "./StatusBadge";
// import { PriorityBadge } from "./PriorityBadge";
// import { UserAvatarChip } from "./UserAvatarChip";
// import { isTaskOverdue, getDaysUntilDue } from "../../types/task.types";

// interface TasksTableProps {
//   members: User[];
// }

// export default function TasksTable({ members }: TasksTableProps) {
//   const {
//     tasks,
//     loading,
//     error,
//     fetchTasks,
//     handleUpdateTask,
//     handleDeleteTask,
//     handleAssignTask,
//   } = useTasks();

//   const { toast, showToast, hideToast } = useToast();

//   // Modal states
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [actionMenuId, setActionMenuId] = useState<string | null>(null);

//   // Filter states
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState<TaskStatus>("all");
//   const [priorityFilter, setPriorityFilter] = useState<TaskPriority>("all");
//   const [assigneeFilter, setAssigneeFilter] = useState("all");

//   const menuRef = useRef<HTMLDivElement>(null);

//   // Fetch tasks on mount
//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setActionMenuId(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Filter tasks
//   const filteredTasks = tasks.filter((task) => {
//     const matchesSearch =
//       task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       task.assignee.firstName
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       task.assignee.lastName.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" || task.status === statusFilter;
//     const matchesPriority =
//       priorityFilter === "all" || task.priority === priorityFilter;
//     const matchesAssignee =
//       assigneeFilter === "all" || task.assignedTo === assigneeFilter;

//     return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
//   });

//   // Get unique assignees for filter
//   const availableAssignees = Array.from(
//     new Map(tasks.map((task) => [task.assignee.id, task.assignee])).values(),
//   );

//   const toggleActionMenu = (taskId: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setActionMenuId(actionMenuId === taskId ? null : taskId);
//   };

//   // Handle view
//   const handleView = (task: Task) => {
//     setSelectedTask(task);
//     setIsDetailsModalOpen(true);
//     setActionMenuId(null);
//   };

//   // Handle edit
//   const handleEdit = (task: Task) => {
//     setSelectedTask(task);
//     setIsEditModalOpen(true);
//     setActionMenuId(null);
//   };

//   const handleUpdate = async (data: Record<string, string>) => {
//     if (!selectedTask) return;

//     setIsSubmitting(true);
//     const success = await handleUpdateTask(selectedTask.id, {
//       title: data.title,
//       description: data.description,
//       status: data.status as "pending" | "in-progress" | "completed",
//       priority: data.priority as "low" | "medium" | "high",
//       dueDate: data.dueDate,
//       githubIssueLink: data.githubIssueLink,
//       assignedTo: data.assignedTo,
//     });

//     if (success) {
//       setIsEditModalOpen(false);
//       setSelectedTask(null);
//       showToast("Task updated successfully!", "success");
//     } else {
//       showToast(error || "Failed to update task", "error");
//     }
//     setIsSubmitting(false);
//   };

//   // Handle delete
//   const handleDeleteClick = (task: Task) => {
//     setSelectedTask(task);
//     setIsDeleteModalOpen(true);
//     setActionMenuId(null);
//   };

//   const confirmDelete = async () => {
//     if (!selectedTask) return;

//     setIsSubmitting(true);
//     const success = await handleDeleteTask(selectedTask.id);
//     if (success) {
//       setIsDeleteModalOpen(false);
//       setSelectedTask(null);
//       showToast("Task deleted successfully!", "success");
//     } else {
//       showToast(error || "Failed to delete task", "error");
//     }
//     setIsSubmitting(false);
//   };

//   // Handle reassign
//   const handleReassignClick = () => {
//     setIsDetailsModalOpen(false);
//     setIsAssignModalOpen(true);
//   };

//   const handleReassign = async (data: {
//     userId: string;
//     githubIssueLink?: string;
//   }) => {
//     if (!selectedTask) return;

//     setIsSubmitting(true);
//     const success = await handleAssignTask(selectedTask.id, data);
//     if (success) {
//       setIsAssignModalOpen(false);
//       setSelectedTask(null);
//       showToast("Task reassigned successfully!", "success");
//     } else {
//       showToast(error || "Failed to reassign task", "error");
//     }
//     setIsSubmitting(false);
//   };

//   // Skeleton loader
//   if (loading && tasks.length === 0) {
//     return (
//       <div className="space-y-4">
//         {[...Array(5)].map((_, i) => (
//           <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
//             <div className="space-y-3">
//               <div className="h-4 bg-line rounded w-3/4" />
//               <div className="h-3 bg-line rounded w-1/2" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Filters */}
//       <TaskFilters
//         searchQuery={searchQuery}
//         onSearchChange={setSearchQuery}
//         statusFilter={statusFilter}
//         onStatusChange={setStatusFilter}
//         priorityFilter={priorityFilter}
//         onPriorityChange={setPriorityFilter}
//         assigneeFilter={assigneeFilter}
//         onAssigneeChange={setAssigneeFilter}
//         availableAssignees={availableAssignees}
//       />

//       {/* Error State */}
//       {error && !loading && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
//           {error}
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && filteredTasks.length === 0 && (
//         <div className="bg-white rounded-2xl px-4 py-10 sm:p-12 text-center">
//           <svg
//             className="mx-auto h-16 w-16 text-ink-muted mb-4"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
//             />
//           </svg>
//           <h3 className="text-lg font-medium text-primary mb-2">
//             No tasks found
//           </h3>
//           <p className="text-ink-muted">
//             {searchQuery ||
//             statusFilter !== "all" ||
//             priorityFilter !== "all" ||
//             assigneeFilter !== "all"
//               ? "Try adjusting your filters"
//               : "Create your first task to get started"}
//           </p>
//         </div>
//       )}

//       {/* Tasks Table */}
//       {filteredTasks.length > 0 && (
//         <div className="bg-white rounded-2xl shadow-sm border border-line overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gradient-to-r from-secondary to-secondary text-white">
//                   <th className="px-6 py-4 text-left text-sm font-semibold">
//                     Task
//                   </th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">
//                     Priority
//                   </th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">
//                     Assignee
//                   </th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">
//                     Due Date
//                   </th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">
//                     GitHub
//                   </th>
//                   <th className="px-6 py-4 text-center text-sm font-semibold">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-line">
//                 {filteredTasks.map((task) => {
//                   const isOverdue = isTaskOverdue(task.dueDate, task.status);
//                   const daysInfo = getDaysUntilDue(task.dueDate);

//                   return (
//                     <tr
//                       key={task.id}
//                       className="hover:bg-surface-muted transition-colors cursor-pointer"
//                       onClick={() => handleView(task)}
//                     >
//                       {/* Task Title */}
//                       <td className="px-6 py-4">
//                         <div className="max-w-md">
//                           <p className="font-semibold text-primary truncate">
//                             {task.title}
//                           </p>
//                           <p className="text-sm text-ink-muted truncate">
//                             {task.description}
//                           </p>
//                         </div>
//                       </td>

//                       {/* Status */}
//                       <td className="px-6 py-4">
//                         <StatusBadge status={task.status} />
//                       </td>

//                       {/* Priority */}
//                       <td className="px-6 py-4">
//                         <PriorityBadge priority={task.priority} />
//                       </td>

//                       {/* Assignee */}
//                       <td className="px-6 py-4">
//                         <UserAvatarChip user={task.assignee} />
//                       </td>

//                       {/* Due Date */}
//                       <td className="px-6 py-4">
//                         <div
//                           className={
//                             isOverdue ? "text-red-600" : "text-primary"
//                           }
//                         >
//                           <p className="text-sm font-medium">
//                             {new Date(task.dueDate).toLocaleDateString(
//                               "en-US",
//                               {
//                                 month: "short",
//                                 day: "numeric",
//                                 year: "numeric",
//                               },
//                             )}
//                           </p>
//                           <p
//                             className={`text-xs ${isOverdue ? "font-semibold" : "text-ink-muted"}`}
//                           >
//                             {daysInfo}
//                           </p>
//                         </div>
//                       </td>

//                       {/* GitHub Link */}
//                       <td className="px-6 py-4">
//                         {task.githubIssueLink ? (
//                           <a
//                             href={task.githubIssueLink}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             onClick={(e) => e.stopPropagation()}
//                             className="inline-flex items-center text-secondary hover:text-primary"
//                             title="View GitHub Issue"
//                           >
//                             <svg
//                               className="w-5 h-5"
//                               fill="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
//                             </svg>
//                           </a>
//                         ) : (
//                           <span className="text-ink-muted">-</span>
//                         )}
//                       </td>

//                       {/* Actions */}
//                       <td
//                         className="px-6 py-4 relative"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <button
//                           onClick={(e) => toggleActionMenu(task.id, e)}
//                           className="p-2 hover:bg-surface-muted rounded-lg transition-colors mx-auto block"
//                         >
//                           <svg
//                             className="w-5 h-5 text-ink-muted"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
//                           </svg>
//                         </button>

//                         {/* Action Menu */}
//                         {actionMenuId === task.id && (
//                           <div
//                             ref={menuRef}
//                             className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-line py-1 min-w-[160px] z-10"
//                           >
//                             <button
//                               onClick={() => handleView(task)}
//                               className="w-full px-4 py-2 text-left text-sm hover:bg-surface-muted flex items-center gap-2 text-primary"
//                             >
//                               <svg
//                                 className="w-4 h-4"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                 />
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                                 />
//                               </svg>
//                               View Details
//                             </button>
//                             <button
//                               onClick={() => handleEdit(task)}
//                               className="w-full px-4 py-2 text-left text-sm hover:bg-surface-muted flex items-center gap-2 text-primary"
//                             >
//                               <svg
//                                 className="w-4 h-4"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                                 />
//                               </svg>
//                               Edit
//                             </button>
//                             <hr className="my-1" />
//                             <button
//                               onClick={() => handleDeleteClick(task)}
//                               className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
//                             >
//                               <svg
//                                 className="w-4 h-4"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                                 />
//                               </svg>
//                               Delete
//                             </button>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Table Footer */}
//           <div className="px-6 py-4 bg-surface-muted border-t border-line">
//             <p className="text-sm text-ink-muted">
//               Showing{" "}
//               <span className="font-semibold">{filteredTasks.length}</span> of{" "}
//               <span className="font-semibold">{tasks.length}</span> tasks
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Modals */}
//       <TaskFormModal
//         isOpen={isEditModalOpen}
//         onClose={() => {
//           setIsEditModalOpen(false);
//           setSelectedTask(null);
//         }}
//         onSubmit={handleUpdate}
//         initialData={selectedTask}
//         isLoading={isSubmitting}
//         members={members}
//       />

//       <TaskDetailsModal
//         isOpen={isDetailsModalOpen}
//         onClose={() => {
//           setIsDetailsModalOpen(false);
//           setSelectedTask(null);
//         }}
//         task={selectedTask}
//         onEdit={() => {
//           setIsDetailsModalOpen(false);
//           setIsEditModalOpen(true);
//         }}
//         onDelete={() => {
//           setIsDetailsModalOpen(false);
//           setIsDeleteModalOpen(true);
//         }}
//         onReassign={handleReassignClick}
//       />

//       <AssignTaskModal
//         isOpen={isAssignModalOpen}
//         onClose={() => {
//           setIsAssignModalOpen(false);
//           setSelectedTask(null);
//         }}
//         onSubmit={handleReassign}
//         members={members}
//         currentAssignee={selectedTask?.assignedTo}
//         isLoading={isSubmitting}
//       />

//       <DeleteConfirmModal
//         isOpen={isDeleteModalOpen}
//         title="Delete Task"
//         message={`Are you sure you want to delete "${selectedTask?.title}"? This action cannot be undone.`}
//         onConfirm={confirmDelete}
//         onCancel={() => {
//           setIsDeleteModalOpen(false);
//           setSelectedTask(null);
//         }}
//         isLoading={isSubmitting}
//       />

//       {/* Toast */}
//       <Toast
//         message={toast.message}
//         type={toast.type}
//         isVisible={toast.isVisible}
//         onClose={hideToast}
//       />
//     </div>
//   );
// }

/**
 * TasksTable Component
 * Main table for displaying and managing tasks
 */

import React from "react";
import { useState, useEffect, useRef } from "react";
import type {
  Task,
  User,
  TaskStatus,
  TaskPriority,
} from "../../types/task.types";
import { useTasks } from "../../hooks/useTasks";
import { TaskFilters } from "./TaskFilters";
import { TaskFormModal } from "./TaskFormModal";
import { TaskDetailsModal } from "./TaskDetailsModal";
import { AssignTaskModal } from "./AssignTaskModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Toast, useToast } from "./Toast";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { UserAvatarChip } from "./UserAvatarChip";
import { isTaskOverdue, getDaysUntilDue } from "../../types/task.types";
import ResponsiveTable from "../ui/ResponsiveTable";
import MobileCardRow from "../ui/MobileCardRow";

interface TasksTableProps {
  members: User[];
  onTasksChange?: () => Promise<void>;
}

export default function TasksTable({
  members,
  onTasksChange,
}: TasksTableProps) {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    handleUpdateTask,
    handleDeleteTask,
    handleAssignTask,
  } = useTasks();

  const { toast, showToast, hideToast } = useToast();

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority>("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActionMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      task.assignee.lastName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesAssignee =
      assigneeFilter === "all" || task.assignedTo === assigneeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  // Get unique assignees for filter
  const availableAssignees = Array.from(
    new Map(tasks.map((task) => [task.assignee.id, task.assignee])).values(),
  );

  const toggleActionMenu = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionMenuId(actionMenuId === taskId ? null : taskId);
  };

  // Handle view
  const handleView = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
    setActionMenuId(null);
  };

  // Handle edit
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
    setActionMenuId(null);
  };

  const handleUpdate = async (data: Record<string, string>) => {
    if (!selectedTask) return;

    setIsSubmitting(true);
    const success = await handleUpdateTask(selectedTask.id, {
      title: data.title,
      description: data.description,
      status: data.status as "pending" | "in-progress" | "completed",
      priority: data.priority as "low" | "medium" | "high",
      dueDate: data.dueDate,
      githubIssueLink: data.githubIssueLink,
      assignedTo: data.assignedTo,
    });

    if (success) {
      setIsEditModalOpen(false);
      setSelectedTask(null);
      showToast("Task updated successfully!", "success");
      // Refresh parent component tasks with delay
      if (onTasksChange) {
        setTimeout(async () => {
          await onTasksChange();
        }, 300);
      }
    } else {
      showToast(error || "Failed to update task", "error");
    }
    setIsSubmitting(false);
  };

  // Handle delete
  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
    setActionMenuId(null);
  };

  const confirmDelete = async () => {
    if (!selectedTask) return;

    setIsSubmitting(true);
    const success = await handleDeleteTask(selectedTask.id);
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
      showToast("Task deleted successfully!", "success");
      // Refresh parent component tasks with delay
      if (onTasksChange) {
        setTimeout(async () => {
          await onTasksChange();
        }, 300);
      }
    } else {
      showToast(error || "Failed to delete task", "error");
    }
    setIsSubmitting(false);
  };

  // Handle reassign
  const handleReassignClick = () => {
    setIsDetailsModalOpen(false);
    setIsAssignModalOpen(true);
  };

  const handleReassign = async (data: {
    userId: string;
    githubIssueLink?: string;
  }) => {
    if (!selectedTask) return;

    setIsSubmitting(true);
    const success = await handleAssignTask(selectedTask.id, data);
    if (success) {
      setIsAssignModalOpen(false);
      setSelectedTask(null);
      showToast("Task reassigned successfully!", "success");
      // Refresh parent component tasks with delay
      if (onTasksChange) {
        setTimeout(async () => {
          await onTasksChange();
        }, 300);
      }
    } else {
      showToast(error || "Failed to reassign task", "error");
    }
    setIsSubmitting(false);
  };

  // Action menu, shared by the desktop table row and the mobile card.
  const renderActionMenu = (task: Task) => (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={(e) => toggleActionMenu(task.id, e)}
        className="p-2 hover:bg-mist-100 rounded-lg transition-colors block"
      >
        <svg
          className="w-5 h-5 text-navy-700"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {actionMenuId === task.id && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-mist-300 py-1 min-w-[160px] z-10"
        >
          <button
            onClick={() => handleView(task)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-mist-100 flex items-center gap-2 text-navy-800"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View Details
          </button>
          <button
            onClick={() => handleEdit(task)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-mist-100 flex items-center gap-2 text-navy-800"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
          <hr className="my-1" />
          <button
            onClick={() => handleDeleteClick(task)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );

  // Skeleton loader
  if (loading && tasks.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-mist-200 rounded w-3/4" />
              <div className="h-3 bg-mist-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        assigneeFilter={assigneeFilter}
        onAssigneeChange={setAssigneeFilter}
        availableAssignees={availableAssignees}
      />

      {/* Error State */}
      {error && !loading && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTasks.length === 0 && (
        <div className="bg-white rounded-2xl px-4 py-10 sm:p-12 text-center">
          <svg
            className="mx-auto h-16 w-16 text-mist-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <h3 className="text-lg font-medium text-navy-800 mb-2">
            No tasks found
          </h3>
          <p className="text-mist-600">
            {searchQuery ||
            statusFilter !== "all" ||
            priorityFilter !== "all" ||
            assigneeFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first task to get started"}
          </p>
        </div>
      )}

      {/* Tasks Table */}
      {filteredTasks.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-mist-300 overflow-hidden">
          <ResponsiveTable
            table={
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-navy-800 text-white">
                    {/* Sticky first column - see EventsTable.tsx for why. */}
                    <th className="px-6 py-4 text-left text-sm font-semibold sticky left-0 z-10 bg-navy-800">
                      Task
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Assignee
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      GitHub
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-200">
                  {filteredTasks.map((task) => {
                    const isOverdue = isTaskOverdue(task.dueDate, task.status);
                    const daysInfo = getDaysUntilDue(task.dueDate);

                    return (
                      <tr
                        key={task.id}
                        className="hover:bg-mist-100 transition-colors cursor-pointer"
                        onClick={() => handleView(task)}
                      >
                        {/* Task Title */}
                        <td className="px-6 py-4 sticky left-0 z-[1] bg-white border-r border-mist-200">
                          <div className="max-w-md">
                            <p className="font-semibold text-navy-800 truncate">
                              {task.title}
                            </p>
                            <p className="text-sm text-mist-600 truncate">
                              {task.description}
                            </p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusBadge status={task.status} />
                        </td>

                        {/* Priority */}
                        <td className="px-6 py-4">
                          <PriorityBadge priority={task.priority} />
                        </td>

                        {/* Assignee */}
                        <td className="px-6 py-4">
                          <UserAvatarChip user={task.assignee} />
                        </td>

                        {/* Due Date */}
                        <td className="px-6 py-4">
                          <div
                            className={
                              isOverdue ? "text-red-600" : "text-navy-800"
                            }
                          >
                            <p className="text-sm font-medium">
                              {new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </p>
                            <p
                              className={`text-xs ${isOverdue ? "font-semibold" : "text-mist-500"}`}
                            >
                              {daysInfo}
                            </p>
                          </div>
                        </td>

                        {/* GitHub Link */}
                        <td className="px-6 py-4">
                          {task.githubIssueLink ? (
                            <a
                              href={task.githubIssueLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center text-navy-700 hover:text-navy-800"
                              title="View GitHub Issue"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                              </svg>
                            </a>
                          ) : (
                            <span className="text-mist-400">-</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="mx-auto w-fit">
                            {renderActionMenu(task)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            }
            cards={
              <>
                {filteredTasks.map((task) => {
                  const isOverdue = isTaskOverdue(task.dueDate, task.status);
                  const daysInfo = getDaysUntilDue(task.dueDate);

                  return (
                    <div
                      key={task.id}
                      className="p-4 flex flex-col gap-3"
                      onClick={() => handleView(task)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-navy-800 truncate">
                            {task.title}
                          </p>
                          <p className="text-sm text-mist-600 truncate">
                            {task.description}
                          </p>
                        </div>
                        {renderActionMenu(task)}
                      </div>
                      <dl className="flex flex-col gap-1">
                        <MobileCardRow label="Assignee">
                          <UserAvatarChip user={task.assignee} />
                        </MobileCardRow>
                        <MobileCardRow label="Status">
                          <StatusBadge status={task.status} />
                        </MobileCardRow>
                        <MobileCardRow label="Priority">
                          <PriorityBadge priority={task.priority} />
                        </MobileCardRow>
                        <MobileCardRow label="Due date">
                          <span
                            className={
                              isOverdue ? "text-red-600" : "text-navy-800"
                            }
                          >
                            {new Date(task.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}{" "}
                            <span
                              className={
                                isOverdue ? "font-semibold" : "text-mist-500"
                              }
                            >
                              ({daysInfo})
                            </span>
                          </span>
                        </MobileCardRow>
                      </dl>
                    </div>
                  );
                })}
              </>
            }
          />

          {/* Table Footer */}
          <div className="px-6 py-4 bg-mist-100 border-t border-mist-200">
            <p className="text-sm text-mist-600">
              Showing{" "}
              <span className="font-semibold">{filteredTasks.length}</span> of{" "}
              <span className="font-semibold">{tasks.length}</span> tasks
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      <TaskFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleUpdate}
        initialData={selectedTask}
        isLoading={isSubmitting}
        members={members}
      />

      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onEdit={() => {
          setIsDetailsModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          setIsDetailsModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
        onReassign={handleReassignClick}
      />

      <AssignTaskModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleReassign}
        members={members}
        currentAssignee={selectedTask?.assignedTo}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${selectedTask?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        isLoading={isSubmitting}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
