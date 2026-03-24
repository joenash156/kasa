import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import {} from "expo-image";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

type AppHeaderProps = {
  onPressSettings?: () => void;
};

export default function Header({ onPressSettings }: AppHeaderProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const borderColor = isDarkMode ? "border-gray-800" : "border-gray-50";
  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";

  return (
    <View
      className={`px-4 py-3 border-b ${borderColor} ${bgColor}`}
      style={{
        borderWidth: 0.3,
        borderColor: isDarkMode
          ? "rgba(55, 65, 81, 0.6)"
          : "rgba(220, 220, 220, 0.99)",
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="">
          <Image
            source={require("../assets/images/logo.png")}
            className="h-8 w-24"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressSettings}
          className="h-10 w-10 items-center justify-center"
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={isDarkMode ? "#D1D5DB" : "#4B5563"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
