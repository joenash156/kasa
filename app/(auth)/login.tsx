import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { getThemeColors } from "../../theme/colors";

export default function LoginScreen() {
  const { height, width } = useWindowDimensions();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(theme === "dark");
  const screenBgColor = isDarkMode ? "#030712" : "#F9FAFB";
  /** Inline fallbacks so UI stays visible if NativeWind classNames fail on this route. */
  const textPrimary = isDarkMode ? "#F9FAFB" : "#111827";
  const textSecondary = isDarkMode ? "#D1D5DB" : "#4B5563";
  const inputTextColor = isDarkMode ? "#F9FAFB" : "#111827";
  const cardBgColor = isDarkMode ? "#111827" : "#FFFFFF";
  const [phoneNumber, setPhoneNumber] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const heroScrollRef = useRef<ScrollView>(null);

  const phoneDigits = phoneNumber.replace(/\D/g, "");
  const canSendOtp = phoneDigits.length >= 9;
  const canVerifyOtp = otpCode.length === 6;
  const sendButtonEnabled = canSendOtp && !loading;
  const verifyButtonEnabled = canVerifyOtp && !loading;
  const heroHeight = Math.max(280, Math.min(height * 0.46, 390));

  // Use static requires for image sources to avoid platform/module interop issues.
  const heroImages = useMemo(
    () => [
      require("../../assets/images/person1.png"),
      require("../../assets/images/person2.png"),
      require("../../assets/images/person3.png"),
      require("../../assets/images/person4.png"),
    ],
    [],
  );

  // Auto-scroll carousel (horizontal ScrollView — avoids FlatList-inside-ScrollView on Android)
  useEffect(() => {
    if (isManualScrolling) return;

    const interval = setInterval(() => {
      setCarouselIndex((prevIndex) => {
        if (width <= 0) return prevIndex;
        const nextIndex = (prevIndex + 1) % heroImages.length;
        heroScrollRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isManualScrolling, heroImages.length, width]);

  const onHeroMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setCarouselIndex(Math.min(heroImages.length - 1, Math.max(0, Math.round(x / width))));
    setIsManualScrolling(false);
  };

  const handlePhoneChange = (text: string) => {
    // Keep digits only (we render the "+" prefix in the UI)
    const cleaned = text.replace(/[^0-9]/g, "");
    setPhoneNumber(cleaned);
  };

  const handlePhoneSubmit = () => {
    if (!canSendOtp || loading) return;

    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1200);
  };

  const handleOtpChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 6) {
      setOtpCode(cleaned);
    }
  };

  const handleOtpVerify = () => {
    if (!canVerifyOtp || loading) return;

    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      // Navigate to home
      console.log("Login successful!");
    }, 1200);
  };

  const handleResendOtp = () => {
    if (loading) return;

    setLoading(true);
    setOtpCode("");
    // Simulate resending OTP
    setTimeout(() => {
      setLoading(false);
      console.log("OTP resent");
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      className={`flex-1 ${colors.bg}`}
      style={{ backgroundColor: screenBgColor }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        nestedScrollEnabled
        className={`flex-1 ${colors.bg}`}
        style={{ backgroundColor: screenBgColor }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 24,
          backgroundColor: screenBgColor,
        }}
      >
        <View className="flex-1 pb-8">
          {/* Hero Carousel Section */}
          <View
            style={{ height: heroHeight }}
            className="overflow-hidden relative"
          >
            <ScrollView
              ref={heroScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              onScrollBeginDrag={() => setIsManualScrolling(true)}
              onMomentumScrollEnd={onHeroMomentumEnd}
              scrollEventThrottle={16}
            >
              {heroImages.map((src, index) => (
                <View
                  key={index}
                  style={{
                    width,
                    height: heroHeight,
                  }}
                >
                  <Image
                    source={src}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                    }}
                  />
                  <LinearGradient
                    colors={[
                      "rgba(255, 197, 166, 0.3)",
                      "rgba(252, 206, 182, 0.5)",
                      "rgba(250, 155, 105, 0.7)",
                    ]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                  />
                </View>
              ))}
            </ScrollView>

            {/* Content Overlay */}
            <View
              className="absolute inset-0"
              pointerEvents="none"
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                alignSelf: "center",
              }}
            >
              <View>
                <Text
                  className={`text-center text-3xl font-bold ${colors.text} leading-tight`}
                  style={{
                    color: "#FFFFFF",
                    textShadowColor: "rgba(0,0,0,0.45)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  {step === "phone" ? "Welcome back" : "Verify your account"}
                </Text>
              </View>
              <View className="mt-2">
                <Text
                  className={`text-center text-sm font-medium ${colors.textSecondary}`}
                  style={{
                    color: "rgba(255,255,255,0.92)",
                    textShadowColor: "rgba(0,0,0,0.35)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3,
                  }}
                >
                  {step === "phone"
                    ? "Sign in with your phone number to continue."
                    : `Enter the 6-digit code sent to +233${phoneNumber}`}
                </Text>
              </View>
              <View className="mt-4 flex-row items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 border border-white/30">
                <Ionicons
                  name={step === "phone" ? "call-outline" : "shield-checkmark"}
                  size={12}
                  color="#FFFFFF"
                />
                <Text className="text-xs font-semibold text-white">
                  {step === "phone" ? "Step 1 of 2" : "Step 2 of 2"}
                </Text>
              </View>
            </View>

            {/* Carousel Indicators */}
            <View
              className="absolute bottom-3 left-0 right-0 flex-row items-center justify-center gap-2"
              // pointerEvents="none"
              // style={{
              //   bottom: 12,
              //   position: "absolute",
              //   flexDirection: "row",
              //   alignItems: "center",
              //   justifyContent: "center",
              //   width: "100%",
              // }}
            >
              {heroImages.map((_, i) => (
                <View
                  key={i}
                  className={`rounded-full transition-all ${
                    carouselIndex === i
                      ? "bg-white w-5 h-2"
                      : "bg-white/50 w-2 h-2"
                  }`}
                  // style={{
                  //   opacity: carouselIndex === i ? 1 : 0.5,
                  //   width: carouselIndex === i ? 12 : 8,
                  //   height: carouselIndex === i ? 12 : 8,
                  //   borderRadius: 6,
                  // }}
                />
              ))}
            </View>
          </View>

          {/* Form Section */}
          <View className="px-3 mt-6">
            {step === "phone" ? (
              // PHONE NUMBER STEP
              <View className="gap-6">
                {/* Phone Input Card */}
                <View
                  className={`${colors.card}`}
                  style={{ backgroundColor: cardBgColor }}
                >
                  {/* Input Header */}
                  <View
                    className={` rounded-t-2xl flex-row gap-1 items-center ${colors.input} px-2 py-3 `}
                    style={{
                      borderWidth: 1,
                      borderColor: theme === "dark" ? "#212121" : "#f5f5f5",
                    }}
                  >
                    <Feather
                      name="phone"
                      size={15}
                      color={colors.iconPrimary}
                    />
                    {/* <MaterialCommunityIcons name="cellphone-basic" size={20} color="#EA580C" /> */}
                    <Text
                      className={`text-xs font-semibold uppercase tracking-wide ${colors.text}`}
                      style={{ color: textPrimary }}
                    >
                      Phone Number
                    </Text>
                  </View>

                  {/* Input Field */}
                  <View className="">
                    <View
                      className={`flex-row items-center gap-3 ${colors.input} px-2 py-4`}
                      style={{
                        borderWidth: 1,
                        borderColor: theme === "dark" ? "#212121" : "#f5f5f5",
                      }}
                    >
                      <View
                        className="h-9 w-9 items-center justify-center bg-orange-100"
                        style={{ borderRadius: 20 }}
                      >
                        {/* <Feather name="phone" size={17} color="#EA580C" /> */}
                        <MaterialCommunityIcons
                          name="phone-classic"
                          size={17}
                          color="rgb(236, 77, 24)"
                        />
                      </View>
                      <View
                        className={`h-8 w-px ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}
                      />
                      <View className="flex-1 flex-row items-center">
                        <Text
                          className={`text-lg font-semibold ${colors.text}`}
                          style={{ color: textPrimary }}
                        >
                          +233
                        </Text>
                        <TextInput
                          placeholder="XXX XXX XXXX"
                          placeholderTextColor={
                            theme === "dark" ? "#6B7280" : "#9CA3AF"
                          }
                          keyboardType="phone-pad"
                          style={{ fontSize: 16, color: inputTextColor }}
                          className={`ml-2 flex-1 font-semibold ${colors.inputText}`}
                          value={phoneNumber}
                          onChangeText={handlePhoneChange}
                          maxLength={9}
                          editable={!loading}
                        />
                      </View>
                      {canSendOtp && (
                        <View className="h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                          <Feather name="check" size={14} color="white" />
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Helper Text */}
                  <View
                    className={`flex-row rounded-b-2xl items-center gap-2 ${colors.input} px-6 py-3`}
                    style={{
                      borderTopWidth: 0.5,
                      borderColor: theme === "dark" ? "#212121" : "#f3f3f3",
                    }}
                  >
                    <Ionicons
                      name="information-circle"
                      size={14}
                      color={colors.iconPrimary}
                    />
                    <Text
                      className={`flex-1 text-xs ${colors.textSecondary}`}
                      style={{ color: textSecondary }}
                    >
                      Use digits only. We will validate the number for
                      verification.
                    </Text>
                  </View>
                </View>

                {/* CTA Button */}
                <TouchableOpacity
                  onPress={handlePhoneSubmit}
                  disabled={!sendButtonEnabled}
                  className={`w-full flex-row items-center justify-center gap-2 rounded-xl py-3.5 ${canSendOtp ? "bg-orange-600/90" : theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                  activeOpacity={0.9}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator size="small" color="white" />
                      <Text className="font-bold text-white">
                        Sending OTP...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons
                        name="send"
                        size={18}
                        color={
                          sendButtonEnabled
                            ? "white"
                            : theme === "dark"
                              ? "#6B7280"
                              : "#9CA3AF"
                        }
                      />
                      <Text
                        className={`font-bold ${sendButtonEnabled ? "text-white" : theme === "dark" ? "text-gray-500" : "text-gray-500"}`}
                      >
                        Send OTP
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Info Box */}
                <View
                  className={`flex-row gap-3 rounded-lg ${colors.bannerBg} p-4 `}
                  style={{
                    borderWidth: 1,
                    borderColor: theme === "dark" ? "#212121" : "#f7f7f7",
                  }}
                >
                  <Feather name="info" size={16} color="#3B82F6" />
                  <Text
                    className={`flex-1 text-xs ${colors.text} leading-relaxed`}
                    style={{ color: textPrimary }}
                  >
                    Your number is encrypted and secure. We will never share it
                    with third parties.
                  </Text>
                </View>
              </View>
            ) : (
              // OTP VERIFICATION STEP
              <View className="gap-6">
                {/* OTP Input Card */}
                <View
                  className={colors.card}
                  style={{ backgroundColor: cardBgColor }}
                >
                  {/* Input Header */}
                  <View
                    className={`flex-row gap-1 items-center ${colors.input} px-2 py-3`}
                    style={{
                      borderWidth: 1,
                      borderColor: theme === "dark" ? "#212121" : "#f5f5f5",
                    }}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={15}
                      color={colors.iconPrimary}
                    />
                    <Text
                      className={`text-xs font-semibold uppercase tracking-wide ${colors.text}`}
                      style={{ color: textPrimary }}
                    >
                      Verification Code
                    </Text>
                  </View>

                  {/* OTP Input Field */}
                  <View>
                    <View
                      className={`flex-row items-center gap-3 ${colors.input} px-2 py-2`}
                      style={{
                        borderWidth: 1,
                        borderColor: theme === "dark" ? "#212121" : "#f5f5f5",
                      }}
                    >
                      {/* <View className="h-9 w-9 items-center justify-center bg-orange-100" style={{ borderRadius: 20 }}>
                        <Ionicons name="shield-checkmark" size={17} color="#EA580C" />
                      </View>
                      <View className="h-8 w-px bg-gray-200" /> */}
                      <View className="flex-1 flex-row items-center">
                        <TextInput
                          placeholder="••••••"
                          placeholderTextColor={
                            theme === "dark" ? "#6B7280" : "#9CA3AF"
                          }
                          keyboardType="number-pad"
                          maxLength={6}
                          style={{
                            fontSize: 26,
                            letterSpacing: 8,
                            color: inputTextColor,
                          }}
                          className={`flex-1 py-3 font-bold ${colors.inputText} text-center`}
                          value={otpCode}
                          onChangeText={handleOtpChange}
                          editable={!loading}
                          secureTextEntry
                        />
                      </View>
                    </View>

                    {/* OTP Visual Indicators */}
                    {/* <View className="flex-row gap-2 justify-center">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <View
                          key={i}
                          className={`w-3.5 h-3.5 rounded-full ${i < otpCode.length ? 'bg-orange-500' : 'bg-gray-300'}`}
                        />
                      ))}
                    </View> */}
                  </View>

                  {/* Helper Text */}
                  <View
                    className={`flex-row items-center gap-2 ${colors.input} px-6 py-3`}
                    style={{
                      borderTopWidth: 0.5,
                      borderColor: theme === "dark" ? "#212121" : "#f3f3f3",
                    }}
                  >
                    <Text
                      className={`flex-1 text-xs ${colors.textSecondary}`}
                      style={{ color: textSecondary }}
                    >
                      Check your SMS for the 6-digit code
                    </Text>
                  </View>
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                  onPress={handleOtpVerify}
                  disabled={!verifyButtonEnabled}
                  className={`w-full flex-row items-center justify-center gap-2 rounded-xl py-4 ${canVerifyOtp ? "bg-orange-600/90" : theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                  activeOpacity={0.9}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator size="small" color="white" />
                      <Text className="font-bold text-white">Verifying...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons
                        name="shield-checkmark"
                        size={18}
                        color={
                          verifyButtonEnabled
                            ? "white"
                            : theme === "dark"
                              ? "#6B7280"
                              : "#9CA3AF"
                        }
                      />
                      <Text
                        className={`font-bold ${verifyButtonEnabled ? "text-white" : theme === "dark" ? "text-gray-500" : "text-gray-500"}`}
                      >
                        Verify & Login
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Change Phone Number */}
                <TouchableOpacity
                  onPress={() => {
                    setStep("phone");
                    setOtpCode("");
                  }}
                  className={`flex-row items-center justify-center gap-2 rounded-xl border ${theme === "dark" ? "border-orange-900 bg-orange-950" : "border-orange-200 bg-orange-50"} py-3`}
                  activeOpacity={0.85}
                >
                  <Feather name="edit-2" size={16} color={colors.iconPrimary} />
                  <Text
                    className={`font-semibold ${theme === "dark" ? "text-orange-400" : "text-orange-700"}`}
                  >
                    Change Phone Number
                  </Text>
                </TouchableOpacity>

                {/* Resend OTP */}
                <View className="flex-row items-center justify-center gap-2">
                  <Text
                    className={`text-xs ${colors.textSecondary}`}
                    style={{ color: textSecondary }}
                  >
                    Did not receive code?
                  </Text>
                  <TouchableOpacity
                    onPress={handleResendOtp}
                    disabled={loading}
                  >
                    <Text
                      className={`text-xs font-bold ${theme === "dark" ? "text-orange-400" : "text-orange-600"} underline`}
                    >
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Bottom Section - Terms & Info */}
          <View className="px-6 py-4">
            <Text
              className={`text-center text-xs ${colors.textSecondary} leading-relaxed`}
              style={{ color: textSecondary }}
            >
              By logging in, you agree to our{" "}
              <Text
                className={`font-semibold ${colors.text}`}
                style={{ color: textPrimary }}
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                className={`font-semibold ${colors.text}`}
                style={{ color: textPrimary }}
              >
                Privacy Policy
              </Text>
            </Text>

            {/* Security Badge */}
            <View className="mt-4 flex-row items-center justify-center gap-1.5 rounded-full  px-3 py-2 ">
              <Ionicons
                name="lock-closed"
                size={12}
                color={colors.iconSecondary}
              />
              <Text
                className={`text-xs font-semibold ${colors.textSecondary}`}
                style={{ color: textSecondary }}
              >
                Secure by design
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
