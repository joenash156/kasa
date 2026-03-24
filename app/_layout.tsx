import RootLayoutWrapper from "@/components/RootLayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/global.css";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar
          style="light"
          backgroundColor="#ea580c"
          translucent={false}
        />
        <RootLayoutWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
}
