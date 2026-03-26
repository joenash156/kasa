import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getThemeColors } from "@/theme/colors";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Linking, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

const APP_VERSION = "1.0.0";
const APP_NAME = "Kasa";
const APP_DESCRIPTION = "Free calls with quick ads";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

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

  const handleLogout = () => {
    logout();
    router.push("/(auth)/login");
  };

  return (
    <View className={`flex-1 ${bgColor}`}>
      {/* Header */}
      <View
        className={`flex-row items-center justify-between px-3 py-4 ${isDarkMode ? "bg-gray-950" : "bg-white"}`}
      >
        <Text className={`text-2xl font-bold ${textColor}`}>Settings</Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons
            name="close-outline"
            size={26}
            color={isDarkMode ? "#fff" : "#1F2937"}
          />
        </TouchableOpacity>
      </View>

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
              borderColor: isDarkMode ? "#212121" : "#f7f7f7",
            }}
          >
            {/* User Info */}
            <View
              className={`flex-row items-center gap-4 px-3 py-4`}

            >
              <View
                className={`h-12 w-12 items-center justify-center rounded-full ${
                  user
                    ? "bg-gradient-to-br from-orange-400 to-orange-600"
                    : "bg-gray-300"
                }`}
              >
                <Ionicons
                  name={user ? "person" : "person-outline"}
                  size={20}
                  color="white"
                />
              </View>

              <View className="flex-1">
                <Text className={`text-sm font-semibold ${textColor}`}>
                  {user ? "Logged In" : "Guest User"}
                </Text>
                <Text className={`text-xs mt-1 ${secondaryTextColor}`}>
                  {user
                    ? `+233${user.phoneNumber}`
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

            {/* Logout Button */}
            {user && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLogout}
                className={`flex-row items-center gap-3 px-3 py-4`}
              >
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                <Text className="text-sm font-semibold text-red-500">
                  Logout
                </Text>
              </TouchableOpacity>
            )}
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
              borderColor: isDarkMode ? "#212121" : "#f7f7f7",
            }}
          >
            {/* Theme Toggle */}
            <View
              className={`flex-row items-center justify-between px-3 py-4`}
            >
              <View className="flex-1 flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                  <Ionicons
                    name={isDarkMode ? "moon" : "sunny"}
                    size={20}
                    color={iconPrimary}
                  />
                </View>
                <View>
                  <Text className={`text-sm font-semibold ${textColor}`}>
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </Text>
                  <Text className={`text-xs mt-0.5 ${secondaryTextColor}`}>
                    {isDarkMode ? "Easy on the eyes" : "Bright and clear"}
                  </Text>
                </View>
              </View>

              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#D1D5DB", true: "#4B5563" }}
                thumbColor={isDarkMode ? "#60A5FA" : "#FFA500"}
              />
            </View>

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
              borderColor: isDarkMode ? "#212121" : "#f7f7f7",
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

            {/* Build Info */}
            {/* <View className={`flex-row items-center px-3 py-4`}>
              <View className="flex-1 flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                  <Ionicons name="code-working" size={20} color="#6366F1" />
                </View>
                <View className="flex-1">
                  <Text className={`text-sm font-semibold ${textColor}`}>
                    Platform
                  </Text>
                  <Text className={`text-xs mt-0.5 ${secondaryTextColor}`}>
                    React Native + Expo
                  </Text>
                </View>
              </View>
            </View> */}
          </View>
        </View>

        {/* Footer */}
        <View className="px-3 py-2">
          <View className="flex-row w-full gap-1 items-center justify-center mx-auto">
            <Text className={`text-xs text-center ${secondaryTextColor}`}>
              Made by
            </Text>
            <Image source={require("../assets/images/dlp-logo.png")} className="w-10 h-full" />
            <Text 
              className={`text-xs text-center ${secondaryTextColor}`}
              onPress={() => Linking.openURL('https://www.dlp.africa')}            
              style={{ textDecorationLine: 'underline' }}
            >
              dlp africa
            </Text>
          </View>
          <Text className={`text-xs text-center mt-1 ${secondaryTextColor}`}>
            © 2024-2026 All rights reserved
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
