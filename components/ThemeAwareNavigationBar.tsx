import { useTheme } from "@/context/ThemeContext";
import { requireNativeModule } from "expo-modules-core";
import { useEffect } from "react";
import { AppState, Platform, processColor } from "react-native";

type NavigationBarButtonStyle = "light" | "dark";

type ExpoNavigationBarModule = {
  setBackgroundColorAsync: (color: ReturnType<typeof processColor>) => Promise<void>;
  setButtonStyleAsync: (style: NavigationBarButtonStyle) => Promise<void>;
  setPositionAsync?: (position: "relative" | "absolute") => Promise<void>;
};

const ExpoNavigationBar =
  Platform.OS === "android"
    ? requireNativeModule<ExpoNavigationBarModule>("ExpoNavigationBar")
    : null;

export function ThemeAwareNavigationBar() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const apply = async () => {
      if (Platform.OS !== "android" || !ExpoNavigationBar) return;

      const backgroundColor = isDarkMode ? "#030712" : "#ffffff";
      const buttonStyle: NavigationBarButtonStyle = isDarkMode
        ? "light"
        : "dark";

      try {
        await ExpoNavigationBar.setPositionAsync?.("relative");
        await ExpoNavigationBar.setBackgroundColorAsync(
          processColor(backgroundColor)
        );
        await ExpoNavigationBar.setButtonStyleAsync(buttonStyle);
      } catch (e) {
        try {
          await ExpoNavigationBar.setButtonStyleAsync(buttonStyle);
        } catch {
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
