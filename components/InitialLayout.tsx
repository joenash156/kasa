import { Stack } from "expo-router";
import React from "react";

const InitialLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "ios_from_right",
        gestureDirection: "horizontal",
        gestureEnabled: true,
      }}
    />
  );
};

export default InitialLayout;
