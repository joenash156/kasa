import AlertModal, { AlertConfig } from "@/components/AlertModal";
import { ScrollGradientOverlay } from "@/components/ScrollGradientOverlay";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getThemeColors } from "@/theme/colors";
import { formatContact } from "@/utils/formatContact";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const APP_VERSION = "1.0.0";
const APP_NAME = "Kasa";
const APP_DESCRIPTION = "Free calls with quick ads";

const THEME_OPTIONS = [
  {
    value: "light",
    label: "Light",
    description: "Bright and clear for daytime use",
    icon: "sunny" as const,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Easy on the eyes in low light",
    icon: "moon" as const,
  },
  {
    value: "system",
    label: "System",
    description: "Match your device appearance automatically",
    icon: "phone-portrait" as const,
  },
] as const;

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const { theme, themePreference, setThemePreference } = useTheme();
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);

  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  const {
    bg: bgColor,
    card: cardBg,
    text: textColor,
    textSecondary: secondaryTextColor,
    // border: borderColor,
    iconPrimary,
  } = colors;
  const activeThemeOption =
    THEME_OPTIONS.find((option) => option.value === themePreference) ??
    THEME_OPTIONS[0];

  const handleLogout = () => {
    logout();
    setAlertConfig({
      visible: true,
      title: "Logged Out",
      message: "You have been successfully logged out.",
      type: "success",
    });
  };

  const handleAlertDismiss = () => {
    setAlertConfig({ visible: false, title: "", message: "", type: "info" });
    router.replace("/(auth)/login");
  };

  const handleThemeSelection = (
    selection: (typeof THEME_OPTIONS)[number]["value"]
  ) => {
    setThemePreference(selection);
    setIsThemeModalVisible(false);
  };

  return (
    <View className={`flex-1 ${bgColor}`}>
      {/* Header */}
      <View
        className={`flex-row items-center px-3 py-3 ${isDarkMode ? "bg-gray-950" : "bg-white"}`}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="h-10 w-10 mr-6 items-center justify-center 0"
        >
          <Ionicons
            name="chevron-back"
            size={26}
            color={isDarkMode ? "#fff" : "#1F2937"}
          />
        </TouchableOpacity>
        <Text className={`text-2xl font-bold ${textColor}`}>Settings</Text>
      </View>

      <View style={{ position: "relative", flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className={`flex-1 ${bgColor}`}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {/* Account Section */}
          <View className="px-3 pt-6">
            <Text
              className={`text-sm font-semibold uppercase tracking-wider ${secondaryTextColor} mb-3`}
            >
              Account
            </Text>

            <View
              className={`rounded-2xl overflow-hidden ${cardBg}`}
              style={{
                borderWidth: 1,
                borderColor: isDarkMode ? "#0d0d0d" : "#f7f7f7",
              }}
            >
              {/* User Info */}
              <View className={`flex-row items-center gap-4 px-3 py-4`}>
                <View
                  className={`h-12 w-12 items-center justify-center ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-200"
                  }`}
                  style={{ borderRadius: 30 }}
                >
                  <Ionicons
                    name={user ? "person" : "person-outline"}
                    size={20}
                    color={`${isDarkMode ? "#6B7280" : "#FFFFFF"}`}
                  />
                </View>

                <View className="flex-1">
                  <Text className={`text-sm font-semibold ${textColor}`}>
                    {user ? "Active User" : "Guest"}
                  </Text>
                  <Text className={`text-xs mt-1 ${secondaryTextColor}`}>
                    {user
                      ? `${formatContact(user.phone_number)}`
                      : "Sign in to save preferences"}
                  </Text>
                </View>

                {user && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color="#10B911"
                  />
                )}
              </View>
            </View>
          </View>

          {/* Preferences Section */}
          <View className="px-3 pt-8">
            <Text
              className={`text-sm font-semibold uppercase tracking-wider ${secondaryTextColor} mb-3`}
            >
              Preferences
            </Text>

            <View
              className={`rounded-2xl overflow-hidden ${cardBg}`}
              style={{
                borderWidth: 1,
                borderColor: isDarkMode ? "#0d0d0d" : "#f7f7f7",
              }}
              >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsThemeModalVisible(true)}
                className={`flex-row items-center justify-between px-3 py-4`}
              >
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    <Ionicons
                      name={activeThemeOption.icon}
                      size={20}
                      color={iconPrimary}
                    />
                  </View>
                  <View>
                    <Text className={`text-sm font-semibold ${textColor}`}>
                      Theme
                    </Text>
                    <Text className={`text-xs mt-0.5 ${secondaryTextColor}`}>
                      {activeThemeOption.label}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-2">
                  <Text className={`text-sm font-medium ${secondaryTextColor}`}>
                    {activeThemeOption.label}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={isDarkMode ? "#666" : "#9CA3AF"}
                  />
                </View>
              </TouchableOpacity>

              {/* Notification Setting Placeholder */}
              {/* <View className={`flex-row items-center justify-between px-3 py-4`}>
              <View className="flex-1 flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#3B82F6"
                  />
                </View>
                <View>
                  <Text className={`text-sm font-semibold ${textColor}`}>
                    Notifications
                  </Text>
                  <Text className={`text-xs mt-0.5 ${secondaryTextColor}`}>
                    Stay updated on offers
                  </Text>
                </View>
              </View>

              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: "#D1D5DB", true: "#4B5563" }}
                thumbColor="#FFA500"
              />
            </View> */}
            </View>
          </View>

          {/* Legal Section */}
          <View className="px-3 pt-8">
            <Text
              className={`text-sm font-semibold uppercase tracking-wider ${secondaryTextColor} mb-3`}
            >
              Legal
            </Text>

            <View
              className={`rounded-2xl overflow-hidden ${cardBg}`}
              style={{
                borderWidth: 1,
                borderColor: isDarkMode ? "#0d0d0d" : "#f7f7f7",
              }}
            >
              {/* Privacy Policy */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/(legal)/privacy")}
                className={`flex-row items-center justify-between px-3 py-4`}
              >
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color="#8B5CF6"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-sm font-semibold ${textColor}`}>
                      Privacy Policy
                    </Text>
                    <Text className={`text-xs mt-0.5 ${secondaryTextColor}`}>
                      How we handle your data
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDarkMode ? "#666" : "#ccc"}
                />
              </TouchableOpacity>

              {/* Terms of Use */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/(legal)/terms")}
                className={`flex-row items-center justify-between px-3 py-4`}
              >
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Ionicons name="document-text" size={20} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-sm font-semibold ${textColor}`}>
                      Terms of Use
                    </Text>
                    <Text className={`text-xs mt-0.5 ${secondaryTextColor}`}>
                      App usage guidelines
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDarkMode ? "#666" : "#ccc"}
                />
              </TouchableOpacity>

              {/* Data & Compliance */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/(legal)/data")}
                className={`flex-row items-center justify-between px-3 py-4`}
              >
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color="#10B981"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-sm font-semibold ${textColor}`}>
                      Data & Compliance
                    </Text>
                    <Text className={`text-xs mt-0.5 ${secondaryTextColor}`}>
                      Security & compliance info
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDarkMode ? "#666" : "#ccc"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Section */}
          <View className="px-3 pt-8">
            <Text
              className={`text-sm font-semibold uppercase tracking-wider ${secondaryTextColor} mb-3`}
            >
              Contact
            </Text>

            <View
              className={`rounded-2xl overflow-hidden ${cardBg}`}
              style={{
                borderWidth: 1,
                borderColor: isDarkMode ? "#0d0d0d" : "#f7f7f7",
              }}
            >
              {/* Email */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => Linking.openURL("mailto:info@delaphonegh.com")}
                className={`flex-row items-center justify-between px-3 py-4`}
              >
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Ionicons name="mail" size={20} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-sm font-semibold ${textColor}`}>
                      Email
                    </Text>
                    <Text className={`text-xs mt-0.5 ${secondaryTextColor}`}>
                      info@delaphonegh.com
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDarkMode ? "#666" : "#ccc"}
                />
              </TouchableOpacity>

              {/* Phone */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => Linking.openURL("tel:+233551660436")}
                className={`flex-row items-center justify-between px-3 py-4`}
              >
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Ionicons name="call" size={20} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-sm font-semibold ${textColor}`}>
                      Phone
                    </Text>
                    <Text className={`text-xs mt-0.5 ${secondaryTextColor}`}>
                      +233 551 660 436
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDarkMode ? "#666" : "#ccc"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* About Section */}
          <View className="px-3 pt-8 pb-10">
            <Text
              className={`text-sm font-semibold uppercase tracking-wider ${secondaryTextColor} mb-3`}
            >
              About
            </Text>

            <View
              className={`rounded-2xl overflow-hidden ${cardBg}`}
              style={{
                borderWidth: 1,
                borderColor: isDarkMode ? "#0d0d0d" : "#f7f7f7",
              }}
            >
              {/* App Name */}
              <View
                className={`flex-row items-center justify-between px-3 py-4 `}
              >
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <Ionicons name="cube" size={20} color="#8B5CF6" />
                  </View>
                  <Text className={`text-sm font-semibold ${textColor}`}>
                    App Name
                  </Text>
                </View>
                <Text className={`text-sm font-semibold ${secondaryTextColor}`}>
                  {APP_NAME}
                </Text>
              </View>

              {/* Version */}
              <View
                className={`flex-row items-center justify-between px-3 py-4 `}
              >
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color="#10B981"
                    />
                  </View>
                  <Text className={`text-sm font-semibold ${textColor}`}>
                    Version
                  </Text>
                </View>
                <Text className={`text-sm font-semibold ${secondaryTextColor}`}>
                  {APP_VERSION}
                </Text>
              </View>

              {/* Description */}
              <View
                className={`flex-row items-center justify-between px-3 py-4 `}
              >
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                    <Feather name="award" size={20} color="#EC4899" />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-sm font-semibold ${textColor}`}>
                      Description
                    </Text>
                    <Text className={`text-xs mt-0.5 ${secondaryTextColor}`}>
                      {APP_DESCRIPTION}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Logout Button */}
              {user && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleLogout}
                  className={`flex-row items-center justify-center mt-2 gap-3 px-3 py-4`}
                >
                  <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                  <Text className="text-sm font-semibold text-red-500">
                    Logout
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Footer */}
          <View className="px-3 py-2">
            <View className="flex-row w-full gap-1 items-center justify-center mx-auto">
              <Text className={`text-xs text-center ${secondaryTextColor}`}>
                Made by
              </Text>
              <Image
                source={require("../assets/images/dlp-logo.png")}
                className="w-10 h-full"
              />
              <Text
                className={`text-xs text-center ${secondaryTextColor}`}
                onPress={() => Linking.openURL("https://www.dlp.africa")}
                style={{ textDecorationLine: "underline" }}
              >
                dlp africa
              </Text>
            </View>
            <Text className={`text-xs text-center mt-1 pb-10 ${secondaryTextColor}`}>
              © 2026 All rights reserved
            </Text>
          </View>
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

      <Modal
        visible={isThemeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsThemeModalVisible(false)}
      >
        <Pressable
          className="flex-1"
          onPress={() => setIsThemeModalVisible(false)}
        >
          <BlurView
            intensity={20}
            tint={isDarkMode ? "dark" : "light"}
            className="absolute inset-0"
            style={{
              backgroundColor: isDarkMode
                ? "rgba(3, 7, 18, 0.45)"
                : "rgba(255, 255, 255, 0.35)",
            }}
          />
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className={`${isDarkMode ? "bg-gray-950" : "bg-white"} mt-auto rounded-t-[28px] px-5 pt-5`}
            style={{
              paddingBottom: Math.max(insets.bottom, 20),
              borderTopWidth: 1,
              borderColor: isDarkMode ? "#141414" : "#fafafa",
            }}
          >
            <View className="items-center pb-4">
              <View
                className={`h-1.5 w-14 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
              />
            </View>

            <View className="pb-5">
              <Text className={`text-xl font-bold ${textColor}`}>
                Choose theme
              </Text>
              <Text className={`mt-1 text-sm ${secondaryTextColor}`}>
                Select how Kasa should look across the app.
              </Text>
            </View>

            <View className="gap-3">
              {THEME_OPTIONS.map((option) => {
                const isSelected = themePreference === option.value;

                return (
                  <TouchableOpacity
                    key={option.value}
                    activeOpacity={0.85}
                    onPress={() => handleThemeSelection(option.value)}
                    className={`flex-row items-center rounded-2xl px-4 py-4 ${isSelected ? (isDarkMode ? "bg-orange-950" : "bg-orange-50") : isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
                    style={{
                      borderWidth: 1,
                      borderColor: isSelected
                        ? "#F97316"
                        : isDarkMode
                          ? "#212121"
                          : "#E5E7EB",
                    }}
                  >
                    <View className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-orange-100">
                      <Ionicons
                        name={option.icon}
                        size={20}
                        color={iconPrimary}
                      />
                    </View>

                    <View className="flex-1 pr-4">
                      <Text className={`text-base font-semibold ${textColor}`}>
                        {option.label}
                      </Text>
                      <Text className={`mt-1 text-sm ${secondaryTextColor}`}>
                        {option.description}
                      </Text>
                    </View>

                    <View
                      className={`h-6 w-6 items-center justify-center rounded-full ${
                        isSelected
                          ? "border-orange-500 bg-orange-500"
                          : isDarkMode
                            ? "border-gray-600 bg-transparent"
                            : "border-gray-300 bg-transparent"
                      }`}
                      style={{ borderWidth: 2 }}
                    >
                      {isSelected && (
                        <View className="h-2.5 w-2.5 rounded-full bg-white" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
