import CallForm from "@/components/CallForm";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect to tabs if user is logged in
  useEffect(() => {
    if (isAuthenticated) {
      // Use push instead of replace for tabs
      router.push("/(tabs)");
    }
  }, [isAuthenticated, router]);

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <CallForm
      showHeader={true}
      showLoginPrompt={true}
      isLoggedIn={false}
      headerComponent={<Header onPressSettings={handleSettings} />}
    />
  );
}
