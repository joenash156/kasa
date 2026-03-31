import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

interface ScrollGradientOverlayProps {
  height?: number;
}

export const ScrollGradientOverlay = ({
  height = 80,
}: ScrollGradientOverlayProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Light mode: light gray to white, Dark mode: dark gray to dark background
  const colors: readonly [string, string] = isDarkMode
    ? ["rgba(3, 7, 18, 0)", "rgba(3, 7, 18, 0.95)"] // Dark gradient
    : ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]; // Light gradient

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height,
        pointerEvents: "none",
      }}
    />
  );
};
