import { useTheme } from "@/context/ThemeContext";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";

export interface AlertConfig {
  visible: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
  onDismiss?: () => void;
  buttonText?: string;
}

interface AlertModalProps extends AlertConfig {
  onDismiss: () => void;
}

export default function AlertModal({
  visible,
  title,
  message,
  type = "info",
  onDismiss,
  buttonText = "OK",
}: AlertModalProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const bgColor = isDarkMode ? "#111827" : "#FFFFFF";
  const textPrimary = isDarkMode ? "#F9FAFB" : "#111827";
  const textSecondary = isDarkMode ? "#D1D5DB" : "#4B5563";

  // Determine alert color based on type
  let alertColor = "#3B82F6";
  if (type === "success") {
    alertColor = "#10B981";
  } else if (type === "error") {
    alertColor = "#EF4444";
  }

  const handleDismiss = () => {
    onDismiss();
  };

  const BlurContainer = Platform.OS === "ios" ? BlurView : View;
  const blurProps = Platform.OS === "ios" ? { intensity: 40 } : {};

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <BlurContainer
        className="flex-1 justify-center items-center bg-black/10 dark:bg-black/40"
        {...blurProps}
      >
        <View className="flex-1 justify-center items-center w-full">
          <View
            className="rounded-xl px-6 py-8 mx-3 max-w-[320px] w-full shadow-lg dark:shadow-black/40"
            style={{ backgroundColor: bgColor }}
          >
            {/* Alert Indicator */}
            <View
              className="w-1 h-10 rounded mb-4"
              style={{ backgroundColor: alertColor }}
            />

            {/* Title */}
            <Text
              className="text-lg font-bold mb-2 text-center"
              style={{ color: textPrimary }}
            >
              {title}
            </Text>

            {/* Message */}
            <Text
              className="text-sm leading-5 mb-6 text-center"
              style={{ color: textSecondary }}
            >
              {message}
            </Text>

            {/* Button */}
            <TouchableOpacity
              className="py-3 px-6 rounded-lg items-center justify-center"
              style={{ backgroundColor: alertColor }}
              onPress={handleDismiss}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurContainer>
    </Modal>
  );
}
