/**
 * Members Management Component (Updated)
 *
 * Main component for admin user management.
 * Integrates with backend API through member.api.ts.
 * Handles all CRUD operations with proper error handling and loading states.
 */

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { User, UserRole } from "../../types/user.types";
import {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  searchUsers,
  filterUsersByRole,
  filterUsersByStatus,
} from "../../api/admin/member.api";
import UserManagementTable from "./UserManagementTable";
import UserManagementFilters from "./UserManagementFilters";

// ==================== COMPONENT ====================

const MembersManagement: React.FC = () => {
  // ==================== STATE ====================

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchParams] = useSearchParams();
  // Seeded from ?q= so the Topbar's search dropdown can link here with
  // the query already applied instead of landing on an unfiltered list.
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") || "",
  );
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // ==================== FETCH USERS ====================

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedUsers = await getAllUsers();

      // Ensure we always have an array
      if (Array.isArray(fetchedUsers)) {
        setUsers(fetchedUsers);
      } else {
        console.error("API returned non-array data:", fetchedUsers);
        setUsers([]);
        setError("Invalid data format received from server");
        toast.error("Invalid data format received from server");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      setUsers([]); // Set to empty array on error
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==================== FILTERED USERS ====================

  const filteredUsers = useMemo(() => {
    // Ensure users is always an array
    if (!Array.isArray(users)) {
      console.warn("users is not an array:", users);
      return [];
    }

    let result = users;

    // Apply search filter
    if (searchQuery) {
      result = searchUsers(result, searchQuery);
    }

    // Apply role filter
    result = filterUsersByRole(result, roleFilter);

    // Apply status filter
    result = filterUsersByStatus(result, statusFilter);

    return result;
  }, [users, searchQuery, roleFilter, statusFilter]);

  // ==================== HANDLERS ====================

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const updatedUser = await updateUserRole(userId, newRole);

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? updatedUser : user)),
      );

      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update role";
      toast.error(errorMessage);
      throw err; // Re-throw to let table handle loading state
    }
  };

  const handleStatusToggle = async (userId: string) => {
    try {
      // Toggle status (backend doesn't return updated user)
      await toggleUserStatus(userId);

      // Refetch all users to get updated status
      await fetchUsers();

      toast.success("User account status updated successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update status";
      toast.error(errorMessage);
      throw err; // Re-throw to let table handle loading state
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);

      // Remove from local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      toast.success("User deleted successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete user";
      toast.error(errorMessage);
      throw err; // Re-throw to let table handle loading state
    }
  };

  // ==================== RENDER ====================

  return (
    <div className="flex-1 px-8 py-6">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-page-title font-bold text-navy-800 mb-2">
          Members Management
        </h2>
        <p className="text-mist-600">
          Manage user accounts, roles, and permissions
        </p>
      </div>

      {/* ERROR STATE */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading users
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={fetchUsers}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTERS */}
      {!isLoading && !error && (
        <UserManagementFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          totalUsers={users.length}
          filteredUsers={filteredUsers.length}
        />
      )}

      {/* TABLE */}
      <UserManagementTable
        users={filteredUsers}
        isLoading={isLoading}
        onRoleChange={handleRoleChange}
        onStatusToggle={handleStatusToggle}
        onDeleteUser={handleDeleteUser}
      />

      {/* REFRESH BUTTON */}
      {!isLoading && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={fetchUsers}
            className="inline-flex items-center px-4 py-2 border border-mist-300 shadow-sm text-sm font-medium rounded-lg text-navy-800 bg-white hover:bg-mist-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default MembersManagement;
