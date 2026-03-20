import InitialLayout from "@/components/InitialLayout";
import "@/global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";


export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#ea580c" />
      <SafeAreaView
        className="flex-1"
      >
        <InitialLayout />
      </SafeAreaView>
    </>

  );
}
