import AlertModal, { AlertConfig } from "@/components/AlertModal";
import Header from "@/components/Header";
import InterestCard, { InterestItem } from "@/components/InterestCard";
import { ScrollGradientOverlay } from "@/components/ScrollGradientOverlay";
import { useTheme } from "@/context/ThemeContext";
import userService from "@/services/user.service";
import { getThemeColors } from "@/theme/colors";
import { User } from "@/types/api.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Available interests from API documentation
const AVAILABLE_INTERESTS: InterestItem[] = [
  { id: "technology", label: "Technology", icon: "hardware-chip-outline" },
  { id: "business", label: "Business", icon: "briefcase-outline" },
  { id: "health", label: "Health", icon: "fitness-outline" },
  { id: "education", label: "Education", icon: "school-outline" },
  { id: "entertainment", label: "Entertainment", icon: "film-outline" },
  { id: "sports", label: "Sports", icon: "football-outline" },
  { id: "food", label: "Food & Dining", icon: "restaurant-outline" },
  { id: "travel", label: "Travel", icon: "airplane-outline" },
  { id: "finance", label: "Finance", icon: "cash-outline" },
  { id: "fashion", label: "Fashion", icon: "shirt-outline" },
  { id: "music", label: "Music", icon: "musical-notes-outline" },
  { id: "news", label: "News & Politics", icon: "newspaper-outline" },
];

export default function InterestsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  const primaryTextColor = isDarkMode ? "#F9FAFB" : "#111827";
  const secondaryTextColor = isDarkMode ? "#9CA3AF" : "#6B7280";

  // State
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Alert modal state
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  // Fetch interests on mount
  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      setError(null);

      const response = await userService.getUserProfile();
      const profileData = (response.data || response) as User;

      // Set selected interests from profile
      if (profileData.interests && Array.isArray(profileData.interests)) {
        setSelectedInterests(profileData.interests);
      }
    } catch (err: any) {
      console.error("[InterestsScreen] Failed to load interests:", err);
      setError(err.message || "Failed to load interests");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInterests(true);
  };

  const handleAlertDismiss = () => {
    setAlertConfig({ visible: false, title: "", message: "", type: "info" });
  };

  const saveInterests = async (newInterests: string[]) => {
    try {
      setSaving(true);
      await userService.updateUserInterests(newInterests);
      console.log("[InterestsScreen] Interests saved successfully");
    } catch (err: any) {
      console.error("[InterestsScreen] Failed to save interests:", err);
      setAlertConfig({
        visible: true,
        title: "Error",
        message: err.message || "Failed to save interests. Please try again.",
        type: "error",
      });
      // Revert to previous state on error
      fetchInterests(true);
    } finally {
      setSaving(false);
    }
  };

  const toggleInterest = async (id: string) => {
    const newInterests = selectedInterests.includes(id)
      ? selectedInterests.filter((item) => item !== id)
      : [...selectedInterests, id];

    // Update UI immediately for responsiveness
    setSelectedInterests(newInterests);

    // Save to API
    await saveInterests(newInterests);
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const listHeader = (
    <View className="mb-6">
      <Text style={{ color: primaryTextColor }} className="text-base font-semibold">
        Your Interests
      </Text>
      <Text style={{ color: secondaryTextColor }} className="mt-2 text-sm">
        Select topics you're interested in. This helps us personalize your experience.
      </Text>
      <View className="mt-3 flex-row items-center gap-2">
        <View className="rounded-full bg-orange-50 px-3 py-1.5">
          <Text className="text-xs font-semibold text-orange-700">
            Selected: {selectedInterests.length}
          </Text>
        </View>
        {saving && (
          <ActivityIndicator size="small" color="#FB923C" />
        )}
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View className={`flex-1 ${colors.bg}`}>
        <Header
          title="Interests"
          showLogo={false}
          onPressSettings={handleSettings}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FB923C" />
          <Text className={`mt-4 ${colors.textSecondary}`}>
            Loading interests...
          </Text>
        </View>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View className={`flex-1 ${colors.bg}`}>
        <Header
          title="Interests"
          showLogo={false}
          onPressSettings={handleSettings}
        />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className={`mt-4 text-center ${colors.text}`}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => fetchInterests()}
            className="mt-6 rounded-xl bg-orange-600 px-6 py-3"
          >
            <Text className="font-semibold text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${colors.bg}`}>
      <Header
        title="Interests"
        showLogo={false}
        onPressSettings={handleSettings}
      />

      <FlatList
        data={AVAILABLE_INTERESTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 18,
          paddingBottom: 84,
          gap: 12,
        }}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => (
          <InterestCard
            item={item}
            selected={selectedInterests.includes(item.id)}
            isDarkMode={isDarkMode}
            onToggle={() => toggleInterest(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#FB923C"
            colors={["#FB923C"]}
          />
        }
      />
      <ScrollGradientOverlay height={80} />

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
