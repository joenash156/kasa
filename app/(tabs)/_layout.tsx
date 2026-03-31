import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  //interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// Tab Icon Component with smooth overlay animation
const TabIcon = ({ name, focused, color, size, isDarkMode }: any) => {
  const activeValue = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    activeValue.value = withSpring(focused ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [focused, activeValue]);

  // Background pill animation
  const animatedPillStyle = useAnimatedStyle(() => ({
    opacity: activeValue.value,
    transform: [
      { scale: withTiming(focused ? 1 : 0.84, { duration: 180 }) },
      { translateY: interpolate(activeValue.value, [0, 1], [1, 0]) },
    ],
    backgroundColor: isDarkMode
      ? "rgba(255, 160, 82, 0.2)"
      : "rgba(255, 176, 111, 0.27)",
  }));

  // Outline icon opacity (fades out when focused)
  const outlineIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - activeValue.value,
  }));

  // Filled icon opacity (fades in when focused)
  const filledIconStyle = useAnimatedStyle(() => ({
    opacity: activeValue.value,
  }));

  return (
    <View style={styles.container}>
      {/* Background Pill */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size * 3.5,
            height: size * 2,
            borderRadius: 70,
            top: -2,
          },
          animatedPillStyle,
        ]}
      />

      {/* Outline Icon (Visible when NOT focused) */}
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.iconCentered, outlineIconStyle]}
      >
        <Ionicons name={`${name}-outline` as any} size={size} color={color} />
      </Animated.View>

      {/* Filled Icon (Fades in when focused) */}
      <Animated.View style={[styles.iconCentered, filledIconStyle]}>
        <Ionicons name={name} size={size} color={color} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconCentered: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function TabsLayout() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const tabBarHeight = 53;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: false,
        animation: "shift",
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Call",
          tabBarIcon: (props) => (
            <TabIcon name="call" {...props} size={21} isDarkMode={isDarkMode} />
          ),
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          title: "Logs",
          tabBarIcon: (props) => (
            <TabIcon name="document-text" {...props} size={21} isDarkMode={isDarkMode} />
          ),
        }}
      />
      <Tabs.Screen
        name="interests"
        options={{
          title: "Interests",
          tabBarIcon: (props) => (
            <TabIcon name="heart" {...props} size={22} isDarkMode={isDarkMode} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: (props) => (
            <TabIcon name="person" {...props} size={21} isDarkMode={isDarkMode} />
          ),
        }}
      />
    </Tabs>
  );
}
