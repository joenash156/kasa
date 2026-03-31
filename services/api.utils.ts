import { AxiosError } from "axios";

/**
 * Utility functions for API operations
 * Includes retry logic, logging, and common patterns
 */

/**
 * Retry failed API calls with exponential backoff
 * Useful for handling transient network errors
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param delayMs - Initial delay in milliseconds (default: 1000)
 * @returns Promise with result or error
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx)
      if (error instanceof AxiosError && error.response?.status) {
        const status = error.response.status;
        if (status >= 400 && status < 500) {
          throw error;
        }
      }

      // Wait before retrying (with exponential backoff)
      if (attempt < maxRetries) {
        const waitTime = delayMs * Math.pow(2, attempt);
        console.log(
          `[API Retry] Attempt ${attempt + 1}/${maxRetries + 1}, waiting ${waitTime}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}

/**
 * Log API request details
 * Useful for debugging during development
 */
export function logApiRequest(
  method: string,
  url: string,
  data?: any,
  headers?: any,
): void {
  if (__DEV__) {
    console.log(`
    [API REQUEST]
    Method: ${method.toUpperCase()}
    URL: ${url}
    ${data ? `Data: ${JSON.stringify(data, null, 2)}` : ""}
    ${headers ? `Headers: ${JSON.stringify(headers, null, 2)}` : ""}
    ───────────────────────────┘
    `);
  }
}

/**
 * Log API response details
 * Useful for debugging during development
 */
export function logApiResponse(
  status: number,
  url: string,
  data?: any,
  duration?: number,
): void {
  if (__DEV__) {
    const icon = status >= 200 && status < 300 ? "Success" : "Failed";
    console.log(`
    ${icon} [API RESPONSE]
    Status: ${status}
    URL: ${url}
    ${duration ? `Duration: ${duration}ms` : ""}
    ${data ? `Data: ${JSON.stringify(data, null, 2)}` : ""}
    ───────────────────────────┘
    `);
  }
}

/**
 * Check if a network error is retryable
 * Network timeouts and server errors (5xx) are retryable
 */
export function isRetryableError(error: any): boolean {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    // Retry on network errors (no response)
    if (!error.response) return true;

    // Retry on server errors (5xx)
    if (status && status >= 500) return true;

    // Retry on specific client errors that indicate temporary issues
    if (status === 408 || status === 429) return true;

    return false;
  }

  // Network errors typically don't have response
  return !error.response;
}

/**
 * Format API error for user-friendly display
 */
export function formatApiError(error: any): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (!error.response) {
      return "Network error. Please check your connection.";
    }

    switch (status) {
      case 400:
        return message || "Invalid request. Please check your input.";
      case 401:
        return "Session expired. Please log in again.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return message || "An error occurred. Please try again.";
    }
  }

  return error?.message || "An unexpected error occurred.";
}

/**
 * Debounce an async function
 * Useful for search inputs that trigger API calls
 */
export function debounceAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  delay: number = 300,
): (...args: T) => Promise<R | undefined> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return async (...args: T): Promise<R | undefined> => {
    return new Promise((resolve) => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(async () => {
        const result = await fn(...args);
        resolve(result);
      }, delay);
    });
  };
}

/**
 * Abort previous requests when a new one is made
 * Useful for search or filter operations
 */
export class RequestCanceller {
  private abortController: AbortController | null = null;

  cancel(): void {
    this.abortController?.abort();
    this.abortController = null;
  }

  getSignal(): AbortSignal {
    this.cancel();
    this.abortController = new AbortController();
    return this.abortController.signal;
  }
}

export default {
  retryWithBackoff,
  logApiRequest,
  logApiResponse,
  isRetryableError,
  formatApiError,
  debounceAsync,
  RequestCanceller,
};
