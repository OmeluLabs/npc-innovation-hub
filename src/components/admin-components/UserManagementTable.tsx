/**
 * User Management Table Component
 *
 * Professional admin table for managing users with:
 * - User avatar with initials fallback
 * - Role management dropdown
 * - Status toggle
 * - Delete action with confirmation
 * - Responsive design
 */

import React, { useState } from "react";
import { Users } from "lucide-react";
import type { User, UserRole } from "../../types/user.types";
import {
  getUserFullName,
  getUserInitials,
  formatUserDate,
  getUserStatusColor,
} from "../../types/user.types";
import ConfirmationModal from "./ConfirmationModal";
import UserAvatar from "./UserAvatar";
import ResponsiveTable from "../ui/ResponsiveTable";
import MobileCardRow from "../ui/MobileCardRow";

// ==================== TYPES ====================

interface UserManagementTableProps {
  users: User[];
  isLoading: boolean;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
  onStatusToggle: (userId: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

// ==================== COMPONENT ====================

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  isLoading,
  onRoleChange,
  onStatusToggle,
  onDeleteUser,
}) => {
  const [loadingUsers, setLoadingUsers] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // ==================== HANDLERS ====================

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setLoadingUsers((prev) => new Set(prev).add(userId));
    try {
      await onRoleChange(userId, newRole);
    } finally {
      setLoadingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const handleStatusToggle = async (userId: string) => {
    setLoadingUsers((prev) => new Set(prev).add(userId));
    try {
      await onStatusToggle(userId);
    } finally {
      setLoadingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setLoadingUsers((prev) => new Set(prev).add(userToDelete.id));
    try {
      await onDeleteUser(userToDelete.id);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } finally {
      setLoadingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userToDelete.id);
        return next;
      });
    }
  };

  const isUserLoading = (userId: string) => loadingUsers.has(userId);

  // ==================== LOADING STATE ====================

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700"></div>
      </div>
    );
  }

  // ==================== EMPTY STATE ====================

  if (users.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <Users
          className="mx-auto mb-4 h-12 w-12 text-mist-400"
          aria-hidden="true"
        />
        <h3 className="text-lg font-semibold text-navy-800 mb-2">
          No users found
        </h3>
        <p className="text-mist-600">There are no users in the system yet.</p>
      </div>
    );
  }

  // ==================== TABLE ====================

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ResponsiveTable
          table={
            <table className="min-w-full divide-y divide-mist-200 border-separate border-spacing-0">
              {/* TABLE HEADER */}
              <thead className="bg-mist-100">
                <tr>
                  {/* Sticky first column - see EventsTable.tsx for why. */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-mist-500 uppercase tracking-wider sticky left-0 z-10 bg-mist-100">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-mist-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-mist-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-mist-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-mist-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-mist-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-mist-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-mist-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="bg-white divide-y divide-mist-200">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-mist-100 transition-colors ${
                      isUserLoading(user.id)
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    {/* USER COLUMN */}
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 z-[1] bg-white border-r border-mist-200">
                      <div className="flex items-center">
                        <UserAvatar
                          imageUrl={user.image}
                          initials={getUserInitials(user)}
                          alt={getUserFullName(user)}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-navy-800">
                            {getUserFullName(user)}
                          </div>
                          <div className="text-sm text-mist-600">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT COLUMN */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-navy-800">{user.phone}</div>
                    </td>

                    {/* GENDER COLUMN */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-navy-800 capitalize">
                        {user.gender}
                      </div>
                    </td>

                    {/* ROLE COLUMN */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as UserRole)
                        }
                        disabled={isUserLoading(user.id)}
                        className="text-sm border border-mist-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>

                    {/* STATUS COLUMN */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(user.id)}
                        disabled={isUserLoading(user.id)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${getUserStatusColor(
                          user,
                        )} hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* VERIFIED COLUMN */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.verified ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-navy-50 text-navy-700">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-mist-200 text-mist-600">
                          Unverified
                        </span>
                      )}
                    </td>

                    {/* JOINED DATE COLUMN */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-mist-600">
                      {formatUserDate(user.createdAt)}
                    </td>

                    {/* ACTIONS COLUMN */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteClick(user)}
                        disabled={isUserLoading(user.id)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Delete user"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          cards={
            <>
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 flex flex-col gap-3 ${
                    isUserLoading(user.id)
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center min-w-0">
                      <UserAvatar
                        imageUrl={user.image}
                        initials={getUserInitials(user)}
                        alt={getUserFullName(user)}
                      />
                      <div className="ml-4 min-w-0">
                        <div className="text-sm font-medium text-navy-800 truncate">
                          {getUserFullName(user)}
                        </div>
                        <div className="text-sm text-mist-600 truncate">
                          {user.email}
                        </div>
                        <div className="text-sm text-mist-600 truncate">
                          {user.phone}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      disabled={isUserLoading(user.id)}
                      className="flex-shrink-0 text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Delete user"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <dl className="flex flex-col gap-1">
                    <MobileCardRow label="Role">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as UserRole)
                        }
                        disabled={isUserLoading(user.id)}
                        className="text-sm border border-mist-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </MobileCardRow>
                    <MobileCardRow label="Status">
                      <button
                        onClick={() => handleStatusToggle(user.id)}
                        disabled={isUserLoading(user.id)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${getUserStatusColor(
                          user,
                        )} hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </button>
                    </MobileCardRow>
                  </dl>
                </div>
              ))}
            </>
          }
        />
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete ? getUserFullName(userToDelete) : "this user"}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};

export default UserManagementTable;
