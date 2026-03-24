import Header from "@/components/Header";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const { width } = useWindowDimensions();
  const [yourNumber, setYourNumber] = useState("");
  const [friendNumber, setFriendNumber] = useState("");
  const mascotBounce = useSharedValue(0);

  const handleYourNumber = (text: string) => {
    setYourNumber(text.replace(/[^0-9]/g, ""));
  };

  const handleFriendNumber = (text: string) => {
    setFriendNumber(text.replace(/[^0-9]/g, ""));
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

  return (
    <>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        className="flex-1 bg-gray-50"
      >
        <ScrollView
          className="flex-1 bg-gray-50"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        >
          <View className="flex-1">
            <ImageBackground
              source={require("../assets/images/kasa-bg.png")}
              resizeMode="cover"
              className="px-2 py-8"
            >
              <Animated.View entering={FadeInDown.duration(320)}>
                <Animated.Image
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
                />
                <View className="flex-row items-center gap-3 px-4 py-2 border border-orange-200 rounded-xl bg-orange-100 shadow-sm">
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-orange-100">
                    <FontAwesome name="thumbs-o-up" size={18} color="#EA580C" />
                  </View>
                  <Text className="flex-1 text-sm font-semibold text-orange-900">
                    No signup needed! Listen to a short ad and make free calls
                    instantly.
                  </Text>
                </View>
              </Animated.View>
            </ImageBackground>

            <Animated.View
              entering={FadeInDown.duration(360).delay(50)}
              className="bg-white mx-2 mt-3"
            >
              <View className="bg-gray-50/90 py-3">
                <Text className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                  Enter both numbers. We call you, play a quick ad, then connect
                  you.
                </Text>
              </View>

              <View className="py-2 bg-gray-50">
                <View className="flex-row items-center gap-3 py-2">
                  <View
                    className="h-9 w-9 items-center justify-center bg-orange-100"
                    style={{ borderRadius: 20 }}
                  >
                    <Feather name="phone" size={16} color="#EA580C" />
                  </View>
                  <View className="h-8 w-px bg-gray-200" />
                  <Text className="text-lg font-semibold text-gray-800">
                    +233
                  </Text>
                  <TextInput
                    placeholder="Your number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    className="ml-2 flex-1 font-semibold text-gray-800"
                    style={{ fontSize: 16 }}
                    value={yourNumber}
                    onChangeText={handleYourNumber}
                    maxLength={9}
                  />
                </View>

                <View className="mx-2 h-px bg-gray-200" />

                <View className="flex-row items-center gap-3 py-2">
                  <View
                    className="h-9 w-9 items-center justify-center bg-orange-100"
                    style={{ borderRadius: 20 }}
                  >
                    <Feather name="user" size={16} color="#EA580C" />
                  </View>
                  <View className="h-8 w-px bg-gray-200" />
                  <Text className="text-lg font-semibold text-gray-800">
                    +233
                  </Text>
                  <TextInput
                    placeholder="Friend's number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    className="ml-2 flex-1 font-semibold text-gray-800"
                    style={{ fontSize: 16 }}
                    value={friendNumber}
                    onChangeText={handleFriendNumber}
                    maxLength={9}
                  />
                </View>
              </View>

              <View className="pb-3 bg-gray-50">
                <TouchableOpacity
                  disabled={!canCall}
                  activeOpacity={0.9}
                  className={`w-full flex-row items-center justify-center gap-2 rounded-xl py-3.5 ${canCall ? "bg-teal-600" : "bg-gray-200"}`}
                >
                  <Ionicons
                    name="call"
                    size={18}
                    color={canCall ? "white" : "#9CA3AF"}
                  />
                  <Text
                    className={`font-bold ${canCall ? "text-white" : "text-gray-500"}`}
                  >
                    Start Free Call
                  </Text>
                </TouchableOpacity>

                <Text className="mt-3 text-xs font-medium text-gray-600 text-center">
                  🇬🇭 Ghana only
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.duration(360).delay(110)}
              className="mt-7 px-2"
            >
              <Text className="text-sm text-gray-600 text-center">
                Do you want to keep your call logs?{" "}
                <Link href="/(auth)/login" asChild>
                  <Text className="font-bold text-orange-600 underline">
                    Login
                  </Text>
                </Link>
              </Text>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
