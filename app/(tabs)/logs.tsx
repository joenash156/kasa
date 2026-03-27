import Header from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";
import { getThemeColors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function LogsScreen() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  const logs = [
    {
      id: "1",
      contact: "+233 24 123 4567",
      duration: "03:18",
      time: "Today, 09:41 AM",
      status: "completed",
    },
    {
      id: "2",
      contact: "+233 55 987 1234",
      duration: "00:42",
      time: "Today, 07:02 AM",
      status: "missed",
    },
    {
      id: "3",
      contact: "+233 20 100 2000",
      duration: "12:09",
      time: "Yesterday, 08:14 PM",
      status: "completed",
    },
  ];

  return (
    <View className={`flex-1 ${colors.bg}`}>
      <Header title="Call Logs" showLogo={false} />

      <ScrollView
        className={`flex-1 ${colors.bg}`}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 18 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-2 mb-4 rounded-2xl bg-orange-50 px-4 py-3">
          <Text className="text-xs font-semibold uppercase tracking-wide text-orange-700">
            Recent activity
          </Text>
          <Text className="mt-1 text-sm text-orange-700">
            Your latest calls are shown here. Tap an entry to view details.
          </Text>
        </View>

        <View className="gap-3">
          {logs.map((log) => {
            const isMissed = log.status === "missed";
            return (
              <View
                key={log.id}
                className={`${colors.card} rounded-2xl px-4 py-3`}
                style={{
                  borderWidth: 1,
                  borderColor: isDarkMode ? "#212121" : "#f3f4f6",
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View
                      className={`h-10 w-10 items-center justify-center rounded-full ${isMissed ? "bg-red-100" : "bg-emerald-100"}`}
                    >
                      <Ionicons
                        name={isMissed ? "call-outline" : "call"}
                        size={16}
                        color={isMissed ? "#DC2626" : "#059669"}
                      />
                    </View>
                    <View>
                      <Text className={`text-sm font-semibold ${colors.text}`}>
                        {log.contact}
                      </Text>
                      <Text className={`text-xs mt-0.5 ${colors.textSecondary}`}>
                        {log.time}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className={`text-sm font-semibold ${isMissed ? "text-red-500" : "text-emerald-600"}`}
                  >
                    {log.duration}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
