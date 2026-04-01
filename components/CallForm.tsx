import { useTheme } from "@/context/ThemeContext";
import { getThemeColors } from "@/theme/colors";
import AlertModal, { AlertConfig } from "@/components/AlertModal";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Link } from "expo-router";
import * as callService from "@/services/call.service";
import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ScrollGradientOverlay } from "./ScrollGradientOverlay";

interface CallFormProps {
  initialYourNumber?: string;
  isLoggedIn?: boolean;
  showLoginPrompt?: boolean;
  showHeader?: boolean;
  onPressSettings?: () => void;
  headerComponent?: React.ReactNode;
}

export default function CallForm({
  initialYourNumber = "",
  isLoggedIn = false,
  showLoginPrompt = true,
  showHeader = true,
  onPressSettings,
  headerComponent,
}: CallFormProps) {
  const { theme } = useTheme();
  const [yourNumber, setYourNumber] = useState(initialYourNumber);
  const [friendNumber, setFriendNumber] = useState("");
  const [isDialing, setIsDialing] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  const {
    bg: bgColor,
    card: cardBg,
    text: textColor,
    textSecondary: secondaryTextColor,
    bannerBg,
  } = colors;

  const handleYourNumber = (text: string) => {
    setYourNumber(text.replace(/[^0-9]/g, ""));
  };

  const handleFriendNumber = (text: string) => {
    setFriendNumber(text.replace(/[^0-9]/g, ""));
  };

  const canCall = yourNumber.length >= 9 && friendNumber.length >= 9;

  const { height } = Dimensions.get("window");
  const heroHeight = height * 0.45;

  const handleAlertDismiss = () => {
    setAlertConfig({ visible: false, title: "", message: "", type: "info" });
  };

  const handleDial = async () => {
    if (!canCall || isDialing) return;

    if (!isLoggedIn) {
      setAlertConfig({
        visible: true,
        title: "Login required",
        message:
          "To place a call, please login so we can call you back and connect you to your destination number.",
        type: "info",
      });
      return;
    }

    setIsDialing(true);
    try {
      const response = await callService.dial(friendNumber);
      const success = Boolean(response?.data?.success);
      const message =
        response?.data?.message ||
        response?.message ||
        (success ? "Callback initiated successfully." : "Could not initiate call.");

      setAlertConfig({
        visible: true,
        title: success ? "Calling…" : "Call not started",
        message,
        type: success ? "success" : "error",
      });
    } catch (err: any) {
      setAlertConfig({
        visible: true,
        title: "Call failed",
        message:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Unable to initiate the call. Please try again.",
        type: "error",
      });
    } finally {
      setIsDialing(false);
    }
  };

  return (
    <>
      {showHeader && headerComponent}
      <AlertModal {...alertConfig} onDismiss={handleAlertDismiss} />
      <View className={`flex-1 ${bgColor}`} style={{ position: "relative" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 105 : 0}
          className={`flex-1 ${bgColor}`}
        >
          <ScrollView
            className={`flex-1 ${bgColor}`}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
          >
            <View className="flex-1">
              {/* Hero Section */}
              <View style={{ height: heroHeight }} className="px-2 py-8">
                <ImageBackground
                  source={require("../assets/images/person1.png")}
                  resizeMode="cover"
                  style={StyleSheet.absoluteFill}
                />

                {Platform.OS === "ios" ? (
                  <BlurView
                    blurReductionFactor={4}
                    experimentalBlurMethod="none"
                    intensity={8}
                    tint={isDarkMode ? "dark" : "light"}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                  />
                ) : (
                  <View
                    pointerEvents="none"
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(3, 7, 18, 0.45)"
                          : "rgba(133, 133, 133, 0.35)",
                      },
                    ]}
                  />
                )}

                {/* Foreground content (not blurred) */}
                <Animated.View
                  entering={FadeInDown.duration(320)}
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingBottom: 16,
                  }}
                >
                  {/* Pro Feature Banner */}
                  <View
                    className={`flex-row items-center gap-3 px-4 py-2 rounded-xl ${bannerBg} ${isDarkMode ? "bg-gray-800" : "bg-orange-50"}`}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 8,
                      right: 8,
                      marginHorizontal: 8,
                    }}
                  >
                    <View className="h-9 w-9 items-center justify-center rounded-full bg-orange-100">
                      <FontAwesome
                        name="thumbs-o-up"
                        size={16}
                        color="#EA580C"
                      />
                    </View>
                    <Text className={`flex-1 text-xs  ${textColor}`}>
                      No signup needed! Listen to a short ad and make free calls
                      instantly.
                    </Text>
                  </View>
                </Animated.View>
              </View>

              {/* Form Section */}
              <Animated.View
                entering={FadeInDown.duration(360).delay(50)}
                className={`${cardBg} mx-2 mt-6 rounded-2xl overflow-hidden`}
                style={{
                  shadowColor: isDarkMode ? "#212121" : "#ededed",
                  shadowOffset: { width: 0, height: 0.3 },
                  shadowOpacity: 0.1,
                  shadowRadius: 1,
                  elevation: 3,
                }}
              >
                {/* Form Header */}
                <View
                  className={`px-3 py-3.5 bg-gradient-to-r ${isDarkMode ? "from-gray-900 to-gray-950" : "from-gray-50 to-gray-100"}`}
                >
                  <View className="flex-row items-center gap-2">
                    <Ionicons
                      name="call-outline"
                      size={16}
                      color={colors.iconPrimary}
                    />
                    <Text
                      className={`text-xs font-semibold uppercase tracking-wider ${secondaryTextColor}`}
                    >
                      Enter both numbers to make free calls
                    </Text>
                  </View>
                </View>

                <View
                  className={`px-2 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
                >
                  {/* Your Number Input */}
                  <View className={`flex-row items-center gap-3 px-2 py-3.5`}>
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                      <Feather name="phone" size={16} color="#EA580C" />
                    </View>
                    <View
                      className={`h-8 w-px ${isDarkMode ? "bg-gray-700/50" : "bg-gray-200"}`}
                    />
                    <Text
                      className={`text-lg font-semibold ${colors.inputText}`}
                    >
                      +233
                    </Text>
                    <TextInput
                      placeholder="Your number"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                      className={`ml-2 flex-1 font-semibold ${colors.inputText}`}
                      style={{ fontSize: 16 }}
                      value={yourNumber}
                      onChangeText={handleYourNumber}
                      maxLength={9}
                      editable={true}
                    />
                  </View>

                  {/* Divider */}
                  <View
                    className={`mx-4 h-px ${isDarkMode ? "bg-gray-700/50" : "bg-gray-200/70"}`}
                  />

                  {/* Friend Number Input */}
                  <View className={`flex-row items-center gap-3 px-2 py-3.5`}>
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                      <Feather name="user" size={16} color="#EA580C" />
                    </View>
                    <View
                      className={`h-8 w-px ${isDarkMode ? "bg-gray-700/50" : "bg-gray-200"}`}
                    />
                    <Text
                      className={`text-lg font-semibold ${colors.inputText}`}
                    >
                      +233
                    </Text>
                    <TextInput
                      placeholder="Friend's number"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                      className={`ml-2 flex-1 font-semibold ${colors.inputText}`}
                      style={{ fontSize: 16 }}
                      value={friendNumber}
                      onChangeText={handleFriendNumber}
                      maxLength={9}
                    />
                  </View>
                </View>

                {/* Call Button & Footer */}
                <View
                  className={`px-1 py-4  ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}
                >
                  <TouchableOpacity
                    disabled={!canCall || isDialing}
                    activeOpacity={0.8}
                    onPress={handleDial}
                    className={`w-full flex-row items-center justify-center gap-2 rounded-xl py-3 ${
                      canCall
                        ? "bg-orange-600"
                        : `${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`
                    }`}
                  >
                    <Ionicons
                      name="call"
                      size={18}
                      color={canCall ? "white" : "#9CA3AF"}
                    />
                    <Text
                      className={`font-bold text-base ${
                        canCall
                          ? "text-white"
                          : `${isDarkMode ? "text-gray-400" : "text-gray-500"}`
                      }`}
                    >
                      {isDialing ? "Starting…" : "Start Free Call"}
                    </Text>
                  </TouchableOpacity>

                  <Text
                    className={`mt-3 text-xs font-medium text-center ${secondaryTextColor}`}
                  >
                    🇬🇭 Ghana only
                  </Text>
                </View>
              </Animated.View>

              {/* Login Prompt - Only show if not logged in and showLoginPrompt is true */}
              {!isLoggedIn && showLoginPrompt && (
                <Animated.View
                  entering={FadeInDown.duration(360).delay(110)}
                  className="mt-6 px-4"
                >
                  <View className={`px-4 pb-5`}>
                    <Text
                      className={`text-sm text-center ${secondaryTextColor}`}
                    >
                      Do you want to keep your call logs?{" "}
                      <Link href="/(auth)/login" asChild>
                        <Text className="font-semibold text-orange-600">
                          Login
                        </Text>
                      </Link>
                    </Text>
                  </View>
                </Animated.View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <ScrollGradientOverlay height={80} />
      </View>
    </>
  );
}
