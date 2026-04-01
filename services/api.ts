import { ApiError, ApiResponse } from "@/types/api.types";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * Centralized Axios instance for all API calls
 * Configures base URL, timeout, headers, and interceptors
 */
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Initialize Axios instance
    this.axiosInstance = axios.create({
      baseURL:
        process.env.EXPO_PUBLIC_API_URL || "https://kasa.dlp.africa/caller/api",
      timeout: 10000, // 10 seconds
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Setup interceptors
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  /**
   * Request Interceptor: Add authorization token and customize headers
   */
  private setupRequestInterceptor(): void {
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Add API Key header (required by Kasa API)
        const apiKey = process.env.EXPO_PUBLIC_API_KEY;
        if (apiKey) {
          config.headers["X-API-Key"] = apiKey;
        }

        // Add Bearer token if available (retrieved from secure storage)
        // Using dynamic require to avoid circular dependency with auth.service
        try {
          const authService = await import("./auth.service");
          const token = await authService.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          // Token retrieval failed, continue without token
          console.warn("[API] Could not retrieve auth token:", error);
        }

        if (__DEV__) {
          console.log("[API Request]", {
            method: config.method?.toUpperCase(),
            url: config.url,
            headers: config.headers,
          });
        }

        return config;
      },
      (error: AxiosError) => {
        console.error("[API Request Error]", error.message);
        return Promise.reject(error);
      },
    );
  }

  /**
   * Response Interceptor: Handle successful responses, errors, and token refresh
   */
  private setupResponseInterceptor(): void {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        console.log("[API Response Success]", {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
        return response;
      },
      async (error: AxiosError<ApiResponse>) => {
        const status = error.response?.status;
        const data = error.response?.data;

        console.error("[API Response Error]", {
          status,
          message: data?.message || error.message,
          code: data?.code,
        });

        // Handle different error scenarios
        switch (status) {
          case 401:
            console.warn("[401] Unauthorized - Token expired or invalid");
            // Clear stored token for this session
            try {
              const authService = await import("./auth.service");
              await authService.clearAuthTokens();
            } catch (error) {
              console.error("[API] Failed to clear tokens on 401:", error);
            }
            // TODO: Route to login screen when token expires
            // router.replace("/(auth)/login");
            break;

          case 403:
            // Forbidden - User lacks permissions
            console.warn("[403] Forbidden - Insufficient permissions");
            break;

          case 404:
            // Not Found
            console.warn("[404] Not Found - Resource does not exist");
            break;

          case 500:
            // Server Error
            console.error("[500] Server Error - Please try again later");
            break;

          case 429:
            // Rate Limited
            console.warn("[429] Rate Limited - Too many requests");
            break;

          default:
            // Generic error handling
            if (!status) {
              console.error("[Network Error] No response from server");
            }
        }

        // Format error consistently
        const formattedError: ApiError = {
          success: false,
          message:
            data?.message || error.message || "An unknown error occurred",
          error: data?.error,
          code: data?.code || String(status),
          status: status || 500,
        };

        return Promise.reject(formattedError);
      },
    );
  }

  /**
   * Public method to get the Axios instance
   */
  getClient(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Public method to update base URL dynamically (e.g., for API switching)
   */
  setBaseURL(url: string): void {
    this.axiosInstance.defaults.baseURL = url;
    console.log("[API Client] Base URL updated to:", url);
  }

  /**
   * Add custom header (e.g., for language preference)
   */
  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  /**
   * Remove custom header
   */
  removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  /**
   * Get current headers
   */
  getHeaders() {
    return this.axiosInstance.defaults.headers;
  }
}

// Create and export singleton instance
const apiClientInstance = new ApiClient();
export const apiClient = apiClientInstance.getClient();
