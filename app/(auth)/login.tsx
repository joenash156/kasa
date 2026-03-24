import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { usePageLoadSpringAnimation } from '../../components/animations/useAnimations';

export default function LoginScreen() {
  const { height } = useWindowDimensions();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Animation hooks with staggered delays
  const animateHeading = usePageLoadSpringAnimation(100);
  const animateSubtitle = usePageLoadSpringAnimation(250);
  const animateSecurityBadge = usePageLoadSpringAnimation(400);

  const phoneDigits = phoneNumber.replace(/\D/g, '');
  const canSendOtp = phoneDigits.length >= 9;
  const canVerifyOtp = otpCode.length === 6;
  const sendButtonEnabled = canSendOtp && !loading;
  const verifyButtonEnabled = canVerifyOtp && !loading;
  const heroHeight = Math.max(280, Math.min(height * 0.46, 390));

  const handlePhoneChange = (text: string) => {
    // Keep digits only (we render the "+" prefix in the UI)
    const cleaned = text.replace(/[^0-9]/g, '');
    setPhoneNumber(cleaned);
  };

  const handlePhoneSubmit = () => {
    if (!canSendOtp || loading) return;

    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleOtpChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
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
      // Navigate to home - TODO: router.push('/(tabs)')
      console.log('Login successful!');
    }, 1200);
  };

  const handleResendOtp = () => {
    if (loading) return;

    setLoading(true);
    setOtpCode('');
    // Simulate resending OTP
    setTimeout(() => {
      setLoading(false);
      console.log('OTP resent');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      >
        <View className="flex-1 pb-8">
          {/* Hero Section */}
          <View
            style={{ height: heroHeight }}
            className="px-6 pt-8 overflow-hidden"
          >
            <View
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <Image
                source={require('../../assets/images/call-bg.png')}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0)',
                }}
              />
              <LinearGradient
                colors={['rgb(234, 90, 12)', 'rgba(242, 113, 43, 0.95)', 'rgba(249, 128, 63, 0.94)']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
              />
            </View>

            <View className="items-center justify-center flex-1" style={{ position: 'relative' }}>
              <View className="w-52 h-24 items-center justify-center">
                <Image
                  source={require('../../assets/images/logo-white.png')}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                // className='border'
                />
              </View>
              <Animated.View style={animateSecurityBadge} className="mt-4 flex-row items-center gap-2">
                <MaterialCommunityIcons name="phone-lock" size={15} color="#FFEDD5" />
                <Text className="text-sm font-semibold text-orange-50">Secure login</Text>
              </Animated.View>
              <Animated.View style={animateHeading}>
                <Animated.Text
                  className="mt-5 text-center text-3xl font-bold text-teal-800 leading-tight"
                >
                  {step === 'phone' ? 'Welcome to Kasa' : 'Verify your account'}
                </Animated.Text>
              </Animated.View>
              <Animated.View style={animateSubtitle}>
                <Text className="mt-2 text-center text-sm font-medium text-teal-800">
                  {step === 'phone'
                    ? 'Sign in with your phone number to continue.'
                    : `Enter the 6-digit code sent to +233${phoneNumber}`}
                </Text>
              </Animated.View>
              <Animated.View style={animateSecurityBadge} className="mt-4 flex-row items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 border border-white/30">
                <Ionicons
                  name={step === 'phone' ? 'call-outline' : 'shield-checkmark'}
                  size={12}
                  color="#FFFFFF"
                />
                <Text className="text-xs font-semibold text-white">
                  {step === 'phone' ? 'Step 1 of 2' : 'Step 2 of 2'}
                </Text>
              </Animated.View>
            </View>
          </View>

          {/* Form Section */}
          <View className="px-6 mt-6">
            {step === 'phone' ? (
              // PHONE NUMBER STEP
              <View className="gap-6">
                {/* Phone Input Card */}
                <View className="bg-white">
                  {/* Input Header */}
                  <View className="border-b flex-row gap-1 items-center border-gray-200 bg-gray-50/90 px-2 py-3">
                    <Feather name="phone" size={15} color="#EA580C" />
                    {/* <MaterialCommunityIcons name="cellphone-basic" size={20} color="#EA580C" /> */}
                    <Text className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                      Phone Number
                    </Text>
                  </View>

                  {/* Input Field */}
                  <View className="">
                    <View className="flex-row items-center gap-3 bg-gray-50 px-2 py-4">
                      <View className="h-9 w-9 items-center justify-center bg-orange-100" style={{ borderRadius: 20 }}>
                        {/* <Feather name="phone" size={17} color="#EA580C" /> */}
                        <MaterialCommunityIcons name="phone-classic" size={17} color="rgb(236, 77, 24)" />
                      </View>
                      <View className="h-8 w-px bg-gray-200" />
                      <View className="flex-1 flex-row items-center">
                        <Text className="text-lg font-semibold text-gray-800">+233</Text>
                        <TextInput
                          placeholder="XXX XXX XXXX"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="phone-pad"
                          style={{ fontSize: 16 }}
                          className="ml-2 flex-1 font-semibold text-gray-800"
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
                  <View className="flex-row items-center gap-2 border-t border-gray-100 bg-gray-50 px-6 py-3">
                    <Ionicons name="information-circle" size={14} color="#EA580C" />
                    <Text className="flex-1 text-xs text-gray-600">
                      Use digits only. We will validate the number for verification.
                    </Text>
                  </View>
                </View>

                {/* CTA Button */}
                <TouchableOpacity
                  onPress={handlePhoneSubmit}
                  disabled={!sendButtonEnabled}
                  className={`w-full flex-row items-center justify-center gap-2 rounded-xl py-3.5 ${canSendOtp ? 'bg-orange-600/90' : 'bg-gray-200'}`}
                  activeOpacity={0.9}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator size="small" color="white" />
                      <Text className="font-bold text-white">Sending OTP...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="send" size={18} color={sendButtonEnabled ? 'white' : '#9CA3AF'} />
                      <Text className={`font-bold ${sendButtonEnabled ? 'text-white' : 'text-gray-500'}`}>
                        Send OTP
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Info Box */}
                <View className="flex-row gap-3 rounded-lg bg-blue-50 p-4 border border-blue-100">
                  <Feather name="info" size={16} color="#3B82F6" />
                  <Text className="flex-1 text-xs text-gray-700 leading-relaxed">
                    Your number is encrypted and secure. We will never share it with third parties.
                  </Text>
                </View>
              </View>
            ) : (
              // OTP VERIFICATION STEP
              <View className="gap-6">
                {/* OTP Input Card */}
                <View className="bg-white">
                  {/* Input Header */}
                  <View className="border-b flex-row gap-1 items-center border-gray-200 bg-gray-50/90 px-2 py-3">
                    <Ionicons name="shield-checkmark" size={15} color="#EA580C" />
                    <Text className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                      Verification Code
                    </Text>
                  </View>

                  {/* OTP Input Field */}
                  <View>
                    <View className="flex-row items-center gap-3 bg-gray-50 px-2 py-2">
                      {/* <View className="h-9 w-9 items-center justify-center bg-orange-100" style={{ borderRadius: 20 }}>
                        <Ionicons name="shield-checkmark" size={17} color="#EA580C" />
                      </View>
                      <View className="h-8 w-px bg-gray-200" /> */}
                      <View className="flex-1 flex-row items-center">
                        <TextInput
                          placeholder="******"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="number-pad"
                          maxLength={6}
                          style={{ fontSize: 26, letterSpacing: 8 }}
                          className="flex-1 py-3 font-bold text-gray-800 text-center"
                          value={otpCode}
                          onChangeText={handleOtpChange}
                          editable={!loading}
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
                  <View className="flex-row items-center gap-2 border-t border-gray-100 bg-gray-50 px-6 py-3">
                    <Text className="flex-1 text-xs text-gray-600">
                      Check your SMS for the 6-digit code
                    </Text>
                  </View>
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                  onPress={handleOtpVerify}
                  disabled={!verifyButtonEnabled}
                  className={`w-full flex-row items-center justify-center gap-2 rounded-xl py-4 ${canVerifyOtp ? 'bg-orange-600/90' : 'bg-gray-200'}`}
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
                        color={verifyButtonEnabled ? 'white' : '#9CA3AF'}
                      />
                      <Text className={`font-bold ${verifyButtonEnabled ? 'text-white' : 'text-gray-500'}`}>
                        Verify & Login
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Change Phone Number */}
                <TouchableOpacity
                  onPress={() => {
                    setStep('phone');
                    setOtpCode('');
                  }}
                  className="flex-row items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 py-3"
                  activeOpacity={0.85}
                >
                  <Feather name="edit-2" size={16} color="#EA580C" />
                  <Text className="font-semibold text-orange-700">Change Phone Number</Text>
                </TouchableOpacity>

                {/* Resend OTP */}
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="text-xs text-gray-600">Did not receive code?</Text>
                  <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                    <Text className="text-xs font-bold text-orange-600 underline">
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Bottom Section - Terms & Info */}
          <View className="px-6 py-4">
            <Text className="text-center text-xs text-gray-500 leading-relaxed">
              By logging in, you agree to our{' '}
              <Text className="font-semibold text-gray-700">Terms of Service</Text> and{' '}
              <Text className="font-semibold text-gray-700">Privacy Policy</Text>
            </Text>

            {/* Security Badge */}
            <View className="mt-4 flex-row items-center justify-center gap-1.5 rounded-full  px-3 py-2 ">
              <Ionicons name="lock-closed" size={12} color="#6B7280" />
              <Text className="text-xs font-semibold text-gray-700">Secure by design</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}