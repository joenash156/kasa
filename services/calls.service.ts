import { ApiResponse, CallLog, PaginatedResponse } from "@/types/api.types";
import { apiClient } from "./api";

/**
 * Call Logs Service
 * Handles all call history and logging related API calls
 */

export interface CallLogsQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: "completed" | "missed";
  campaign?: string;
}

/**
 * Get user's call history with optional filtering and pagination
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with paginated call logs
 */
export async function getCallLogs(
  params?: CallLogsQueryParams,
): Promise<PaginatedResponse<CallLog[]>> {
  try {
    const response = await apiClient.get("/calls/logs", { params });
    return response.data;
  } catch (error) {
    console.error("[CallLogsService] Get logs failed:", error);
    throw error;
  }
}

/**
 * Get a single call log entry by ID
 * @param callLogId - The ID of the call log to retrieve
 * @returns Promise with call log details
 */
export async function getCallLogById(
  callLogId: string,
): Promise<ApiResponse<CallLog>> {
  try {
    const response = await apiClient.get(`/calls/logs/${callLogId}`);
    return response.data;
  } catch (error) {
    console.error("[CallLogsService] Get log by ID failed:", error);
    throw error;
  }
}

/**
 * Create a new call log entry
 * @param callData - Call log data to create
 * @returns Promise with created call log
 */
export async function createCallLog(
  callData: Omit<CallLog, "id">,
): Promise<ApiResponse<CallLog>> {
  try {
    const response = await apiClient.post("/calls/logs", callData);
    return response.data;
  } catch (error) {
    console.error("[CallLogsService] Create log failed:", error);
    throw error;
  }
}

/**
 * Update an existing call log entry
 * @param callLogId - The ID of the call log to update
 * @param callData - Partial call log data to update
 * @returns Promise with updated call log
 */
export async function updateCallLog(
  callLogId: string,
  callData: Partial<CallLog>,
): Promise<ApiResponse<CallLog>> {
  try {
    const response = await apiClient.patch(
      `/calls/logs/${callLogId}`,
      callData,
    );
    return response.data;
  } catch (error) {
    console.error("[CallLogsService] Update log failed:", error);
    throw error;
  }
}

/**
 * Delete a call log entry
 * @param callLogId - The ID of the call log to delete
 * @returns Promise with deletion confirmation
 */
export async function deleteCallLog(
  callLogId: string,
): Promise<ApiResponse<null>> {
  try {
    const response = await apiClient.delete(`/calls/logs/${callLogId}`);
    return response.data;
  } catch (error) {
    console.error("[CallLogsService] Delete log failed:", error);
    throw error;
  }
}

/**
 * Get call statistics for the authenticated user
 * @returns Promise with call statistics
 */
export async function getCallStatistics(): Promise<
  ApiResponse<{
    totalCalls: number;
    completedCalls: number;
    missedCalls: number;
    totalMinutes: number;
    averageDuration: string;
    lastCall: CallLog | null;
  }>
> {
  try {
    const response = await apiClient.get("/calls/statistics");
    return response.data;
  } catch (error) {
    console.error("[CallLogsService] Get statistics failed:", error);
    throw error;
  }
}

/**
 * Export call logs as CSV or PDF
 * @param format - Export format: 'csv' or 'pdf'
 * @param params - Optional query parameters for filtering
 * @returns Promise with export file URL or blob
 */
export async function exportCallLogs(
  format: "csv" | "pdf",
  params?: CallLogsQueryParams,
): Promise<Blob> {
  try {
    const response = await apiClient.get(`/calls/logs/export/${format}`, {
      params,
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("[CallLogsService] Export logs failed:", error);
    throw error;
  }
}

export default {
  getCallLogs,
  getCallLogById,
  createCallLog,
  updateCallLog,
  deleteCallLog,
  getCallStatistics,
  exportCallLogs,
};
