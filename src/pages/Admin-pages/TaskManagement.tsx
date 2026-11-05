/**
 * TaskManagement Page
 * Admin page for task management
 */

import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin-components/AdminLayout";
import { TaskStats } from "../../components/admin-components/TaskStats";
import TasksTable from "../../components/admin-components/TasksTable";
import { TaskFormModal } from "../../components/admin-components/TaskFormModal";
import { useTasks } from "../../hooks/useTasks";
import { Toast, useToast } from "../../components/admin-components/Toast";
import { getAllUsers } from "../../api/admin/member.api";
import type { User } from "../../types/task.types";

export default function TaskManagement() {
  const { tasks, error, fetchTasks, handleCreateTask } = useTasks();
  const { toast, showToast, hideToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<User[]>([]);

  // Fetch tasks and members on mount
  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, [fetchTasks]);

  const fetchMembers = async () => {
    try {
      // Use existing getAllUsers API
      const usersData = await getAllUsers();

      // Transform from your User type to Task User type
      // Your User type has: { id, firstName, lastName, email, role, isActive, ... }
      // Task User type needs: { id, firstName, lastName, email, role: "Admin" | "Member" }
      const transformedMembers: User[] = usersData
        .filter((user) => user.isActive && user.role === "Member") // Only show active Members (exclude Admins)
        .map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role as "Admin" | "Member",
        }));

      setMembers(transformedMembers);
      console.log("Fetched members (Members only):", transformedMembers);
    } catch (err) {
      console.error("Error fetching members:", err);
      setMembers([]);
    }
  };

  const handleCreate = async (data: Record<string, string>) => {
    setIsSubmitting(true);
    const success = await handleCreateTask({
      title: data.title,
      description: data.description,
      status: data.status as "pending" | "in-progress" | "completed",
      priority: data.priority as "low" | "medium" | "high",
      dueDate: data.dueDate,
      githubIssueLink: data.githubIssueLink,
      assignedTo: data.assignedTo,
    });

    if (success) {
      setIsCreateModalOpen(false);
      showToast("Task created successfully!", "success");
      // Small delay to ensure DB is updated
      setTimeout(async () => {
        await fetchTasks();
      }, 300);
    } else {
      showToast(error || "Failed to create task", "error");
    }
    setIsSubmitting(false);
  };

  // Callback to refresh tasks from child component
  const handleTasksRefresh = async () => {
    await fetchTasks();
  };

  return (
    <AdminLayout
      title={
        <div>
          <h1 className="font-bold text-3xl text-primary mb-2 uppercase">
            Task Management
          </h1>
          <p className="text-ink-muted">Manage and track internal tasks</p>
        </div>
      }
      actions={
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-secondary to-secondary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Task
        </button>
      }
    >
      {/* Stats */}
      <TaskStats tasks={tasks} />

      {/* Table */}
      <TasksTable members={members} onTasksChange={handleTasksRefresh} />

      {/* Create Modal */}
      <TaskFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
        members={members}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </AdminLayout>
  );
}
