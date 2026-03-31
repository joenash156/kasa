import CallForm from "@/components/CallForm";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";

export default function TabIndexScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Extract just the digits from the user's phone number
  const userPhoneNumber = useMemo(() => {
    if (!user?.phone_number) return "";
    // Remove any non-digit characters
    return user.phone_number.replace(/[^0-9]/g, "");
  }, [user?.phone_number]);

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <CallForm
      showHeader={true}
      showLoginPrompt={false}
      isLoggedIn={true}
      initialYourNumber={userPhoneNumber}
      headerComponent={<Header onPressSettings={handleSettings} />}
    />
  );
}
