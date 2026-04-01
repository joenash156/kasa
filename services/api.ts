import { ApiResponse } from "@/types/api.types";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * Centralized Axios instance for all API calls
 * Configures base URL, timeout, headers, and interceptors
 */
class ApiClient {
  private axiosInstance: AxiosInstance;
  defaults: any;

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
          const token = await authService.default.getAuthToken();
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
      (response: AxiosResponse) => {
        if (__DEV__) {
          console.log("[API Response Success]", {
            status: response.status,
            url: response.config.url,
            data: response.data,
          });
        }
        // Return the whole response object
        return response;
      },
      async (error: AxiosError<ApiResponse>) => {
        const status = error.response?.status;
        const data = error.response?.data;

        if (__DEV__) {
          console.error("[API Response Error]", {
            status,
            message: data?.message || error.message,
            code: data?.code,
          });
        }

        // Handle different error scenarios
        switch (status) {
          case 401:
            // Token expired or invalid, try to refresh
            try {
              const authService = await import("./auth.service");
              // Assume refreshToken() returns a boolean or the new token
              const refreshed = await authService.default.refreshToken();
              if (refreshed) {
                // Retry original request with new token
                return this.axiosInstance(error.config!);
              }
            } catch (refreshError) {
              // Refresh failed, force logout
              try {
                const authService = await import("./auth.service");
                await authService.default.logout();
              } catch (logoutError) {
                console.error(
                  "[API] Failed to logout after refresh failure:",
                  logoutError,
                );
              }
              return Promise.reject(refreshError);
            }
            break;
          case 403:
            // Forbidden - user lacks permission
            // Maybe show a "permission denied" message
            break;
          case 404:
            // Not Found
            break;
          case 500:
          case 502:
          case 503:
            // Server errors - could be temporary, maybe retry
            break;
        }

        // For all other errors, just reject the promise
        return Promise.reject(error);
      },
    );
  }

  /**
   * Public methods for making API calls
   */
  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
