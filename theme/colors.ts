export interface ThemeColors {
  bg: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  input: string;
  inputText: string;
  inputBorder: string;
  iconPrimary: string;
  iconSecondary: string;
  bannerBg: string;
}

export interface ThemeScheme {
  light: ThemeColors;
  dark: ThemeColors;
}

export const appColors: ThemeScheme = {
  light: {
    bg: "bg-gray-50",
    card: "bg-white",
    text: "text-gray-700",
    textSecondary: "text-gray-600",
    border: "border-gray-50",
    input: "bg-gray-50",
    inputText: "text-gray-700",
    inputBorder: "border-gray-200",
    iconPrimary: "#EA580C",
    iconSecondary: "#4B5563",
    bannerBg: "bg-orange-50",
  },
  dark: {
    bg: "bg-gray-950",
    card: "bg-gray-900",
    text: "text-white",
    textSecondary: "text-white",
    border: "border-gray-900",
    input: "bg-gray-700",
    inputText: "text-white",
    inputBorder: "border-gray-600",
    iconPrimary: "#BA8C63",
    iconSecondary: "#D1D5DB",
    bannerBg: "bg-gray-700",
  },
};

export const getThemeColors = (isDarkMode: boolean): ThemeColors => {
  return isDarkMode ? appColors.dark : appColors.light;
};
