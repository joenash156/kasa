/**
 * COMPLETE API INTEGRATION EXAMPLES
 * Real-world patterns for using the Kasa API architecture
 * 
 * This file contains 8 practical examples for common use cases.
 * Copy patterns as needed into your component files.
 */

// ============================================================================
// EXAMPLE 1: Authentication - Request OTP
// ============================================================================
// Location: app/(auth)/login.tsx

import { useState } from "react";
import { authService } from "@/services";
import { useApi } from "@/hooks/useApi";

function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { data: otpResponse, loading, error, execute: requestOtp } = useApi(
    authService.requestOtp
  );

  const handleRequestOtp = async () => {
    try {
      await requestOtp(phoneNumber);
      // Success! otpResponse now contains { sessionId, expiresIn }
      // Navigate to OTP verification screen
    } catch (error) {
      // Error already formatted and in state
      console.error("OTP request failed");
    }
  };

  return (
    <View>
      {/* Phone input field */}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      {loading && <ActivityIndicator />}
    </View>
  );
}

// ============================================================================
// EXAMPLE 2: Authentication - Verify OTP and Login
// ============================================================================
// Location: app/(auth)/verify-otp.tsx

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { authService } from "@/services";
import { useApi } from "@/hooks/useApi";

function VerifyOtpScreen({ sessionId, phoneNumber }: { sessionId: string; phoneNumber: string }) {
  const [otp, setOtp] = useState("");
  const { login } = useContext(AuthContext);
  const { data: authResponse, loading, error, execute: verifyOtp } = useApi(
    authService.verifyOtp
  );

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp({ sessionId, otp, phoneNumber });
      // response = { user, token, refreshToken, expiresIn }

      // Save token to secure storage
      // await SecureStore.setItemAsync("authToken", response.token);

      // Update auth context
      login(response.user, response.token);

      // Navigate to home screen
      router.replace("/(tabs)/");
    } catch (error) {
      // Error already in state
    }
  };

  return (
    <View>
      {/* OTP input */}
      {error && <ErrorAlert message={error} />}
    </View>
  );
}

// ============================================================================
// EXAMPLE 3: Fetch User Profile on App Start
// ============================================================================
// Location: app/(tabs)/profile.tsx

import { useEffect } from "react";
import { userService } from "@/services";
import { useApi } from "@/hooks/useApi";

function ProfileScreen() {
  const {
    data: userProfile,
    loading,
    error,
    execute: fetchProfile,
    reset,
  } = useApi(userService.getUserProfile, {
    autoRetry: true,
    maxRetries: 3,
    showErrorMessage: true,
  });

  // Fetch on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={() => fetchProfile()} />;
  if (!userProfile) return <EmptyScreen />;

  return (
    <ScrollView>
      <Text>{userProfile.firstName} {userProfile.lastName}</Text>
      <Text>{userProfile.phoneNumber}</Text>
      {/* More profile fields */}
    </ScrollView>
  );
}

// ============================================================================
// EXAMPLE 4: Update User Profile with Form Submission
// ============================================================================
// Location: components/ProfileForm.tsx

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { userService } from "@/services";
import { useApi } from "@/hooks/useApi";

function ProfileForm({ initialData }: { initialData: User }) {
  const [formData, setFormData] = useState(initialData);
  const { user, setUser } = useContext(AuthContext);
  const { loading, error, execute: updateProfile } = useApi(
    userService.updateUserProfile
  );

  const handleSubmit = async () => {
    try {
      const updated = await updateProfile(formData);
      // Success! Update auth context
      setUser(updated);
      Toast.show({ type: "success", text1: "Profile updated" });
    } catch (error) {
      // Error already in state
      Toast.show({ type: "error", text1: "Update failed" });
    }
  };

  return (
    <Form>
      {/* Form fields */}
      {error && <ErrorAlert message={error} />}
      <Button
        title={loading ? "Updating..." : "Save Profile"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </Form>
  );
}

// ============================================================================
// EXAMPLE 5: List Call Logs with Pagination
// ============================================================================
// Location: app/(tabs)/logs.tsx

import { useEffect, useState } from "react";
import { callsService } from "@/services";
import { useApi } from "@/hooks/useApi";

function LogsScreen() {
  const [page, setPage] = useState(1);
  const {
    data: logsResponse,
    loading,
    error,
    execute: fetchLogs,
  } = useApi(callsService.getCallLogs);

  // Fetch on page change
  useEffect(() => {
    fetchLogs({
      page,
      limit: 20,
      // Optional filters:
      // startDate: "2025-01-01",
      // endDate: "2025-01-31",
      // status: "completed",
      // campaign: "campaign-id"
    });
  }, [page, fetchLogs]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <FlatList
      data={logsResponse?.data || []}
      renderItem={({ item }) => (
        <LogItem
          contact={item.contact}
          duration={item.duration}
          date={item.date}
          status={item.status}
        />
      )}
      keyExtractor={(item) => item.id}
      onEndReached={handleLoadMore}
      ListFooterComponent={loading && <ActivityIndicator />}
      ListEmptyComponent={!loading && <EmptyLogs />}
    />
  );
}

// ============================================================================
// EXAMPLE 6: Create New Call Log Entry
// ============================================================================
// Location: components/CallForm.tsx

import { callsService } from "@/services";
import { useApi } from "@/hooks/useApi";

function CallForm() {
  const [formData, setFormData] = useState({
    contact: "",
    duration: 0,
    campaign: "",
    type: "outgoing",
  });

  const { loading, error, execute: createCallLog } = useApi(
    callsService.createCallLog
  );

  const handleSubmitCall = async () => {
    try {
      const result = await createCallLog({
        ...formData,
        date: new Date().toISOString(),
        status: "completed",
      });
      // Call logged successfully
      Toast.show({ type: "success", text1: "Call logged" });
      setFormData({ contact: "", duration: 0, campaign: "", type: "outgoing" });
    } catch (error) {
      // Error already formatted in state
    }
  };

  return (
    <Form>
      <Input
        placeholder="Contact"
        value={formData.contact}
        onChangeText={(contact) => setFormData({ ...formData, contact })}
      />
      {error && <ErrorMessage message={error} />}
      <Button
        title={loading ? "Logging..." : "Log Call"}
        onPress={handleSubmitCall}
        disabled={loading}
      />
    </Form>
  );
}

// ============================================================================
// EXAMPLE 7: Get Call Statistics
// ============================================================================
// Location: app/(tabs)/logs.tsx (header section)

import { useEffect } from "react";
import { callsService } from "@/services";
import { useApi } from "@/hooks/useApi";

function CallStatistics() {
  const {
    data: stats,
    loading,
    execute: fetchStats,
  } = useApi(callsService.getCallStatistics);

  useEffect(() => {
    fetchStats();
    // Optionally refresh every 60 seconds
    const interval = setInterval(() => fetchStats(), 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading) return <Skeleton />;

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      <StatCard
        icon="call"
        label="Total Calls"
        value={stats?.totalCalls || 0}
      />
      <StatCard
        icon="calendar"
        label="This Month"
        value={stats?.thisMonthCalls || 0}
      />
      <StatCard
        icon="time"
        label="Total Minutes"
        value={stats?.totalMinutes || 0}
      />
    </View>
  );
}

// ============================================================================
// EXAMPLE 8: Export Call Logs
// ============================================================================
// Location: components/LogsMenu.tsx or app/(tabs)/logs.tsx

import { callsService } from "@/services";
import { useApi } from "@/hooks/useApi";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

function ExportLogsButton() {
  const { loading, error, execute: exportLogs } = useApi(
    callsService.exportCallLogs
  );

  const handleExportCSV = async () => {
    try {
      const csvData = await exportLogs(
        "csv",
        {
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          limit: 1000,
        }
      );

      // csvData is the file contents
      const fileName = `calls_${Date.now()}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Write to file
      await FileSystem.writeAsStringAsync(fileUri, csvData);

      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Export Call Logs",
      });

      Toast.show({ type: "success", text1: "Exported successfully" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Export failed" });
    }
  };

  return (
    <Button
      title={loading ? "Exporting..." : "Export as CSV"}
      onPress={handleExportCSV}
      disabled={loading}
    />
  );
}

// ============================================================================
// EXAMPLE 9: Error Handling with Retry (Advanced)
// ============================================================================
// Location: Any component fetching data

import { useApi } from "@/hooks/useApi.advanced";
import { retryWithBackoff } from "@/services/api.utils";
import { authService } from "@/services";

function ComponentWithRetry() {
  const { data, loading, error, execute, reset } = useApi(
    (phoneNumber: string) =>
      retryWithBackoff(
        () => authService.requestOtp(phoneNumber),
        3, // max 3 retries
        1000 // 1 second initial delay
      ),
    {
      autoRetry: true,
      maxRetries: 2,
      showErrorMessage: true,
    }
  );

  // Now both retry mechanisms are in place:
  // 1. useApi will retry up to 2 times for retryable errors
  // 2. apiFunction wraps retryWithBackoff for additional retry logic
  // Total: Up to 5 retry attempts with exponential backoff

  return <View>{/* Component content */}</View>;
}

// ============================================================================
// EXAMPLE 10: Debounced Search (Advanced)
// ============================================================================
// Location: components/UserSearch.tsx

import { useState, useCallback } from "react";
import { userService } from "@/services";
import { debounceAsync, RequestCanceller } from "@/services/api.utils";

function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const canceller = new RequestCanceller();

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounceAsync(async (searchQuery: string) => {
      if (!searchQuery) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // Note: Implement searchUsers in userService
        const response = await userService.searchUsers(
          searchQuery,
          canceller.getSignal()
        );
        setResults(response.data);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms debounce
    []
  );

  return (
    <View>
      <TextInput
        placeholder="Search users..."
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          debouncedSearch(text);
        }}
      />
      {loading && <ActivityIndicator />}
      <FlatList data={results} /* ... */ />
    </View>
  );
}

// ============================================================================
// SETUP CHECKLIST
// ============================================================================
/*

✅ Before using the API services in your components:

1. [ ] Install async-storage or expo-secure-store for token storage
    npm install expo-secure-store
    or
    npm install @react-native-async-storage/async-storage

2. [ ] Update services/api.ts with your actual API base URL
    - Replace EXPO_PUBLIC_API_URL environment variable
    - Or hardcode the production URL

3. [ ] Implement token storage in api.ts request interceptor
    const token = await SecureStore.getItemAsync("authToken");

4. [ ] Add token saving in auth.service.ts after successful login
    await SecureStore.setItemAsync("authToken", response.token);

5. [ ] Test OTP flow in dev environment
    - Request OTP
    - Verify OTP response format
    - Check token is stored correctly

6. [ ] Create environment file (.env.local)
    EXPO_PUBLIC_API_URL=https://your-api.com/v1

7. [ ] Update error handling in useApi hook if needed

8. [ ] Add Redux or Zustand if you need global state management
    (Current setup uses Context API which is fine for most cases)

9. [ ] Implement token refresh flow for handling expired tokens

10. [ ] Add analytics logging to track API errors in production

*/
