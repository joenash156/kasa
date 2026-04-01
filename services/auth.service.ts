import {
  ApiResponse,
  AuthResponse,
  User,
  VerifyOtpPayload,
} from "@/types/api.types";
import { apiClient } from "./api";

/**
 * Authentication Service
 * Handles all auth-related API calls: login, OTP verification, token refresh, logout, etc.
 */

/**
 * Request OTP for phone number verification
 * Phone number must be in international format (e.g., 233551234567 without leading +)
 * @param phoneNumber - User's phone number in international format
 * @returns Promise with OTP session ID (and OTP in dev mode)
 *
 * @example
 * // User enters: "0551234567" (Ghana local format)
 * // Convert to: "233551234567" (international)
 * const response = await authService.requestOtp("233551234567");
 */
export async function requestOtp(phoneNumber: string): Promise<
  ApiResponse<{
    sessionId: string;
    expiresIn: number;
    otp?: string;
    dev_mode?: boolean;
  }>
> {
  try {
    // Normalize phone number: remove leading + and 0, ensure 233 prefix
    let normalizedPhone = phoneNumber.replace(/^\+/, "").replace(/^0/, "");
    if (!normalizedPhone.startsWith("233")) {
      normalizedPhone = "233" + normalizedPhone;
    }

    const response = await apiClient.post("/auth/request-otp", {
      phone: normalizedPhone,
    });
    return { ...response.data, status: response.status };
  } catch (error: any) {
    console.error("[AuthService] Request OTP failed:", error);
    // Re-throw a consistent error structure
    throw (
      error.response?.data || {
        message: "An unknown error occurred",
        success: false,
      }
    );
  }
}

/**
 * Verify OTP code and complete authentication
 * Phone number must be in international format (e.g., 233551234567)
 * @param payload - { phone, otp }
 * @returns Promise with auth token and caller ID
 *
 * @example
 * const response = await authService.verifyOtp({
 *   phone: "233551234567",
 *   otp: "123456"
 * });
 * // Returns: { token: "eyJhbGc...", caller_id: 12345 }
 */
export async function verifyOtp(
  payload: VerifyOtpPayload,
): Promise<ApiResponse<AuthResponse>> {
  try {
    // Normalize phone number
    let normalizedPhone = payload.phone.replace(/^\+/, "").replace(/^0/, "");
    if (!normalizedPhone.startsWith("233")) {
      normalizedPhone = "233" + normalizedPhone;
    }

    const response = await apiClient.post("/auth/verify-otp", {
      phone: normalizedPhone,
      otp: payload.otp,
    });

    // Save token to secure storage for future requests
    if (response.data.data?.token) {
      await saveAuthToken(response.data.data.token);
    }

    return { ...response.data, status: response.status };
  } catch (error: any) {
    console.error("[AuthService] Verify OTP failed:", error);
    // Re-throw a consistent error structure
    throw (
      error.response?.data || {
        message: "An unknown error occurred",
        success: false,
      }
    );
  }
}

/**
 * Refresh authentication token
 * @param refreshToken - The refresh token from previous auth
 * @returns Promise with new access token
 */
export async function refreshAuthToken(
  refreshToken: string,
): Promise<ApiResponse<{ token: string; expiresIn: number }>> {
  try {
    const response = await apiClient.post("/auth/refresh-token", {
      refreshToken,
    });

    // TODO: Update stored token
    if (response.data.data?.token) {
      // await saveAuthToken(response.data.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("[AuthService] Refresh token failed:", error);
    throw error;
  }
}

/**
 * Logout user and invalidate tokens
 * @returns Promise with logout confirmation
 */
export async function logout(): Promise<ApiResponse<null>> {
  try {
    const response = await apiClient.post("/auth/logout");

    // Clear all stored auth credentials
    await clearAuthTokens();

    return response.data;
  } catch (error) {
    console.error("[AuthService] Logout failed:", error);
    // Clear tokens even if request fails
    await clearAuthTokens();
    throw error;
  }
}

/**
 * Validate current session and get user info
 * @returns Promise with current authenticated user
 */
export async function validateSession(): Promise<ApiResponse<User>> {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("[AuthService] Session validation failed:", error);
    throw error;
  }
}

// ============================================================================
// Token Storage Helpers
// ============================================================================
// TODO: Install expo-secure-store via: npm install expo-secure-store
// Then uncomment imports and implement these functions

/**
 * Save authentication token to secure storage
 * @param token - JWT token from API
 */
export async function saveAuthToken(token: string): Promise<void> {
  try {
    // import * as SecureStore from "expo-secure-store";
    // await SecureStore.setItemAsync("authToken", token);
    console.log("[AuthService] Token saved (implement with expo-secure-store)");
  } catch (error) {
    console.error("[AuthService] Failed to save token:", error);
  }
}

/**
 * Retrieve authentication token from secure storage
 * @returns Token string or null if not found
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    // import * as SecureStore from "expo-secure-store";
    // return await SecureStore.getItemAsync("authToken");
    console.log(
      "[AuthService] Token retrieved (implement with expo-secure-store)",
    );
    return null;
  } catch (error) {
    console.error("[AuthService] Failed to retrieve token:", error);
    return null;
  }
}

/**
 * Clear all authentication tokens and user data
 * Called on logout
 */
export async function clearAuthTokens(): Promise<void> {
  try {
    // import * as SecureStore from "expo-secure-store";
    // await SecureStore.deleteItemAsync("authToken");
    // Also clear from API client headers
    apiClient.defaults.headers.common["Authorization"] = "";
    console.log("[AuthService] Tokens cleared");
  } catch (error) {
    console.error("[AuthService] Failed to clear tokens:", error);
  }
}

export default {
  requestOtp,
  verifyOtp,
  refreshAuthToken,
  logout,
  validateSession,
  saveAuthToken,
  getAuthToken,
  clearAuthTokens,
};
