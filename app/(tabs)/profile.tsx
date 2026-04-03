import AlertModal, { AlertConfig } from "@/components/AlertModal";
import Header from "@/components/Header";
import { ScrollGradientOverlay } from "@/components/ScrollGradientOverlay";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import userService from "@/services/user.service";
import { getThemeColors } from "@/theme/colors";
import { User } from "@/types/api.types";
import { formatContact } from "@/utils/formatContact";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  expanded: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  isDarkMode: boolean;
};

function SelectField({
  label,
  value,
  options,
  expanded,
  onToggle,
  onSelect,
  isDarkMode,
}: SelectFieldProps) {
  const primaryText = isDarkMode ? "#F9FAFB" : "#111827";
  const secondaryText = isDarkMode ? "#9CA3AF" : "#6B7280";
  const fieldBg = isDarkMode ? "#111827" : "#fcfcfc";
  const borderColor = isDarkMode ? "#191f29" : "#f2f3f5";

  // Check if value is a placeholder (starts with "Select")
  const isPlaceholder = value.startsWith("Select");

  return (
    <View className="mb-4">
      <Text
        style={{ color: secondaryText }}
        className="mb-1.5 text-xs font-semibold uppercase"
      >
        {label}
      </Text>

      <Pressable
        onPress={onToggle}
        className="flex-row items-center justify-between rounded-xl px-3 py-3"
        style={{ backgroundColor: fieldBg, borderColor, borderWidth: 1 }}
      >
        <Text
          style={{
            color: isPlaceholder ? secondaryText : primaryText,
          }}
        >
          {value}
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={secondaryText}
        />
      </Pressable>

      {expanded ? (
        <View
          className="mt-2 overflow-hidden rounded-xl"
          style={{ backgroundColor: fieldBg, borderColor, borderWidth: 1 }}
        >
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              className="px-3 py-3"
              style={{
                backgroundColor:
                  option === value
                    ? isDarkMode
                      ? "rgba(251, 146, 60, 0.16)"
                      : "rgba(251, 146, 60, 0.14)"
                    : "transparent",
              }}
            >
              <Text
                style={{
                  color: option === value ? "#EA580C" : primaryText,
                  fontWeight: option === value ? "600" : "500",
                }}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

// Helper functions to convert between API and display formats
const apiToDisplayAgeGroup = (apiValue: string | null | undefined): string => {
  if (!apiValue) return "Select age group";
  const map: Record<string, string> = {
    "under-18": "Under 18",
    "18-24": "18-24",
    "25-34": "25-34",
    "35-44": "35-44",
    "45-54": "45-54",
    "55-64": "55-64",
    "65+": "65+",
  };
  return map[apiValue] || apiValue;
};

const displayToApiAgeGroup = (displayValue: string): string | null => {
  if (displayValue === "Select age group") return null;
  const map: Record<string, string> = {
    "Under 18": "under-18",
    "18-24": "18-24",
    "25-34": "25-34",
    "35-44": "35-44",
    "45-54": "45-54",
    "55-64": "55-64",
    "65+": "65+",
  };
  return map[displayValue] || null;
};

const apiToDisplayGender = (apiValue: string | null | undefined): string => {
  if (!apiValue) return "Select gender";
  const map: Record<string, string> = {
    male: "Male",
    female: "Female",
    other: "Other",
    "prefer-not-to-say": "Prefer not to say",
  };
  return map[apiValue] || apiValue;
};

const displayToApiGender = (displayValue: string): string | null => {
  if (displayValue === "Select gender") return null;
  const map: Record<string, string> = {
    Male: "male",
    Female: "female",
    Other: "other",
    "Prefer not to say": "prefer-not-to-say",
  };
  return map[displayValue] || null;
};

const apiToDisplayPhoneType = (apiValue: string | null | undefined): string => {
  if (!apiValue) return "Select phone type";
  const map: Record<string, string> = {
    smart: "Smart Phone",
    basic: "Basic Phone",
  };
  return map[apiValue] || apiValue;
};

const displayToApiPhoneType = (displayValue: string): string | null => {
  if (displayValue === "Select phone type") return null;
  const map: Record<string, string> = {
    "Smart Phone": "smart",
    "Basic Phone": "basic",
  };
  return map[displayValue] || null;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  const primaryText = isDarkMode ? "#F9FAFB" : "#111827";
  const secondaryText = isDarkMode ? "#9CA3AF" : "#6B7280";
  const cardBg = isDarkMode ? "#111827" : "#FFFFFF";
  // const inputBg = isDarkMode ? "#0F172A" : "#FFFFFF";
  const inputBorder = isDarkMode ? "#191f29" : "#f2f3f5";

  const [ageGroup, setAgeGroup] = useState("Select age group");
  const [gender, setGender] = useState("Select gender");
  const [language, setLanguage] = useState("Select language");
  const [phoneType, setPhoneType] = useState("Select phone type");
  const [region, setRegion] = useState("Select region");
  const [expandedSelect, setExpandedSelect] = useState<string | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Alert modal state
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  // Call stats
  const [callCount, setCallCount] = useState(0);

  // Fetch user profile on mount - only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchUserProfile = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      setError(null);

      const response = await userService.getUserProfile();
      const profileData = (response.data || response) as User;

      // Map API data to form states
      setAgeGroup(apiToDisplayAgeGroup(profileData.age_group));
      setGender(apiToDisplayGender(profileData.gender));
      setLanguage(profileData.language_preference || "Select language");
      setPhoneType(apiToDisplayPhoneType(profileData.phone_type));
      setRegion(profileData.region || "Select region");
      setCallCount(profileData.call_count || 0);
    } catch (err: any) {
      console.error("[ProfileScreen] Failed to load profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (!isAuthenticated) return;
    setRefreshing(true);
    fetchUserProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const updateData: Partial<User> = {
        age_group: displayToApiAgeGroup(ageGroup) as User["age_group"],
        gender: displayToApiGender(gender) as User["gender"],
        language_preference: language === "Select language" ? null : language,
        phone_type: displayToApiPhoneType(phoneType) as User["phone_type"],
        region: region === "Select region" ? null : region,
      };

      await userService.updateUserProfile(updateData);

      setAlertConfig({
        visible: true,
        title: "Success",
        message: "Your profile has been updated successfully!",
        type: "success",
      });
    } catch (err: any) {
      console.error("[ProfileScreen] Failed to save profile:", err);
      setAlertConfig({
        visible: true,
        title: "Error",
        message: err.message || "Failed to save profile. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAlertDismiss = () => {
    setAlertConfig({ visible: false, title: "", message: "", type: "info" });
  };

  const toggleSelect = (key: string) => {
    setExpandedSelect((prev) => (prev === key ? null : key));
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  if (loading && !refreshing) {
    return (
      <View className={`flex-1 ${colors.bg}`}>
        <Header
          title="My Profile"
          showLogo={false}
          onPressSettings={handleSettings}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FB923C" />
          <Text className={`mt-4 ${colors.textSecondary}`}>
            Loading profile...
          </Text>
        </View>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View className={`flex-1 ${colors.bg}`}>
        <Header
          title="My Profile"
          showLogo={false}
          onPressSettings={handleSettings}
        />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className={`mt-4 text-center ${colors.text}`}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => fetchUserProfile()}
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
          title="My Profile"
          showLogo={false}
          onPressSettings={handleSettings}
        />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="person-outline" size={48} color="#9CA3AF" />
          <Text className={`mt-4 text-center text-base ${colors.text}`}>
            Sign in to view and manage your profile
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
        title="My Profile"
        showLogo={false}
        onPressSettings={handleSettings}
      />

      <View style={{ position: "relative", flex: 1 }}>
        <ScrollView
          className={`flex-1 ${colors.bg}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 14,
            paddingBottom: 88,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#FB923C"
              colors={["#FB923C"]}
            />
          }
        >
          <View
            className="mb-5 rounded-2xl px-4 py-4"
            style={{ backgroundColor: cardBg }}
          >
            <Text style={{ color: primaryText }} className="text-base font-semibold">
              Complete Your Profile
            </Text>
            <Text
              style={{ color: secondaryText }}
              className="mt-1.5 text-sm leading-5"
            >
              Help us personalize your experience by completing your profile. You've made {callCount} call{callCount !== 1 ? 's' : ''} with Kasa!
            </Text>
          </View>

          <View
            className="mb-4 rounded-2xl px-4 py-4"
            style={{ backgroundColor: cardBg }}
          >
            <Text
              style={{ color: primaryText }}
              className="text-base font-bold"
            >
              Account
            </Text>

            <View className="mt-4">
              <Text
                style={{ color: secondaryText }}
                className="mb-1.5 text-xs font-semibold uppercase"
              >
                Phone Number
              </Text>
              <TextInput
                value={formatContact(user?.phone_number || "")}
                editable={false}
                className="rounded-xl px-3 py-3"
                style={{
                  backgroundColor: isDarkMode ? "#0B1220" : "#F3F4F6",
                  borderWidth: 1,
                  borderColor: inputBorder,
                  color: secondaryText,
                }}
              />
            </View>

            <View className="mt-4">
              <Text
                style={{ color: secondaryText }}
                className="mb-1.5 text-xs font-semibold uppercase"
              >
                Country Code
              </Text>
              <TextInput
                value={user?.country_code ? `+${user.country_code}` : "+233"}
                editable={false}
                className="rounded-xl px-3 py-3"
                style={{
                  backgroundColor: isDarkMode ? "#0B1220" : "#F3F4F6",
                  borderWidth: 1,
                  borderColor: inputBorder,
                  color: secondaryText,
                }}
              />
            </View>
          </View>

          <View
            className="rounded-2xl px-4 py-4"
            style={{ backgroundColor: cardBg }}
          >
            <Text
              style={{ color: primaryText }}
              className="text-base font-bold"
            >
              Personal Information
            </Text>

            <View className="mt-4">
              <SelectField
                label="Age Group"
                value={ageGroup}
                options={[
                  "Select age group",
                  "Under 18",
                  "18-24",
                  "25-34",
                  "35-44",
                  "45-54",
                  "55-64",
                  "65+",
                ]}
                expanded={expandedSelect === "ageGroup"}
                onToggle={() => toggleSelect("ageGroup")}
                onSelect={(value) => {
                  setAgeGroup(value);
                  setExpandedSelect(null);
                }}
                isDarkMode={isDarkMode}
              />

              <SelectField
                label="Gender"
                value={gender}
                options={["Select gender", "Male", "Female", "Other", "Prefer not to say"]}
                expanded={expandedSelect === "gender"}
                onToggle={() => toggleSelect("gender")}
                onSelect={(value) => {
                  setGender(value);
                  setExpandedSelect(null);
                }}
                isDarkMode={isDarkMode}
              />

              <SelectField
                label="Region"
                value={region}
                options={[
                  "Select region",
                  "Greater Accra",
                  "Central",
                  "Western",
                  "Northern",
                  "Ashanti",
                  "Eastern",
                  "Volta",
                  "Ahafo",
                  "Bono",
                  "Bono East",
                  "Upper East",
                  "Upper West",
                  "Savannah",
                  "North East",
                  "Oti",
                  "Western North",
                ]}
                expanded={expandedSelect === "region"}
                onToggle={() => toggleSelect("region")}
                onSelect={(value) => {
                  setRegion(value);
                  setExpandedSelect(null);
                }}
                isDarkMode={isDarkMode}
              />

              <SelectField
                label="Language Preference"
                value={language}
                options={[
                  "Select language",
                  "English",
                  "Twi",
                  "Ga",
                  "Ewe",
                  "Hausa",
                  "Dagbani",
                  "Fante",
                ]}
                expanded={expandedSelect === "language"}
                onToggle={() => toggleSelect("language")}
                onSelect={(value) => {
                  setLanguage(value);
                  setExpandedSelect(null);
                }}
                isDarkMode={isDarkMode}
              />

              <SelectField
                label="Phone Type"
                value={phoneType}
                options={["Select phone type", "Smart Phone", "Basic Phone"]}
                expanded={expandedSelect === "phoneType"}
                onToggle={() => toggleSelect("phoneType")}
                onSelect={(value) => {
                  setPhoneType(value);
                  setExpandedSelect(null);
                }}
                isDarkMode={isDarkMode}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSaveProfile}
            disabled={saving}
            className="mt-5 h-12 flex-row gap-2 items-center justify-center rounded-xl bg-orange-600"
            activeOpacity={0.88}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="white" />
                <Text className="text-base font-semibold text-white">
                  Save Profile
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
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
