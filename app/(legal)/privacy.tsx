import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicy() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDarkMode ? "#030712" : "#FFFFFF" }}
    >
      <View
        className={`flex-row items-center px-3 py-3 ${isDarkMode ? "bg-gray-950" : "bg-white"}`}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="h-10 w-10 mr-6 items-center justify-center"
        >
          <Ionicons
            name="chevron-back"
            size={26}
            color={isDarkMode ? "#fff" : "#1F2937"}
          />
        </TouchableOpacity>
        <Text
          className={`text-2xl font-bold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          Privacy Policy
        </Text>
      </View>
      <ScrollView
        className="px-4 pt-4"
        style={{ backgroundColor: isDarkMode ? "#030712" : "#FFFFFF" }}
      >
        <Text
          className={`text-xl font-bold mb-3 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          Privacy Policy
        </Text>
        <Text
          className={`text-base leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          Your privacy is important to us. It is Kasa&apos;s policy to respect
          your privacy regarding any information we may collect from you across
          our website, and other sites we own and operate.
        </Text>
        <Text
          className={`text-lg font-bold mt-3 mb-1.5 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          1. Information we collect
        </Text>
        <Text
          className={`text-base leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          Log data: When you visit our website, our servers may automatically
          log the standard data provided by your web browser. It may include
          your computer&apos;s Internet Protocol (IP) address, your browser type
          and version, the pages you visit, the time and date of your visit, the
          time spent on each page, and other details.
        </Text>
        <Text
          className={`text-base leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          Device data: We may also collect data about the device you’re using to
          access our website. This data may include the device type, operating
          system, unique device identifiers, device settings, and geo-location
          data. What we collect can depend on the individual settings of your
          device and software. We recommend checking the policies of your device
          manufacturer or software provider to learn what information they make
          available to us.
        </Text>
        <Text
          className={`text-lg font-bold mt-3 mb-1.5 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          2. Legal bases for processing
        </Text>
        <Text
          className={`text-base leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          We will process your personal information lawfully, fairly and in a
          transparent manner. We collect and process information about you only
          where we have legal bases for doing so.
        </Text>
        <Text
          className={`text-lg font-bold mt-3 mb-1.5 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          3. Security of your personal information
        </Text>
        <Text
          className={`text-base pb-8 leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          We will protect personal information by reasonable security safeguards
          against loss or theft, as well as unauthorized access, disclosure,
          copying, use or modification.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
