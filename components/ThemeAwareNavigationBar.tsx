import { useTheme } from "@/context/ThemeContext";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";

export function ThemeAwareNavigationBar() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const apply = async () => {
      if (Platform.OS !== "android") return;

      const navBarColor = isDarkMode ? "#030712" : "#ffffff";
      const buttonStyle: NavigationBar.NavigationBarButtonStyle = isDarkMode
        ? "light"
        : "dark";

      try {
        await NavigationBar.setBackgroundColorAsync(navBarColor);
        await NavigationBar.setButtonStyleAsync(buttonStyle);
      } catch (error) {
        console.warn("Could not set navigation bar:", error);
      }
    };

    apply();

    // Re-apply on resume (some devices revert it).
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") apply();
    });

    return () => sub.remove();
  }, [isDarkMode]);

  return null; // This component only handles side effects
}
