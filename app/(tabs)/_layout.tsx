import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  ZoomIn,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Tab Icon Component with Animation
const TabIcon = ({ name, focused, color, size }: any) => {
  const iconName = focused ? name : `${name}-outline`;

  return (
    <Animated.View
      key={focused ? "active" : "inactive"}
      entering={ZoomIn.duration(200)}
    >
      <Ionicons name={iconName} size={size} color={color} />
    </Animated.View>
  );
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabBarButton(props: any) {
  const { children, onPress, accessibilityState } = props;
  const focused = Boolean(accessibilityState?.selected);
  const progress = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [focused, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["rgba(0,0,0,0)", "rgba(251, 146, 60, 0.24)"],
    ),
    transform: [{ scale: withTiming(focused ? 1 : 0.96, { duration: 220 }) }],
  }));

  return (
    <AnimatedPressable onPress={onPress} className="flex-1 px-1.5 py-1">
      <Animated.View style={animatedStyle} className="flex-1 rounded-full">
        <View className="flex-1 items-center justify-center">{children}</View>
      </Animated.View>
    </AnimatedPressable>
  );
}

export default function TabsLayout() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const tabBarHeight = 53;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: false,
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: -2,
        },
        tabBarStyle: {
          height: tabBarHeight,
          backgroundColor: isDarkMode ? "#14151acc" : "#ebebebd9",
          borderTopWidth: 0,
          paddingBottom: 5,

          position: "absolute",
          bottom: 12,
          left: 0,
          right: 0,
          borderRadius: 30,
          elevation: 8,
          shadowColor: isDarkMode ? "#47484de3" : "#00000038",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDarkMode ? 0.4 : 0.6,
          shadowRadius: isDarkMode ? 8 : 6,
          marginHorizontal: 8,
        },
        tabBarActiveTintColor: "#EA580C",
        tabBarInactiveTintColor: isDarkMode ? "#cfcfcf" : "#393d45",
        tabBarButton: (props) => <TabBarButton {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Call",
          tabBarIcon: (props) => <TabIcon name="call" {...props} size={21} />,
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          title: "Logs",
          tabBarIcon: (props) => (
            <TabIcon name="document-text" {...props} size={21} />
          ),
        }}
      />
      <Tabs.Screen
        name="interests"
        options={{
          title: "Interests",
          tabBarIcon: (props) => <TabIcon name="heart" {...props} size={22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: (props) => <TabIcon name="person" {...props} size={21} />,
        }}
      />
    </Tabs>
  );
}
