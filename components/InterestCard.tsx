import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export type InterestItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type InterestCardProps = {
  item: InterestItem;
  selected: boolean;
  isDarkMode: boolean;
  onToggle: (id: string) => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function InterestCard({
  item,
  selected,
  isDarkMode,
  onToggle,
}: InterestCardProps) {
  const selectedValue = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    selectedValue.value = withSpring(selected ? 1 : 0, {
      damping: 14,
      stiffness: 170,
    });
  }, [selected, selectedValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selectedValue.value,
      [0, 1],
      [isDarkMode ? "#111827" : "#fdfdfd", "rgba(251, 146, 60, 0.18)"],
    ),
    borderColor: interpolateColor(
      selectedValue.value,
      [0, 1],
      [isDarkMode ? "#191f29" : "#f2f3f5", "#FB923C"],
    ),
    transform: [{ scale: interpolate(selectedValue.value, [0, 1], [0.985, 1]) }],
  }));

  const iconScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(selectedValue.value, [0, 1], [1, 1.06]) }],
  }));

  const iconColor = selected ? "#EA580C" : isDarkMode ? "#9CA3AF" : "#6B7280";
  const textColor = selected ? "#EA580C" : isDarkMode ? "#F9FAFB" : "#111827";

  return (
    <AnimatedPressable
      onPress={() => onToggle(item.id)}
      style={animatedStyle}
      className="flex-1 min-h-[86px] items-center rounded-2xl border px-4 py-3"
    >
      <Animated.View style={iconScaleStyle}>
        <Ionicons name={item.icon} size={20} color={iconColor} />
      </Animated.View>
      <Text style={{ color: textColor }} className="mt-2 text-sm font-semibold">
        {item.label}
      </Text>
    </AnimatedPressable>
  );
}
