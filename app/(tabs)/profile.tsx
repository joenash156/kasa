import Header from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";
import { getThemeColors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  expanded: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  isDarkMode: boolean;
};

function SelectField({
  label,
  value,
  options,
  expanded,
  onToggle,
  onSelect,
  isDarkMode,
}: SelectFieldProps) {
  const primaryText = isDarkMode ? "#F9FAFB" : "#111827";
  const secondaryText = isDarkMode ? "#9CA3AF" : "#6B7280";
  const fieldBg = isDarkMode ? "#111827" : "#fcfcfc";
  const borderColor = isDarkMode ? "#191f29" : "#f2f3f5";

  return (
    <View className="mb-4">
      <Text style={{ color: secondaryText }} className="mb-1.5 text-xs font-semibold uppercase">
        {label}
      </Text>

      <Pressable
        onPress={onToggle}
        className="flex-row items-center justify-between rounded-xl px-3 py-3"
        style={{ backgroundColor: fieldBg, borderColor, borderWidth: 1 }}
      >
        <Text style={{ color: value === "Select phone type" ? secondaryText : primaryText }}>
          {value}
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={secondaryText}
        />
      </Pressable>

      {expanded ? (
        <View
          className="mt-2 overflow-hidden rounded-xl"
          style={{ backgroundColor: fieldBg, borderColor, borderWidth: 1 }}
        >
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              className="px-3 py-3"
              style={{
                backgroundColor:
                  option === value
                    ? isDarkMode
                      ? "rgba(251, 146, 60, 0.16)"
                      : "rgba(251, 146, 60, 0.14)"
                    : "transparent",
              }}
            >
              <Text
                style={{
                  color: option === value ? "#EA580C" : primaryText,
                  fontWeight: option === value ? "600" : "500",
                }}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(isDarkMode);
  const primaryText = isDarkMode ? "#F9FAFB" : "#111827";
  const secondaryText = isDarkMode ? "#9CA3AF" : "#6B7280";
  const cardBg = isDarkMode ? "#111827" : "#FFFFFF";
  const inputBg = isDarkMode ? "#0F172A" : "#FFFFFF";
  const inputBorder = isDarkMode ? "#191f29" : "#f2f3f5";

  const [ageGroup, setAgeGroup] = React.useState("18–24");
  const [gender, setGender] = React.useState("Male");
  const [language, setLanguage] = React.useState("Twi");
  const [phoneType, setPhoneType] = React.useState("Select phone type");
  const [region, setRegion] = React.useState("Greater Accra");
  const [expandedSelect, setExpandedSelect] = React.useState<string | null>(null);

  const toggleSelect = (key: string) => {
    setExpandedSelect((prev) => (prev === key ? null : key));
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <View className={`flex-1 ${colors.bg}`}>
      <Header title="My Profile" showLogo={false} onPressSettings={handleSettings} />

      <ScrollView
        className={`flex-1 ${colors.bg}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 14, paddingBottom: 88 }}
      >
        <View className="mb-5 rounded-2xl px-4 py-4" style={{ backgroundColor: cardBg }}>
          <Text style={{ color: primaryText }} className="">
            Checkout your profile
          </Text>
          <Text style={{ color: secondaryText }} className="mt-1.5 text-sm leading-5">
            Help us personalise your experience by completing your profile.
          </Text>
        </View>

        <View className="mb-4 rounded-2xl px-4 py-4" style={{ backgroundColor: cardBg }}>
          <Text style={{ color: primaryText }} className="text-base font-bold">
            Account
          </Text>

          <View className="mt-4">
            <Text style={{ color: secondaryText }} className="mb-1.5 text-xs font-semibold uppercase">
              Phone Number
            </Text>
            <TextInput
              value="233551660436"
              editable={false}
              className="rounded-xl px-3 py-3"
              style={{
                backgroundColor: isDarkMode ? "#0B1220" : "#F3F4F6",
                borderWidth: 1,
                borderColor: inputBorder,
                color: secondaryText,
              }}
            />
          </View>

          <View className="mt-4">
            <Text style={{ color: secondaryText }} className="mb-1.5 text-xs font-semibold uppercase">
              Country Code
            </Text>
            <TextInput
              value="233"
              editable={false}
              className="rounded-xl px-3 py-3"
              style={{
                backgroundColor: isDarkMode ? "#0B1220" : "#F3F4F6",
                borderWidth: 1,
                borderColor: inputBorder,
                color: secondaryText,
              }}
            />
          </View>
        </View>

        <View className="rounded-2xl px-4 py-4" style={{ backgroundColor: cardBg }}>
          <Text style={{ color: primaryText }} className="text-base font-bold">
            Personal Information
          </Text>

          <View className="mt-4">
            <SelectField
              label="Age Group"
              value={ageGroup}
              options={["18–24", "25–34", "35–44", "45–54", "55+"]}
              expanded={expandedSelect === "ageGroup"}
              onToggle={() => toggleSelect("ageGroup")}
              onSelect={(value) => {
                setAgeGroup(value);
                setExpandedSelect(null);
              }}
              isDarkMode={isDarkMode}
            />

            <SelectField
              label="Gender"
              value={gender}
              options={["Male", "Female", "Prefer not to say"]}
              expanded={expandedSelect === "gender"}
              onToggle={() => toggleSelect("gender")}
              onSelect={(value) => {
                setGender(value);
                setExpandedSelect(null);
              }}
              isDarkMode={isDarkMode}
            />

            <View className="mb-4">
              <Text
                style={{ color: secondaryText }}
                className="mb-1.5 text-xs font-semibold uppercase"
              >
                Region
              </Text>
              <TextInput
                value={region}
                onChangeText={setRegion}
                placeholder="Enter your region"
                placeholderTextColor={secondaryText}
                className="rounded-xl px-3 py-3"
                style={{
                  backgroundColor: inputBg,
                  borderWidth: 1,
                  borderColor: inputBorder,
                  color: primaryText,
                }}
              />
            </View>

            <SelectField
              label="Language Preference"
              value={language}
              options={["Twi", "English", "Ga", "Ewe", "Hausa"]}
              expanded={expandedSelect === "language"}
              onToggle={() => toggleSelect("language")}
              onSelect={(value) => {
                setLanguage(value);
                setExpandedSelect(null);
              }}
              isDarkMode={isDarkMode}
            />

            <SelectField
              label="Phone Type"
              value={phoneType}
              options={["Select phone type", "Android", "iPhone", "Feature Phone"]}
              expanded={expandedSelect === "phoneType"}
              onToggle={() => toggleSelect("phoneType")}
              onSelect={(value) => {
                setPhoneType(value);
                setExpandedSelect(null);
              }}
              isDarkMode={isDarkMode}
            />
          </View>
        </View>

        <TouchableOpacity
          className="mt-5 h-12 items-center justify-center rounded-xl bg-orange-600"
          activeOpacity={0.88}
        >
          <Text className="text-base font-semibold text-white">Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
