import Header from "@/components/Header";
import LogCard, { CallLogItem } from "@/components/LogCard";
import { ScrollGradientOverlay } from "@/components/ScrollGradientOverlay";
import { useTheme } from "@/context/ThemeContext";
import { getThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";

export default function LogsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  const primaryTextColor = isDarkMode ? "#F9FAFB" : "#111827";
  const secondaryTextColor = isDarkMode ? "#9CA3AF" : "#6B7280";

  const handleSettings = () => {
    router.push("/settings");
  };

  const logs: CallLogItem[] = [
    {
      id: "1",
      contact: "+233 24 123 4567",
      duration: "03:18",
      date: "March 27, 2025, 09:41 AM",
      campaign: "Kasa Free Call",
      type: "Ad",
      status: "completed",
    },
    {
      id: "2",
      contact: "+233 55 987 1234",
      duration: "00:42",
      date: "March 27, 2025, 07:02 AM",
      campaign: "Survey Call",
      type: "Survey",
      status: "missed",
    },
    {
      id: "3",
      contact: "+233 20 100 2000",
      duration: "12:09",
      date: "March 26, 2025, 08:14 PM",
      campaign: "Kasa Free Call",
      type: "Ad",
      status: "completed",
    },
    {
      id: "4",
      contact: "+233 30 555 8899",
      duration: "05:42",
      date: "March 26, 2025, 03:30 PM",
      campaign: "Survey Call",
      type: "Survey",
      status: "completed",
    },
    {
      id: "5",
      contact: "+233 50 222 3344",
      duration: "01:15",
      date: "March 25, 2025, 10:22 AM",
      campaign: "Kasa Free Call",
      type: "Ad",
      status: "missed",
    },
    {
      id: "6",
      contact: "+233 24 999 5555",
      duration: "08:33",
      date: "March 25, 2025, 09:05 AM",
      campaign: "Survey Call",
      type: "Survey",
      status: "completed",
    },
    {
      id: "7",
      contact: "+233 40 444 1111",
      duration: "02:47",
      date: "March 24, 2025, 06:18 PM",
      campaign: "Kasa Free Call",
      type: "Ad",
      status: "completed",
    },
    {
      id: "8",
      contact: "+233 55 666 7777",
      duration: "00:28",
      date: "March 24, 2025, 02:45 PM",
      campaign: "Survey Call",
      type: "Survey",
      status: "missed",
    },
  ];

  const renderLogItem: ListRenderItem<CallLogItem> = ({ item, index }) => (
    <LogCard log={item} index={index} isDarkMode={isDarkMode} />
  );

  const listHeader = (
    <View className="mb-8">
      <Text style={{ color: primaryTextColor }} className="">
        Check out your call history
      </Text>
      <Text
        style={{ color: secondaryTextColor }}
        className="mt-3 text-sm font-medium"
      >
        Total calls recorded:{" "}
        <Text style={{ color: primaryTextColor }} className="font-semibold">
          {logs.length}
        </Text>
      </Text>
    </View>
  );

  return (
    <View className={`flex-1 ${colors.bg}`}>
      <Header
        title="Call Logs"
        showLogo={false}
        onPressSettings={handleSettings}
      />

      <View style={{ position: "relative", flex: 1 }}>
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderLogItem}
          ListHeaderComponent={listHeader}
          className={`flex-1 ${colors.bg}`}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 18,
            paddingBottom: 80,
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
        <ScrollGradientOverlay height={80} />
      </View>
    </View>
  );
}
