import { useEffect } from "react";
import * as SystemUI from "expo-system-ui";
import { useTheme } from "@/context/ThemeContext";

export function ThemeAwareNavigationBar() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const applyNavigationBarColor = async () => {
      try {
        // NavigationBar colors based on theme
        const navBarColor = isDarkMode ? "#030712" : "#ffffff";

        await SystemUI.setBackgroundColorAsync(navBarColor);
      } catch (error) {
        console.warn("Could not set navigation bar color:", error);
      }
    };

    applyNavigationBarColor();
  }, [isDarkMode]);

  return null; // This component only handles side effects
}
