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
  // const borderColor = isDarkMode ? "border-gray-800" : "gray";
  const bgColor = isDarkMode ? "bg-gray-950" : "bg-white";

  return (
    <View
      className={`px-4 py-3 ${bgColor}`}
      // style={{
      //   borderBottomWidth: 0.3,
      //   borderColor
      // }}
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
