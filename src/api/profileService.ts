/**
 * Profile API Service
 *
 * Handles all profile-related API calls including:
 * - Fetching user profile
 * - Updating profile information
 * - Changing password
 */

import apiClient from "./client";
import type { User } from "../types/user.types";

// ==================== TYPE DEFINITIONS ====================

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  // A real file, not a URL - PATCH /update-profile only ever looked at
  // req.file (via multer's upload.single('images')) to update the
  // avatar; a plain `image: string` sent as JSON was silently ignored
  // server-side the whole time, whatever was typed into that field.
  image?: File | null;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ProfileApiResponse {
  status: string;
  data: {
    user: User;
  };
}

export interface UpdateProfileResponse {
  status: string;
  message: string;
  data: {
    user: User;
  };
}

export interface UpdatePasswordResponse {
  status: string;
  message: string;
}

// ==================== PROFILE SERVICE ====================

export const profileService = {
  /**
   * Get current user profile
   * @returns User profile data
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ProfileApiResponse>("/api/users/me");
    return response.data.data.user;
  },

  /**
   * Update user profile
   * @param payload - Profile fields to update
   * @returns Updated user data
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    // multipart/form-data, not JSON - the route expects the avatar under
    // multer's field name "images" (upload.single('images')), same
    // pattern as the other multipart upload endpoints.
    const formData = new FormData();
    if (payload.firstName !== undefined)
      formData.append("firstName", payload.firstName);
    if (payload.lastName !== undefined)
      formData.append("lastName", payload.lastName);
    if (payload.phone !== undefined) formData.append("phone", payload.phone);
    if (payload.gender !== undefined) formData.append("gender", payload.gender);
    if (payload.image) formData.append("images", payload.image);

    const response = await apiClient.patch<UpdateProfileResponse>(
      "/api/users/update-profile",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data.data.user;
  },

  /**
   * Update user password
   * @param userId - User ID
   * @param payload - Old and new passwords
   * @returns Success message
   */
  async updatePassword(
    userId: string,
    payload: UpdatePasswordPayload,
  ): Promise<string> {
    const response = await apiClient.patch<UpdatePasswordResponse>(
      `/api/users/${userId}/update-password`,
      payload,
    );
    return response.data.message;
  },
};
