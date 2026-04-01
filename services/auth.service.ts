import {
    ApiResponse,
    AuthResponse,
    User,
    VerifyOtpPayload,
} from "@/types/api.types";
import * as SecureStore from "expo-secure-store";
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
    
    // For network errors, don't log to console too much and provide a cleaner error
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      // This is likely a network connectivity issue, but OTP might have been sent
      throw {
        message: "Network Error",
        code: 'NETWORK_ERROR',
        success: false,
      };
    }
    
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
    // API returns: { token, caller_id, status } directly or wrapped in data
    const responseData = response.data?.data || response.data;
    if (responseData?.token) {
      await saveAuthToken(responseData.token);
      console.log("[AuthService] Token saved successfully");
    } else {
      console.warn("[AuthService] No token found in response:", response.data);
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
    // Silent logout - don't log errors as user requested quiet logout
    // Clear tokens even if request fails
    await clearAuthTokens();
    // Return a success response to avoid breaking the flow
    return { success: true, message: "Logged out successfully" };
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
    await SecureStore.setItemAsync("authToken", token);
    console.log("[AuthService] Token saved successfully");
  } catch (error) {
    console.error("[AuthService] Failed to save token:", error);
    throw error;
  }
}

/**
 * Retrieve authentication token from secure storage
 * @returns Token string or null if not found
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync("authToken");
    console.log("[AuthService] Token retrieved successfully");
    return token;
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
    await SecureStore.deleteItemAsync("authToken");
    
    // Also clear from API client headers if available
    try {
      apiClient.clearAuthorizationHeader();
    } catch (headerError) {
      // Ignore header clearing errors - token is already deleted from secure storage
      console.log("[AuthService] Note: Could not clear API headers, but token was deleted");
    }
    
    console.log("[AuthService] Tokens cleared successfully");
  } catch (error) {
    console.error("[AuthService] Failed to clear tokens:", error);
    // Don't throw - we want logout to continue even if clearing fails
  }
}

/**
 * Refresh the authentication token
 * @returns Promise<boolean> - True if token was refreshed successfully
 */
export async function refreshToken(): Promise<boolean> {
  // TODO: Implement token refresh logic
  // 1. Get refresh token from secure storage
  // 2. Make API call to /auth/refresh-token
  // 3. If successful, save new auth and refresh tokens
  // 4. Return true
  // 5. If fails, return false
  console.warn("[AuthService] refreshToken() is not implemented.");
  return false;
}

const authService = {
  requestOtp,
  verifyOtp,
  logout,
  validateSession,
  saveAuthToken,
  getAuthToken,
  clearAuthTokens,
  refreshToken,
};

export default authService;
