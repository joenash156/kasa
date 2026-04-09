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

      // Set background color based on APP THEME (not device theme)
      // const backgroundColor = isDarkMode ? "#030712" : "#ffffff";

      // Set button style for visibility
      const buttonStyle: NavigationBar.NavigationBarButtonStyle = isDarkMode
        ? "light"
        : "dark";

      try {
        // Only set background color if edge-to-edge is not enabled
        // setBackgroundColorAsync is not supported with edge-to-edge enabled
        //await NavigationBar.setBackgroundColorAsync(backgroundColor);
        await NavigationBar.setButtonStyleAsync(buttonStyle);
      } catch {
        // If setBackgroundColorAsync fails (likely due to edge-to-edge),
        // try setting button style only to at least respect the theme colors
        try {
          await NavigationBar.setButtonStyleAsync(buttonStyle);
        } catch (e) {
          console.warn("Could not set navigation bar style:", e);
        }
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
