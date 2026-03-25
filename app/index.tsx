import Header from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";
import { getThemeColors } from "@/theme/colors";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const [yourNumber, setYourNumber] = useState("");
  const [friendNumber, setFriendNumber] = useState("");
  const mascotBounce = useSharedValue(0);

  // Theme-responsive colors
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  const {
    bg: bgColor,
    card: cardBg,
    text: textColor,
    textSecondary: secondaryTextColor,
    //border: borderColor,
    bannerBg,
  } = colors;

  const handleYourNumber = (text: string) => {
    setYourNumber(text.replace(/[^0-9]/g, ""));
  };

  const handleFriendNumber = (text: string) => {
    setFriendNumber(text.replace(/[^0-9]/g, ""));
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const canCall = yourNumber.length >= 9 && friendNumber.length >= 9;
  const mascotWidth = Math.max(120, Math.min(width * 0.42, 190));
  const mascotHeight = mascotWidth * 1.42;

  useEffect(() => {
    mascotBounce.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [mascotBounce]);

  const mascotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(mascotBounce.value, [0, 1], [0, -8]) },
    ],
  }));

  const { height } = Dimensions.get("window");
  const heroHeight = height * 0.45;

  return (
    <>
      <Header onPressSettings={handleSettings} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        className={`flex-1 ${bgColor}`}
      >
        <ScrollView
          className={`flex-1 ${bgColor}`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        >
          <View className="flex-1">
            {/* Hero Section with Mascot */}
            <View style={{ height: heroHeight }} className="px-2 py-8">
              <ImageBackground
                source={require("../assets/images/person1.png")}
                resizeMode="cover"
                style={StyleSheet.absoluteFill}
              />

              {/* Blur overlay (absolute) */}
              <BlurView
                blurReductionFactor={4}
                experimentalBlurMethod={
                  Platform.OS === "android" ? "dimezisBlurView" : "none"
                }
                intensity={Platform.OS === "ios" ? 60 : 8}
                tint={isDarkMode ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />

              {/* Foreground content (not blurred) */}
              <Animated.View
                entering={FadeInDown.duration(320)}
                style={styles.heroForeground}
              >
                {/* <Animated.Image
                  source={require("../assets/images/kasamascotphone.png")}
                  style={[
                    {
                      width: mascotWidth,
                      height: mascotHeight,
                      alignSelf: "center",
                    },
                    mascotAnimatedStyle,
                  ]}
                  resizeMode="contain"
                /> */}

                {/* Pro Feature Banner (bottom-aligned with small bottom gap) */}
                <View
                  className={`flex-row items-center gap-3 px-4 py-2 rounded-xl ${bannerBg} ${isDarkMode ? "bg-gray-800" : "bg-orange-50"}`}
                  style={styles.heroBanner}
                >
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-orange-100">
                    <FontAwesome name="thumbs-o-up" size={16} color="#EA580C" />
                  </View>
                  <Text className={`flex-1 text-sm font-semibold ${textColor}`}>
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
                className={` px-4 py-3.5 bg-gradient-to-r ${isDarkMode ? "from-gray-900 to-gray-950" : "from-gray-50 to-gray-100"}`}
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
                className={`py-4 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
              >
                {/* Your Number Input */}
                <View className={`flex-row items-center gap-3 px-4 py-3.5`}>
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    <Feather name="phone" size={16} color="#EA580C" />
                  </View>
                  <View className={`h-8 w-px ${isDarkMode ? "bg-gray-700/50" : "bg-gray-200"}`} />
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
                  />
                </View>

                {/* Divider */}
                <View
                  className={`mx-4 h-px ${isDarkMode ? "bg-gray-700/50" : "bg-gray-200/70"}`}
                />

                {/* Friend Number Input */}
                <View className={`flex-row items-center gap-3 px-4 py-3.5`}>
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    <Feather name="user" size={16} color="#EA580C" />
                  </View>
                  <View className={`h-8 w-px ${isDarkMode ? "bg-gray-700/50" : "bg-gray-200"}`} />
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
                className={`px-4 py-4  ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}
              >
                <TouchableOpacity
                  disabled={!canCall}
                  activeOpacity={0.8}
                  className={`w-full flex-row items-center justify-center gap-2 rounded-xl py-3.5 ${
                    canCall ? "bg-orange-600" : `${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`
                  }`}
                >
                  <Ionicons
                    name="call"
                    size={18}
                    color={canCall ? "white" : "#9CA3AF"}
                  />
                  <Text
                    className={`font-bold text-base ${
                      canCall ? "text-white" : `${isDarkMode ? "text-gray-400" : "text-gray-600"}`
                    }`}
                  >
                    Start Free Call
                  </Text>
                </TouchableOpacity>

                <Text
                  className={`mt-3 text-xs font-medium text-center ${secondaryTextColor}`}
                >
                  🇬🇭 Ghana only
                </Text>
              </View>
            </Animated.View>

            {/* Login Prompt */}
            <Animated.View
              entering={FadeInDown.duration(360).delay(110)}
              className="mt-6 px-4"
            >
              <View
                className={`px-4 pb-5`}
              >
                <Text className={`text-sm text-center ${secondaryTextColor}`}>
                  Do you want to keep your call logs?{" "}
                  <Link href="/(auth)/login" asChild>
                    <Text className="font-semibold text-orange-600">Login</Text>
                  </Link>
                </Text>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  heroForeground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  heroBanner: {
    marginBottom: 1,
  },
});
