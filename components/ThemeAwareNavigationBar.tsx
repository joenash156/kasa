import { useTheme } from "@/context/ThemeContext";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Platform } from "react-native";

export function ThemeAwareNavigationBar() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    // Only run on Android
    if (Platform.OS !== "android") return;

    // Fire and forget - don't await, just update in background
    const navBarColor = isDarkMode ? "#030712" : "#ffffff";
    SystemUI.setBackgroundColorAsync(navBarColor).catch((error) => {
      console.warn("Could not set navigation bar color:", error);
    });
  }, [isDarkMode]);

  return null; // This component only handles side effects
}
