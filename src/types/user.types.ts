/**
 * User Type Definitions
 *
 * Type definitions that strictly match the backend API response structure.
 */

// ==================== ENUMS ====================

export enum UserRole {
  ADMIN = "Admin",
  MEMBER = "Member",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

// ==================== USER INTERFACE ====================

/**
 * User interface matching the exact API response structure
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  phone: string;
  gender: Gender;
  verified: boolean;
  role: UserRole;
  isActive: boolean;
  memberId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== API RESPONSE TYPES ====================

/**
 * Response for getting all users
 */
export interface GetAllUsersResponse {
  users: User[];
  total: number;
  page?: number;
  limit?: number;
}

/**
 * Response for getting a single user
 */
export interface GetUserResponse {
  user: User;
}

/**
 * Payload for updating user role
 */
export interface UpdateUserRolePayload {
  role: UserRole;
}

/**
 * Response for updating user role
 */
export interface UpdateUserRoleResponse {
  message: string;
  user: User;
}

/**
 * Response for changing account status
 */
export interface ChangeAccountStatusResponse {
  message: string;
  user: User;
}

/**
 * Response for deleting user
 */
export interface DeleteUserResponse {
  message: string;
}

// ==================== UTILITY TYPES ====================

/**
 * User with computed full name
 */
export interface UserWithFullName extends User {
  fullName: string;
}

/**
 * Partial user for updates
 */
export type UpdateUserPayload = Partial<
  Omit<User, "id" | "createdAt" | "updatedAt" | "verified">
>;

/**
 * User filter options
 */
export interface UserFilterOptions {
  role?: UserRole;
  isActive?: boolean;
  verified?: boolean;
  search?: string;
}

/**
 * User sort options
 */
export interface UserSortOptions {
  field: keyof User;
  order: "asc" | "desc";
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get user's full name
 */
export const getUserFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`.trim();
};

/**
 * Get user's initials for avatar fallback
 */
export const getUserInitials = (user: User): string => {
  const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || "";
  const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || "";
  return `${firstInitial}${lastInitial}`;
};

/**
 * Format user's creation date
 */
export const formatUserDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Check if user is active and verified
 */
export const isUserFullyActive = (user: User): boolean => {
  return user.isActive && user.verified;
};

/**
 * Get user status label
 */
export const getUserStatusLabel = (user: User): string => {
  if (!user.isActive) return "Inactive";
  if (!user.verified) return "Unverified";
  return "Active";
};

/**
 * Get user status color for badges
 */
export const getUserStatusColor = (user: User): string => {
  if (!user.isActive) return "bg-red-100 text-red-800";
  if (!user.verified) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
};
