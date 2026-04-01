import { ApiResponse, User } from "@/types/api.types";
import { apiClient } from "./api";

/**
 * User Service
 * Handles all user-related API calls: profile, preferences, profile updates, etc.
 */

/**
 * Get authenticated user's profile
 * @returns Promise with user profile data
 */
export async function getUserProfile(): Promise<ApiResponse<User>> {
  try {
    const response = await apiClient.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("[UserService] Get profile failed:", error);
    throw error;
  }
}

/**
 * Update user profile
 * @param userData - Partial user data to update
 * @returns Promise with updated user profile
 */
export async function updateUserProfile(
  userData: Partial<User>,
): Promise<ApiResponse<User>> {
  try {
    const response = await apiClient.patch("/users/me", userData);
    return response.data;
  } catch (error) {
    console.error("[UserService] Update profile failed:", error);
    throw error;
  }
}

/**
 * Get user preferences
 * @returns Promise with user preferences (theme, language, notifications, etc.)
 */
export async function getUserPreferences(): Promise<
  ApiResponse<{
    theme: "light" | "dark";
    language: string;
    notifications: boolean;
  }>
> {
  try {
    const response = await apiClient.get("/users/preferences");
    return response.data;
  } catch (error) {
    console.error("[UserService] Get preferences failed:", error);
    throw error;
  }
}

/**
 * Update user preferences
 * @param preferences - User preferences to update
 * @returns Promise with updated preferences
 */
export async function updateUserPreferences(preferences: {
  theme?: "light" | "dark";
  language?: string;
  notifications?: boolean;
}): Promise<
  ApiResponse<{
    theme: "light" | "dark";
    language: string;
    notifications: boolean;
  }>
> {
  try {
    const response = await apiClient.patch("/users/preferences", preferences);
    return response.data;
  } catch (error) {
    console.error("[UserService] Update preferences failed:", error);
    throw error;
  }
}

/**
 * Delete user account
 * @param password - User's password for confirmation
 * @returns Promise with deletion confirmation
 */
export async function deleteUserAccount(
  password: string,
): Promise<ApiResponse<null>> {
  try {
    const response = await apiClient.delete("/users/me", {
      data: { password },
    });
    return response.data;
  } catch (error) {
    console.error("[UserService] Delete account failed:", error);
    throw error;
  }
}

/**
 * Change user password
 * @param currentPassword - Current password for verification
 * @param newPassword - New password to set
 * @returns Promise with password change confirmation
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ApiResponse<null>> {
  try {
    const response = await apiClient.post("/users/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("[UserService] Change password failed:", error);
    throw error;
  }
}

export default {
  getUserProfile,
  updateUserProfile,
  getUserPreferences,
  updateUserPreferences,
  deleteUserAccount,
  changePassword,
};
