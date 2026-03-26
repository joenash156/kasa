import { useTheme } from "@/context/ThemeContext";
import { Feather } from "@expo/vector-icons";
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

  // const { height, width } = Dimensions.get("window");

  return (
    <View
      className={`pr-3 py-3 ${bgColor}`}
      // style={{
      //   borderBottomWidth: 0.3,
      //   borderColor
      // }}
    >
      <View className="flex-row items-center justify-between">
        <View className="w-28 h-10 items-center justify-center">
          <Image
            source={require("../assets/images/kasa-logo.png")}
            className="w-28 h-10 object-contain"
          />
        </View>

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
      </View>
    </View>
  );
}
