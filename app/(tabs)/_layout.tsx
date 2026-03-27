import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
//import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const tabBarHeight = 52;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: false,
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: -3,
        },
        tabBarStyle: {
          height: tabBarHeight,
          backgroundColor: isDarkMode ? "#202229e6" : "#ebebebd9",
          borderTopWidth: 0,
          paddingHorizontal: 12,
          position: "absolute",
          bottom: 12,
          left: 0,
          right: 0,
          borderRadius: 30,
          elevation: 0,
          shadowOpacity: 0,
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
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "call" : "call-outline"} size={21} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          title: "Logs",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "document-text" : "document-text-outline"} size={21} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="interests"
        options={{
          title: "Interests",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={21} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
