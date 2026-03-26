import { useTheme } from "@/context/ThemeContext";
import { getThemeColors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);

  return (
    <View className={`flex-1 items-center justify-center ${colors.bg}`}>
      <Ionicons
        name="person"
        size={64}
        color={isDarkMode ? "#6B7280" : "#D1D5DB"}
      />
      <Text className={`text-lg font-semibold mt-4 ${colors.text}`}>
        Profile
      </Text>
      <Text className={`text-sm mt-2 ${colors.textSecondary}`}>
        Coming Soon
      </Text>
    </View>
  );
}
