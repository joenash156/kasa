import { formatApiError, isRetryableError } from "@/services/api.utils";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";

/**
 * Enhanced custom hook for managing API calls with retry logic
 * Handles loading, error, and data states
 *
 * @example
 * const { data, loading, error, execute, reset } = useApi(authService.verifyOtp);
 * await execute({ phoneNumber: "+233123456789", otp: "123456" });
 */

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  rawError: AxiosError | null;
}

export interface UseApiOptions {
  /** Automatically retry on network errors */
  autoRetry?: boolean;
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Show error toast/alert on failure */
  showErrorMessage?: boolean;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {},
) {
  const { autoRetry = true, maxRetries = 2, showErrorMessage = true } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    rawError: null,
  });

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null, rawError: null });
  }, []);

  const execute = useCallback(
    async (...args: any[]) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      let lastError: AxiosError | null = null;
      let attempts = 0;
      const maxAttempts = autoRetry ? maxRetries + 1 : 1;

      while (attempts < maxAttempts) {
        try {
          const result = await apiFunction(...args);
          setState({
            data: result,
            loading: false,
            error: null,
            rawError: null,
          });
          return result;
        } catch (error) {
          lastError = error as AxiosError;

          // Check if error is retryable
          if (
            autoRetry &&
            isRetryableError(error) &&
            attempts < maxAttempts - 1
          ) {
            attempts++;
            // Exponential backoff: 1s, 2s, 4s...
            const delay = Math.pow(2, attempts - 1) * 1000;
            console.log(
              `[useApi] Retrying (${attempts}/${maxAttempts - 1}) after ${delay}ms...`,
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }

          // Not retryable or max retries reached
          const errorMessage = formatApiError(error);
          setState({
            data: null,
            loading: false,
            error: errorMessage,
            rawError: lastError,
          });

          if (showErrorMessage) {
            console.warn(`[useApi] Error: ${errorMessage}`);
          }

          throw error;
        }
      }

      throw lastError;
    },
    [apiFunction, autoRetry, maxRetries, showErrorMessage],
  );

  return {
    ...state,
    execute,
    reset,
  };
}

export default useApi;
