import { ApiResponse, User } from "@/types/api.types";
import { apiClient } from "./api";

/**
 * User Service
 * Handles all user-related API calls: profile, preferences, profile updates, etc.
 */

/**
 * Get authenticated user's profile
 * Uses GET /profile endpoint
 * @returns Promise with user profile data
 */
export async function getUserProfile(): Promise<ApiResponse<User>> {
  try {
    const response = await apiClient.get("/profile");
    return response.data;
  } catch (error) {
    console.error("[UserService] Get profile failed:", error);
    throw error;
  }
}

/**
 * Update user profile
 * Uses PUT /profile endpoint
 * @param userData - Partial user data to update
 * @returns Promise with updated user profile
 */
export async function updateUserProfile(
  userData: Partial<User>,
): Promise<ApiResponse<User>> {
  try {
    const response = await apiClient.put("/profile", userData);
    return response.data;
  } catch (error) {
    console.error("[UserService] Update profile failed:", error);
    throw error;
  }
}

/**
 * Update user interests
 * Uses PUT /profile endpoint with interests field
 * @param interests - Array of user interests
 * @returns Promise with updated user profile
 */
export async function updateUserInterests(
  interests: string[],
): Promise<ApiResponse<User>> {
  try {
    const response = await apiClient.put("/profile", { interests });
    return response.data;
  } catch (error) {
    console.error("[UserService] Update interests failed:", error);
    throw error;
  }
}

/**
 * Get user call statistics
 * Returns call count, first call date, and last call date
 * @returns Promise with user call statistics
 */
export async function getUserCallStats(): Promise<
  ApiResponse<{
    call_count: number;
    first_call_at: string | null;
    last_call_at: string | null;
  }>
> {
  try {
    const response = await apiClient.get("/profile");
    // Extract only the call statistics from the profile
    const profile = response.data.data || response.data;
    return {
      success: true,
      data: {
        call_count: profile?.call_count || 0,
        first_call_at: profile?.first_call_at || null,
        last_call_at: profile?.last_call_at || null,
      },
    };
  } catch (error) {
    console.error("[UserService] Get call stats failed:", error);
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

const userService = {
  getUserProfile,
  updateUserProfile,
  updateUserInterests,
  getUserCallStats,
};

export default userService;
