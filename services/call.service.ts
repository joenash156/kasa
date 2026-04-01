import { ApiResponse, CallsListResponse } from "@/types/api.types";
import { apiClient } from "./api";

export type DialResponse = ApiResponse<{
  success: boolean;
  message: string;
}>;

/**
 * Get user's call history/logs
 * @param page - Page number (1-indexed), default 1
 * @param perPage - Number of records per page (max 100), default 20
 * @returns Promise with call logs and pagination info
 */
export async function getCallLogs(
  page: number = 1,
  perPage: number = 20,
): Promise<ApiResponse<CallsListResponse>> {
  try {
    const response = await apiClient.get("/calls", {
      params: { page, per_page: perPage },
    });
    return { ...response.data, status: response.status };
  } catch (error) {
    console.error("[CallService] Get call logs failed:", error);
    throw error;
  }
}

function normalizeGhanaDestination(input: string): string {
  const digits = input.replace(/\D/g, "");

  // Accept: 0XXXXXXXXX (10 digits) or 233XXXXXXXXX (12 digits)
  if (digits.length === 10 && digits.startsWith("0")) {
    return `233${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith("233")) {
    return digits;
  }
  // Common UX: user enters 9 digits without leading 0 (e.g. 257266272)
  if (digits.length === 9) {
    return `233${digits}`;
  }
  return digits;
}

export async function dial(destination: string): Promise<DialResponse> {
  const normalized = normalizeGhanaDestination(destination);
  const response = await apiClient.post("/dial", { destination: normalized });
  return { ...response.data, status: response.status };
}

