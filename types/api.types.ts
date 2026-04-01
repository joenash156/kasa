/**
 * Generic API Response wrapper
 * All backend responses should follow this structure
 */
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  status?: number;
  url?: string;
  timestamp?: string;
}

/**
 * Standard error response from API
 */
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  code?: string;
  status: number;
}

/**
 * Pagination metadata for list responses
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: PaginationMeta;
}

/**
 * User/Auth related types
 * Based on Kasa Caller Mobile API documentation
 */

// User profile as returned from GET /profile
export interface User {
  id: number;
  phone_number: string;
  country_code: string;
  opt_in: boolean;
  age_group?:
    | "under-18"
    | "18-24"
    | "25-34"
    | "35-44"
    | "45-54"
    | "55-64"
    | "65+"
    | null;
  gender?: "male" | "female" | "other" | "prefer-not-to-say" | null;
  region?: string | null;
  language_preference?: string | null;
  phone_type?: "smart" | "basic" | null;
  interests: string[]; // e.g., ["technology", "business", ...]
  call_count: number;
  first_call_at?: string | null; // ISO 8601
  last_call_at?: string | null; // ISO 8601
}

// Response from POST /auth/verify-otp
export interface AuthResponse {
  token: string;
  caller_id: number;
  data: any;
}

// Request payload for POST /auth/verify-otp
// Phone format: 233551234567 (international without +)
export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

/**
 * Call logging types
 * Based on GET /calls response
 */
export interface CallLog {
  id: number;
  timestamp: string; // ISO 8601 datetime
  call_type: string; // e.g., "Ad", "Survey"
  duration_played: number; // seconds
  call_duration: number; // minutes
  cost: number; // in local currency
  is_survey: boolean;
}

// Pagination response for GET /calls
export interface CallsListResponse {
  calls: CallLog[];
  total: number;
  page: number;
  pages: number;
}

export interface CallLogResponse extends ApiResponse<CallLog[]> {
  pagination?: PaginationMeta;
}
