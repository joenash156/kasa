import RootLayoutWrapper from "@/components/RootLayoutWrapper";
import { ThemeAwareNavigationBar } from "@/components/ThemeAwareNavigationBar";
import { ThemeAwareStatusBar } from "@/components/ThemeAwareStatusBar";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/global.css";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemeAwareStatusBar />
        <ThemeAwareNavigationBar />
        <AuthProvider>
          <RootLayoutWrapper />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
