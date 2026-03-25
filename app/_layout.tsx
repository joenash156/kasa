import RootLayoutWrapper from "@/components/RootLayoutWrapper";
import { ThemeAwareStatusBar } from "@/components/ThemeAwareStatusBar";
import { ThemeAwareNavigationBar } from "@/components/ThemeAwareNavigationBar";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/global.css";

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
