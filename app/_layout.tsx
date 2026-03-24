import InitialLayout from "@/components/InitialLayout";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/global.css";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <View style={{ flex: 1, backgroundColor: "#ea580c" }}>
          <StatusBar
            style="light"
            backgroundColor="#ea580c"
            translucent={false}
          />
          <SafeAreaView
            edges={["top"]}
            style={{ backgroundColor: "#ea580c" }}
          />
          <SafeAreaView
            edges={["left", "right", "bottom"]}
            className="flex-1 bg-gray-50"
          >
            <InitialLayout />
          </SafeAreaView>
        </View>
      </AuthProvider>
    </ThemeProvider>
  );
}
