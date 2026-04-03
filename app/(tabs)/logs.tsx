import AlertModal, { AlertConfig } from "@/components/AlertModal";
import Header from "@/components/Header";
import LogCard, { CallLogItem } from "@/components/LogCard";
import { ScrollGradientOverlay } from "@/components/ScrollGradientOverlay";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getCallLogs } from "@/services/call.service";
import { getThemeColors } from "@/theme/colors";
import { CallLog, CallsListResponse } from "@/types/api.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    ListRenderItem,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Helper to format API call data to LogCard format
const transformCallLog = (apiLog: CallLog): CallLogItem => {
  // Format timestamp to readable date
  const date = new Date(apiLog.timestamp);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Format duration from seconds to mm:ss
  const totalSeconds = apiLog.duration_played || 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedDuration = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Determine type and status
  const type = apiLog.is_survey ? "Survey" : apiLog.call_type || "Ad";
  const status = apiLog.call_duration > 0 ? "completed" : "missed";

  return {
    id: String(apiLog.id),
    contact: "Call", // API doesn't return destination, show generic
    duration: formattedDuration,
    date: formattedDate,
    campaign: apiLog.is_survey ? "Survey Call" : "Kasa Free Call",
    type: type as "Ad" | "Survey",
    status,
    rawDuration: apiLog.duration_played, // Keep raw seconds for stats calculation
  };
};

export default function LogsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  const primaryTextColor = isDarkMode ? "#F9FAFB" : "#111827";
  const secondaryTextColor = isDarkMode ? "#9CA3AF" : "#6B7280";

  // State for call logs
  const [logs, setLogs] = useState<CallLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });

  // Alert modal state
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  // Fetch call logs on mount - only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCallLogs();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCallLogs = async (page = 1, isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      setError(null);

      const response = await getCallLogs(page, 20);
      const data = (response.data || response) as CallsListResponse;

      if (data && data.calls) {
        const transformedLogs = data.calls.map(transformCallLog);
        setLogs(transformedLogs);
        setPagination({
          total: data.total || 0,
          page: data.page || 1,
          pages: data.pages || 1,
        });
      }
    } catch (err: any) {
      console.error("[LogsScreen] Failed to fetch call logs:", err);
      setError(err.message || "Failed to load call logs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (!isAuthenticated) return;
    setRefreshing(true);
    fetchCallLogs(1, true);
  };

  const handleAlertDismiss = () => {
    setAlertConfig({ visible: false, title: "", message: "", type: "info" });
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const renderLogItem: ListRenderItem<CallLogItem> = ({ item, index }) => (
    <LogCard log={item} index={index} isDarkMode={isDarkMode} />
  );

  // Calculate stats from logs
  const totalCalls = pagination.total || logs.length;
  const lastCallDate = logs.length > 0 ? logs[0].date : "-";
  
  // Sum duration_played in minutes - calculate from raw API data
  const totalMinutes = logs.reduce((sum: number, log: CallLogItem & { rawDuration?: number }) => {
    // Use raw duration in seconds if available, otherwise parse from formatted string
    const seconds = log.rawDuration || 0;
    return sum + seconds / 60;
  }, 0);

  const StatCard = ({
    icon,
    label,
    value,
    color,
    bg,
  }: {
    icon: string;
    label: string;
    value: string;
    color: string;
    bg: string;
  }) => (
    <View
      style={{
        width: "100%",
        marginBottom: 10,
        backgroundColor: bg,
        borderRadius: 16,
        padding: 12,
        alignItems: "center",
        flexDirection: "row",
        gap: 12,
      }}
    >
      <View
        style={{
          backgroundColor: color + "22",
          borderRadius: 20,
          padding: 6,
        }}
      >
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <View>
        <Text style={{ color: color, fontWeight: "bold", fontSize: 14 }}>
          {value}
        </Text>
        <Text style={{ color: secondaryTextColor, fontSize: 10, marginTop: 2 }} className="uppercase">
          {label}
        </Text>
      </View>
    </View>
  );

  const listHeader = (
    <View className="mb-8">
      {/* Stat Cards - Full Width Stack */}
      <View style={{ flexDirection: "column", marginBottom: 18, marginTop: 0 }}>
        <StatCard
          icon="call"
          label="Total Calls"
          value={String(totalCalls)}
          color={isDarkMode ? "#FBBF24" : "#EA580C"}
          bg={isDarkMode ? "#18181b" : "#fff7ed"}
        />
        <StatCard
          icon="calendar"
          label="Last Call"
          value={lastCallDate}
          color={isDarkMode ? "#60A5FA" : "#2563EB"}
          bg={isDarkMode ? "#172554" : "#eff6ff"}
        />
        <StatCard
          icon="time"
          label="Total Minutes"
          value={`${totalMinutes.toFixed(1)} min`}
          color={isDarkMode ? "#10B981" : "#059669"}
          bg={isDarkMode ? "#052e16" : "#ecfdf5"}
        />
      </View>
      <Text style={{ color: primaryTextColor }} className="text-base font-semibold">
        Your Call History
      </Text>
      <Text style={{ color: secondaryTextColor }} className="mt-1 text-sm">
        Showing {logs.length} of {totalCalls} calls
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View className={`flex-1 ${colors.bg}`}>
        <Header
          title="Call Logs"
          showLogo={false}
          onPressSettings={handleSettings}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FB923C" />
          <Text className={`mt-4 ${colors.textSecondary}`}>
            Loading call logs...
          </Text>
        </View>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View className={`flex-1 ${colors.bg}`}>
        <Header
          title="Call Logs"
          showLogo={false}
          onPressSettings={handleSettings}
        />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className={`mt-4 text-center ${colors.text}`}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => fetchCallLogs()}
            className="mt-6 rounded-xl bg-orange-600 px-6 py-3"
          >
            <Text className="font-semibold text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <View className={`flex-1 ${colors.bg}`}>
        <Header
          title="Call Logs"
          showLogo={false}
          onPressSettings={handleSettings}
        />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="call-outline" size={48} color="#9CA3AF" />
          <Text className={`mt-4 text-center text-base ${colors.text}`}>
            Sign in to view your call history
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="mt-6 rounded-xl bg-orange-600 px-6 py-3"
          >
            <Text className="font-semibold text-white">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${colors.bg}`}>
      <Header
        title="Call Logs"
        showLogo={false}
        onPressSettings={handleSettings}
      />

      <View style={{ position: "relative", flex: 1 }}>
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderLogItem}
          ListHeaderComponent={listHeader}
          className={`flex-1 ${colors.bg}`}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 18,
            paddingBottom: 80,
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#FB923C"
              colors={["#FB923C"]}
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Ionicons name="call-outline" size={48} color={secondaryTextColor} />
              <Text style={{ color: secondaryTextColor }} className="mt-4 text-center">
                No call logs yet.\nMake your first call to see it here!
              </Text>
            </View>
          }
        />
        <ScrollGradientOverlay height={80} />
      </View>

      {/* Alert Modal */}
      <AlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onDismiss={handleAlertDismiss}
      />
    </View>
  );
}
