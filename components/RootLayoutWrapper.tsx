import InitialLayout from "@/components/InitialLayout";
import { useTheme } from "@/context/ThemeContext";
import { getThemeColors } from "@/theme/colors";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayoutWrapper() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);

  return (
    <View style={{ flex: 1, backgroundColor: "#ea580c" }}>
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        className={`flex-1 ${colors.bg}`}
      >
        <InitialLayout />
      </SafeAreaView>
    </View>
  );
}
