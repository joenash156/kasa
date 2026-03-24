import { Ionicons } from "@expo/vector-icons";
import { } from "expo-image";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors";
type AppHeaderProps = {
  onPressSettings?: () => void;
};

export default function Header({ onPressSettings }: AppHeaderProps) {
  return (
    <View
      className="px-2 py-3"
      style={{
        borderWidth: 0.3,
        borderColor: "rgba(220, 220, 220, 0.99)"
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="">
          <Image
            source={require('../assets/images/logo.png')}
            className="h-8 w-24"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressSettings}
          className="h-10 w-10 items-center justify-center"
        >
          <Ionicons name="settings-outline" size={22} color="#4B5563" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
