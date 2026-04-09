import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DataCompliance() {
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
          Data & Compliance
        </Text>
      </View>
      <ScrollView
        className="px-4 pt-4"
        style={{ backgroundColor: isDarkMode ? "#030712" : "#FFFFFF" }}
      >
        <Text
          className={`text-xl font-bold mb-3 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          Data & Compliance
        </Text>
        <Text
          className={`text-base leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          Kasa is committed to ensuring the security and protection of the
          personal information that we process, and to provide a compliant and
          consistent approach to data protection.
        </Text>
        <Text
          className={`text-lg font-bold mt-3 mb-1.5 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          1. GDPR
        </Text>
        <Text
          className={`text-base leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          Kasa is compliant with the General Data Protection Regulation (GDPR).
          We are committed to our users&apos; rights to privacy and data
          protection.
        </Text>
        <Text
          className={`text-lg font-bold mt-3 mb-1.5 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          2. Data Security
        </Text>
        <Text
          className={`text-base leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          We have implemented appropriate technical and organizational security
          measures designed to protect the security of any personal information
          we process.
        </Text>
        <Text
          className={`text-lg font-bold mt-3 mb-1.5 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          3. Data Retention
        </Text>
        <Text
          className={`text-base pb-8 leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          We will only retain your personal information for as long as necessary
          to fulfill the purposes we collected it for, including for the
          purposes of satisfying any legal, accounting, or reporting
          requirements.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
