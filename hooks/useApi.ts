import { ApiError } from "@/types/api.types";
import { useCallback, useState } from "react";

/**
 * Custom hook for handling API calls with loading and error states
 * Useful for components that need to manage async operations
 */

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

type ApiFunction<T> = (...args: any[]) => Promise<T>;

export function useApi<T>(apiFunction: ApiFunction<T>): UseApiState<T> & {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
} {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err: any) {
        const error: ApiError = {
          success: false,
          message: err.message || "An error occurred",
          status: err.status || 500,
          code: err.code,
        };
        setState({ data: null, loading: false, error });
        return null;
      }
    },
    [apiFunction],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

/**
 * Example usage in a component:
 *
 * import { useApi } from "@/hooks/useApi";
 * import { userService } from "@/services";
 *
 * export function MyComponent() {
 *   const { data: user, loading, error, execute } = useApi(userService.getUserProfile);
 *
 *   useEffect(() => {
 *     execute();
 *   }, [execute]);
 *
 *   if (loading) return <Text>Loading...</Text>;
 *   if (error) return <Text>Error: {error.message}</Text>;
 *
 *   return <Text>{user?.phoneNumber}</Text>;
 * }
 */
