import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsOfUse() {
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
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Terms of Use
        </Text>
      </View>
      <ScrollView
        className="px-4 pt-4"
        style={{ backgroundColor: isDarkMode ? "#030712" : "#FFFFFF" }}
      >
        <Text
          className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Terms of Use
        </Text>
        <Text
          className={`text-base leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          By accessing the Kasa application, you are agreeing to be bound by
          these terms of service, all applicable laws and regulations, and agree
          that you are responsible for compliance with any applicable local
          laws.
        </Text>
        <Text
          className={`text-lg font-bold mt-3 mb-1.5 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          1. Use License
        </Text>
        <Text
          className={`text-base leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          Permission is granted to temporarily download one copy of the
          materials (information or software) on Kasa&apos;s application for
          personal, non-commercial transitory viewing only.
        </Text>
        <Text
          className={`text-lg font-bold mt-3 mb-1.5 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          2. Disclaimer
        </Text>
        <Text
          className={`text-base leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          The materials on Kasa&apos;s application are provided on an &apos;as
          is&apos; basis. Kasa makes no warranties, expressed or implied, and
          hereby disclaims and negates all other warranties including, without
          limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual
          property or other violation of rights.
        </Text>
        <Text
          className={`text-lg font-bold mt-3 mb-1.5 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          3. Limitations
        </Text>
        <Text
          className={`text-base pb-8 leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
        >
          In no event shall Kasa or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or
          due to business interruption) arising out of the use or inability to
          use the materials on Kasa&apos;s application, even if Kasa or a Kasa
          authorized representative has been notified orally or in writing of
          the possibility of such damage.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
