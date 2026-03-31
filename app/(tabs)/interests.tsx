import Header from "@/components/Header";
import InterestCard, { InterestItem } from "@/components/InterestCard";
import { ScrollGradientOverlay } from "@/components/ScrollGradientOverlay";
import { useTheme } from "@/context/ThemeContext";
import { getThemeColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";

export default function InterestsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);

  const primaryTextColor = isDarkMode ? "#F9FAFB" : "#111827";
  const secondaryTextColor = isDarkMode ? "#9CA3AF" : "#6B7280";

  const interests: InterestItem[] = [
    { id: "technology", label: "Technology", icon: "hardware-chip-outline" },
    { id: "business", label: "Business", icon: "briefcase-outline" },
    { id: "health", label: "Health", icon: "fitness-outline" },
    { id: "education", label: "Education", icon: "school-outline" },
    { id: "entertainment", label: "Entertainment", icon: "film-outline" },
    { id: "sports", label: "Sports", icon: "football-outline" },
    { id: "food", label: "Food & Dining", icon: "restaurant-outline" },
    { id: "travel", label: "Travel", icon: "airplane-outline" },
    { id: "finance", label: "Finance", icon: "cash-outline" },
    { id: "fashion", label: "Fashion", icon: "shirt-outline" },
    { id: "music", label: "Music", icon: "musical-notes-outline" },
    { id: "news", label: "News & Politics", icon: "newspaper-outline" },
  ];

  const handleSettings = () => {
    router.push("/settings");
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const listHeader = (
    <View className="mb-6">
      <Text style={{ color: primaryTextColor }} className="">
        Here are your interests
      </Text>
      <Text style={{ color: secondaryTextColor }} className="mt-2 text-sm">
        Select topics you are interested in, this helps us show you relevant content.
      </Text>
      <View className="mt-3 self-start rounded-full bg-orange-50 px-3 py-1.5">
        <Text className="text-xs font-semibold text-orange-700">
          Selected: {selectedInterests.length}
        </Text>
      </View>
    </View>
  );

  return (
    <View className={`flex-1 ${colors.bg}`}>
      <Header
        title="Interests"
        showLogo={false}
        onPressSettings={handleSettings}
      />

      <FlatList
        data={interests}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 18,
          paddingBottom: 84,
          gap: 12,
        }}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => (
          <InterestCard
            item={item}
            selected={selectedInterests.includes(item.id)}
            isDarkMode={isDarkMode}
            onToggle={toggleInterest}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <ScrollGradientOverlay height={80} />
    </View>
  );
}
