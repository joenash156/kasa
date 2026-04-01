import AlertModal, { AlertConfig } from "@/components/AlertModal";
import { ScrollGradientOverlay } from "@/components/ScrollGradientOverlay";
import * as authService from "@/services/auth.service";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getThemeColors } from "../../theme/colors";

const CarouselIndicator = ({
  index,
  currentIndex,
  isDarkMode,
}: {
  index: number;
  currentIndex: number;
  isDarkMode: boolean;
}) => {
  const isActive = useDerivedValue(() => {
    return currentIndex === index ? 1 : 0;
  }, [currentIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    const width = withTiming(isActive.value === 1 ? 20 : 8, { duration: 300 });
    const backgroundColor = interpolateColor(
      isActive.value,
      [0, 1],
      [
        isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
        isDarkMode ? "#FFFFFF" : "#000000",
      ],
    );

    return {
      width,
      backgroundColor,
      height: 8,
      borderRadius: 4,
    };
  });

  return <Animated.View style={animatedStyle} />;
};

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { height, width } = useWindowDimensions();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const colors = getThemeColors(theme === "dark");
  const screenBgColor = isDarkMode ? "#030712" : "#F9FAFB";
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
  const [showOtp, setShowOtp] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });
  const [pendingOtpNavigation, setPendingOtpNavigation] = useState(false);
  const [pendingTabsNavigation, setPendingTabsNavigation] = useState(false);
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

  // Handle navigation after alert dismissal
  useEffect(() => {
    if (!alertConfig.visible && pendingOtpNavigation) {
      setStep("otp");
      setPendingOtpNavigation(false);
    }
  }, [alertConfig.visible, pendingOtpNavigation]);

  useEffect(() => {
    if (!alertConfig.visible && pendingTabsNavigation) {
      setPendingTabsNavigation(false);
      router.replace("/(tabs)");
    }
  }, [alertConfig.visible, pendingTabsNavigation, router]);

  const onHeroMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setCarouselIndex(
      Math.min(heroImages.length - 1, Math.max(0, Math.round(x / width))),
    );
    setIsManualScrolling(false);
  };

  const handleAlertDismiss = () => {
    // Just close the alert - the useEffect will handle navigation
    setAlertConfig({ visible: false, title: "", message: "", type: "info" });
  };

  const handlePhoneChange = (text: string) => {
    // Keep digits only (we render the "+" prefix in the UI)
    const cleaned = text.replace(/[^0-9]/g, "");
    setPhoneNumber(cleaned);
  };

  const handlePhoneSubmit = async () => {
    if (!canSendOtp || loading) return;

    setLoading(true);
    try {
      // Format phone number: remove special characters and ensure international format
      let normalizedPhone = phoneNumber.replace(/\D/g, "");
      if (!normalizedPhone.startsWith("233")) {
        normalizedPhone = "233" + normalizedPhone;
      }

      // Call API to request OTP
      const response = await authService.requestOtp(normalizedPhone);

      // Check HTTP status code (200 = success, regardless of message content)
      if (response && response.status === 200) {
        // Set flag to navigate to OTP screen when alert is dismissed
        setPendingOtpNavigation(true);
        // Show success alert
        setAlertConfig({
          visible: true,
          title: "Success",
          message: "OTP sent to your phone number",
          type: "success",
        });
      } else {
        setAlertConfig({
          visible: true,
          title: "Error",
          message: response?.message || "Failed to send OTP",
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("OTP request error:", error);
      setAlertConfig({
        visible: true,
        title: "Error",
        message: error.message || "Failed to send OTP. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 6) {
      setOtpCode(cleaned);
    }
  };

  const handleOtpVerify = async () => {
    if (!canVerifyOtp || loading) return;

    setLoading(true);
    try {
      // Format phone number
      let normalizedPhone = phoneNumber.replace(/\D/g, "");
      if (!normalizedPhone.startsWith("233")) {
        normalizedPhone = "233" + normalizedPhone;
      }

      // Call API to verify OTP
      const response = await authService.verifyOtp({
        phone: normalizedPhone,
        otp: otpCode,
      });

      // The API shape we receive is typically:
      // { data: { caller_id, token }, status: 200, url: "/auth/verify-otp" }
      // but tolerate alternative wrappers.
      const top: any = response ?? null;
      const data: any = top?.data ?? null;
      const nested: any = data?.data ?? null;

      const token: string | undefined = data?.token ?? nested?.token;
      const callerId: number | undefined = data?.caller_id ?? nested?.caller_id;

      if (top?.status === 200 && token && typeof callerId === "number") {
        try {
          // Use the login function from AuthContext
          await login(
            {
              id: callerId,
              phone_number: phoneNumber,
              country_code: "233",
              opt_in: false,
              interests: [],
              call_count: 0,
            },
            callerId,
            token,
          );
          setAlertConfig({
            visible: true,
            title: "Verified",
            message: "OTP verified successfully. Welcome back!",
            type: "success",
          });
          setPendingTabsNavigation(true);
        } catch (loginError) {
          console.error(
            "Login function failed after OTP verification:",
            loginError,
          );
          let loginErrorMessage = "Login failed after OTP verification.";
          if (loginError instanceof Error) {
            loginErrorMessage = loginError.message;
          } else if (typeof loginError === "string") {
            loginErrorMessage = loginError;
          }
          setAlertConfig({
            visible: true,
            title: "Login Error",
            message: loginErrorMessage,
            type: "error",
          });
        }
      } else {
        setAlertConfig({
          visible: true,
          title: "Verification Failed",
          message:
            top?.message ||
            "Failed to verify OTP. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      let errorMessage = "Invalid OTP. Please try again.";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null &&
        "data" in (error as any).response &&
        typeof (error as any).response.data === "object" &&
        (error as any).response.data !== null &&
        "message" in (error as any).response.data
      ) {
        errorMessage = (error as any).response.data.message;
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      setAlertConfig({
        visible: true,
        title: "Error",
        message: errorMessage,
        type: "error",
      });
      // Reset OTP input on failure
      setOtpCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (loading) return;

    setLoading(true);
    try {
      // Format phone number
      let normalizedPhone = phoneNumber.replace(/\D/g, "");
      if (!normalizedPhone.startsWith("233")) {
        normalizedPhone = "233" + normalizedPhone;
      }

      // Call API to resend OTP
      const response = await authService.requestOtp(normalizedPhone);

      // Check HTTP status code (200 = success)
      if (response && response.status === 200) {
        setOtpCode("");
        setAlertConfig({
          visible: true,
          title: "Success",
          message: "OTP resent to your phone number",
          type: "success",
        });
      } else {
        setAlertConfig({
          visible: true,
          title: "Error",
          message: response?.message || "Failed to resend OTP",
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("OTP resend error:", error);
      setAlertConfig({
        visible: true,
        title: "Error",
        message:
          error.response?.data?.message ||
          "Failed to resend OTP. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
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
                  <View
                    pointerEvents="none"
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(3, 7, 18, 0.45)"
                          : "rgba(133, 133, 133, 0.35)",
                      },
                    ]}
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
            <View className="absolute bottom-3 left-0 right-0 flex-row items-center justify-center gap-2">
              {heroImages.map((_, i) => (
                <CarouselIndicator
                  key={i}
                  index={i}
                  currentIndex={carouselIndex}
                  isDarkMode={isDarkMode}
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
                      <View className="flex-1 flex-row items-center">
                        <TextInput
                          placeholder="••••••"
                          autoComplete="sms-otp"
                          textContentType="oneTimeCode"
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
                          secureTextEntry={!showOtp}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => setShowOtp(!showOtp)}
                        activeOpacity={0.7}
                        className="h-10 w-10 items-center justify-center"
                      >
                        <Ionicons
                          name={showOtp ? "eye-off" : "eye"}
                          size={20}
                          color={colors.iconPrimary}
                        />
                      </TouchableOpacity>
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
                  className={`w-full flex-row items-center justify-center gap-2 rounded-xl py-3.5 ${canVerifyOtp ? "bg-orange-600/90" : theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
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
      <ScrollGradientOverlay height={80} />

      {/* Custom Alert Modal */}
      <AlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onDismiss={handleAlertDismiss}
      />
    </KeyboardAvoidingView>
  );
}
