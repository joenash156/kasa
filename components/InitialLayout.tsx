import { Stack } from "expo-router";
import React from "react";

const InitialLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
        animationDuration: 10,
        gestureDirection: 'horizontal',
      }}
    />
  );
};

export default InitialLayout;