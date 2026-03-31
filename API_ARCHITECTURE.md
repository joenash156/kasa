# Kasa API Architecture Documentation

This document explains the professional API service architecture set up for the Kasa React Native (Expo) project.

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         React Components & Screens              │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ (Import services)
┌─────────────────────────────────────────────────┐
│    Domain Services (auth, user, calls)          │
│  • auth.service.ts                              │
│  • user.service.ts                              │
│  • calls.service.ts                             │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ (Uses)
┌─────────────────────────────────────────────────┐
│  Centralized API Client (api.ts)                │
│  • Axios instance                               │
│  • Request interceptor (auth headers)           │
│  • Response interceptor (error handling)        │
│  • Global configuration                         │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ (HTTP calls)
┌─────────────────────────────────────────────────┐
│     Backend API Server                          │
│  https://api.kasa.local/v1                      │
└─────────────────────────────────────────────────┘
```

## File Structure

```
kasa/
├── services/
│   ├── api.ts                 # Centralized Axios client with interceptors
│   ├── auth.service.ts        # Authentication endpoints
│   ├── user.service.ts        # User profile endpoints
│   ├── calls.service.ts       # Call logging endpoints
│   └── index.ts               # Service exports
├── types/
│   └── api.types.ts           # TypeScript interfaces for API responses
├── hooks/
│   └── useApi.ts              # Custom hook for API calls with state
└── ...other app files
```

## Configuration

### Environment Variables

The API client reads the base URL from environment variables:

```bash
# In your .env or .env.local file (or app.json for Expo)
EXPO_PUBLIC_API_URL=https://api.kasa.local/v1
```

If not set, it defaults to: `https://api.kasa.local/v1`

### Timeout & Headers

- **Timeout**: 10 seconds
- **Default Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`

## Usage Patterns

### 1. Direct Service Call in a Component

```typescript
import { authService } from "@/services";

export function LoginScreen() {
  const handleVerifyOtp = async () => {
    try {
      const response = await authService.verifyOtp({
        phoneNumber: "+233 24 123 4567",
        otp: "123456",
      });
      console.log("Auth successful:", response.data);
    } catch (error) {
      console.error("Auth failed:", error.message);
    }
  };

  return (
    <Button title="Verify OTP" onPress={handleVerifyOtp} />
  );
}
```

### 2. Using the Custom Hook (Recommended)

```typescript
import { useApi } from "@/hooks/useApi";
import { userService } from "@/services";

export function ProfileScreen() {
  const { data: user, loading, error, execute, reset } = useApi(
    userService.getUserProfile
  );

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) return <Text>Loading profile...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Text>Hello, {user?.firstName || "User"}</Text>
    </View>
  );
}
```

### 3. With Query Parameters

```typescript
import { callsService } from "@/services";

export function CallLogsScreen() {
  const fetchLogs = async () => {
    const response = await callsService.getCallLogs({
      page: 1,
      limit: 10,
      status: "completed",
      startDate: "2025-03-01",
      endDate: "2025-03-31",
    });
    console.log("Logs:", response.data);
  };

  return <Button title="Load Logs" onPress={fetchLogs} />;
}
```

### 4. Updating Data

```typescript
import { userService } from "@/services";

export function EditProfileScreen() {
  const handleUpdateProfile = async (updates: Partial<User>) => {
    try {
      const response = await userService.updateUserProfile(updates);
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Update failed:", error.message);
    }
  };

  return (
    <Button
      title="Save Changes"
      onPress={() => handleUpdateProfile({ firstName: "John" })}
    />
  );
}
```

## API Response Format

All API responses follow this structure (defined in `types/api.types.ts`):

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  timestamp?: string;
}
```

### Success Example

```json
{
  "success": true,
  "data": {
    "phoneNumber": "+233 24 123 4567",
    "firstName": "John",
    "isVerified": true
  },
  "message": "User profile retrieved successfully",
  "timestamp": "2025-03-31T10:30:00Z"
}
```

### Error Example

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "code": "INVALID_TOKEN",
  "status": 401,
  "timestamp": "2025-03-31T10:30:00Z"
}
```

## Error Handling

The response interceptor in `api.ts` automatically handles these HTTP status codes:

- **401 Unauthorized**: Token expired or invalid
- **403 Forbidden**: User lacks required permissions
- **404 Not Found**: Resource doesn't exist
- **500 Server Error**: Backend error occurred
- **429 Rate Limited**: Too many requests

Errors are thrown consistently as `ApiError` objects with `message`, `status`, and `code` properties.

### Custom Error Handling in Components

```typescript
try {
  const result = await userService.getUserProfile();
} catch (error) {
  const apiError = error as ApiError;

  switch (apiError.status) {
    case 401:
      // Redirect to login
      break;
    case 404:
      // Show "Not found" message
      break;
    default:
    // Show generic error
  }
}
```

## Authentication

### Setting Bearer Token

When you receive a token from the auth endpoint, set it in the API client:

```typescript
// After successful login/OTP verification
const { data } = await authService.verifyOtp({ ... });

// Store token securely (using SecureStore, Keychain, etc.)
// await SecureStore.setItemAsync("authToken", data.token);

// Optionally update the API client header
// apiClient.setHeader("Authorization", `Bearer ${data.token}`);
```

The request interceptor in `api.ts` has a TODO comment where you should add token retrieval logic:

```typescript
private setupRequestInterceptor(): void {
  this.axiosInstance.interceptors.request.use(async (config) => {
    const token = await getStoredAuthToken(); // Your storage logic here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}
```

## Adding New Services

To add a new service (e.g., `notifications.service.ts`):

1. Create `services/notifications.service.ts`:

```typescript
import apiClient from "./api";
import { ApiResponse } from "@/types/api.types";

export async function getNotifications() {
  const response = await apiClient.get("/notifications");
  return response.data;
}
```

2. Export it in `services/index.ts`:

```typescript
export * as notificationsService from "./notifications.service";
```

3. Use it in your component:

```typescript
import { notificationsService } from "@/services";

const notifications = await notificationsService.getNotifications();
```

## Best Practices

1. **Always use services**: Don't make Axios calls directly from components
2. **Handle errors gracefully**: Show user-friendly error messages
3. **Use the custom hook**: For data fetching with loading/error states
4. **Keep services pure**: Services should only handle API calls, not UI logic
5. **Organize by domain**: Group related endpoints in one service file
6. **Type everything**: Use TypeScript interfaces for all API data
7. **Add logging**: Keep the console logs for debugging during development

## Next Steps: Integration with Backend

Once you have your API documentation, update the endpoint URLs in each service file:

- Replace `/auth/request-otp` with your actual endpoint
- Replace `/auth/verify-otp` with your actual endpoint
- Replace `/users/me` with your actual endpoint
- And so on...

The architecture is ready to accept any endpoint structure without refactoring!
