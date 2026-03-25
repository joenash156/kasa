import { useTheme } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";

export function ThemeAwareStatusBar() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Status bar colors and styles based on theme
  const statusBarColor = isDarkMode ? "#0b0b0d" : "#ffffff";
  const statusBarStyle = isDarkMode ? "light" : "dark";

  return (
    <StatusBar
      style={statusBarStyle}
      backgroundColor={statusBarColor}
      translucent={false}
    />
  );
}
