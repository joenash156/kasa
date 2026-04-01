import { useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "#030712" : "#F9FAFB";

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: bg },
      }}
    />
  );
}
