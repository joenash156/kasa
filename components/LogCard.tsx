import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export type CallLogItem = {
  id: string;
  contact: string;
  duration: string;
  date: string;
  campaign: string;
  type: "Ad" | "Survey";
  status: "completed" | "missed";
};

type LogCardProps = {
  log: CallLogItem;
  index: number;
  isDarkMode: boolean;
};

export default function LogCard({ log, index, isDarkMode }: LogCardProps) {
  const isMissed = log.status === "missed";
  const isAd = log.type === "Ad";

  const primaryTextColor = isDarkMode ? "#F9FAFB" : "#111827";
  const secondaryTextColor = isDarkMode ? "#9CA3AF" : "#6B7280";
  const cardBgColor = isDarkMode ? "#111827" : "#fcfcfc";
  const cardBorderColor = isDarkMode ? "#191f29" : "#f2f3f5";

  return (
    <Animated.View entering={FadeInDown.delay(100 + index * 40).duration(280)}>
      <TouchableOpacity
        activeOpacity={0.75}
        className="rounded-xl px-4 py-4"
        style={{
          backgroundColor: cardBgColor,
          borderWidth: 1,
          borderColor: cardBorderColor,
        }}
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-row items-start gap-3 flex-1">
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: isMissed ? "#FEE2E2" : "#D1FAE5",
              }}
            >
              <Ionicons
                name={isMissed ? "call-outline" : "call"}
                size={18}
                color={isMissed ? "#DC2626" : "#059669"}
              />
            </View>

            <View className="flex-1">
              <Text style={{ color: primaryTextColor }} className="font-semibold">
                {log.contact}
              </Text>

              <View className="flex-row gap-2 mt-1.5 flex-wrap">
                <Text style={{ color: secondaryTextColor }} className="text-xs">
                  {log.campaign}
                </Text>
                <Text
                  style={{
                    color: isAd ? "#EA580C" : "#3B82F6",
                    fontWeight: "600",
                  }}
                  className="text-xs"
                >
                  • {log.type}
                </Text>
              </View>

              <Text style={{ color: secondaryTextColor }} className="text-xs mt-1.5">
                {log.date}
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text
              style={{
                color: isMissed ? "#DC2626" : primaryTextColor,
                fontWeight: "600",
              }}
              className="text-sm"
            >
              {log.duration}
            </Text>
            <Text
              style={{
                color: isMissed ? "#DC2626" : "#059669",
                fontWeight: "500",
              }}
              className="text-xs mt-1.5"
            >
              {isMissed ? "Missed" : "Completed"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
