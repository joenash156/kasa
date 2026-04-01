import RootLayoutWrapper from "@/components/RootLayoutWrapper";
import { ThemeAwareStatusBar } from "@/components/ThemeAwareStatusBar";
import { ThemeAwareNavigationBar } from "@/components/ThemeAwareNavigationBar";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/global.css";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemeAwareStatusBar />
      <ThemeAwareNavigationBar />
      <AuthProvider>
        <RootLayoutWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
}
