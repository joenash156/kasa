import InitialLayout from "@/components/InitialLayout";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getThemeColors } from "@/theme/colors";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayoutWrapper() {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  const bgColor = isDarkMode ? "#030712" : "#ffffff";

  // Route protection: Check if user should be on this screen
  // IMPORTANT: useEffect must be called BEFORE early returns!
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // User is not authenticated - will be handled by Expo Router
      // Redirect is detected by the route file structure
      console.log("[RootLayoutWrapper] User not authenticated");
    }
  }, [isAuthenticated, isLoading]);

  // If still checking authentication, show loading screen
  if (isLoading) {
    return (
      <View
        style={{ flex: 1, backgroundColor: bgColor }}
        className="flex items-center justify-center"
      >
        <SafeAreaView
          edges={["top", "left", "right", "bottom"]}
          className="flex-1"
          style={{ backgroundColor: bgColor }}
        >
          {/* TODO: Add loading spinner here */}
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <SafeAreaView
        edges={["top", "left", "right", "bottom"]}
        className={`flex-1 ${colors.bg}`}
        style={{ backgroundColor: bgColor }}
      >
        <InitialLayout />
      </SafeAreaView>
    </View>
  );
}
