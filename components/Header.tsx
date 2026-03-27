import { useTheme } from "@/context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type AppHeaderProps = {
  onPressSettings?: () => void;
  title?: string;
  showLogo?: boolean;
  showMenu?: boolean;
};

export default function Header({
  onPressSettings,
  title,
  showLogo = true,
  showMenu = true,
}: AppHeaderProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-gray-950" : "bg-white";
  const titleColor = isDarkMode ? "#FFFFFF" : "#111827";

  return (
    <View className={`pr-3 py-3 ${bgColor}`}>
      <View className="flex-row items-center justify-between">
        {showLogo ? (
          <View className="w-28 h-10 items-center justify-center">
            <Image
              source={require("../assets/images/kasa-logo.png")}
              className="w-28 h-10 object-contain"
            />
          </View>
        ) : (
          <View className="h-10 justify-center px-3">
            <Text style={{ color: titleColor }} className="text-2xl font-bold">
              {title ?? "Kasa"}
            </Text>
          </View>
        )}

        {showMenu ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressSettings}
            className="h-10 w-12 items-center justify-center"
          >
            <Feather
              name="menu"
              size={26}
              color={isDarkMode ? "#ffffff" : "#4B5563"}
            />
          </TouchableOpacity>
        ) : (
          <View className="h-10 w-12" />
        )}
      </View>
    </View>
  );
}
