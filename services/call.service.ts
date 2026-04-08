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

function normalizeGhanaPhone(input: string): string {
  const digits = input.replace(/\D/g, "");

  // Accept: 0XXXXXXXXX (10 digits), 233XXXXXXXXX (12 digits), or XXXXXXXXX (9 digits)
  if (digits.length === 10 && digits.startsWith("0")) {
    return `233${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith("233")) {
    if (digits[3] === "0") {
      throw new Error(
        "Provide a valid phone number (e.g. 0xxxxxxxxx or 233xxxxxxxxx)",
      );
    }
    return digits;
  }
  // Common UX: user enters 9 digits without leading 0 (e.g. 257266272)
  if (digits.length === 9 && !digits.startsWith("0")) {
    return `233${digits}`;
  }

  throw new Error(
    "Provide a valid phone number (e.g. 0xxxxxxxxx or 233xxxxxxxxx)",
  );
}

export async function dial(
  caller: string,
  destination: string,
): Promise<DialResponse> {
  const normalizedCaller = normalizeGhanaPhone(caller);
  const normalizedDestination = normalizeGhanaPhone(destination);
  const response = await apiClient.post("/dial", {
    // Send both keys for compatibility while backend contract is being aligned.
    caller: normalizedCaller,
    phone: normalizedCaller,
    destination: normalizedDestination,
  });
  return { ...response.data, status: response.status };
}

