import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  const phoneDigits = phoneNumber.replace(/\D/g, '');
  const canSendOtp = phoneDigits.length >= 9;
  const canVerifyOtp = otpCode.length === 6;
  const sendButtonEnabled = canSendOtp && !loading;
  const verifyButtonEnabled = canVerifyOtp && !loading;

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
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      >
        {/* Header with Logo/Brand */}
        <View className="flex-1 justify-between pt-8 pb-8">
          {/* Top Section */}
          <View className="px-6">
            {/* Animated Logo Icon */}
            <View className="mb-12">
              <View className="flex-col items-center gap-3 self-center">
                <View className="h-16 w-16 items-center justify-center rounded-2xl ">
                  <Image
                    source={require('../../assets/images/logo.png')}
                    style={{ width: 200, height: 200, borderRadius: 16 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="phone-lock" size={14} color="#EA580C" />
                  <Text className="text-xs font-semibold text-gray-600">Secure login</Text>
                </View>
              </View>
            </View>

            {/* Step indicator (static) */}
            <View className="mb-6">
              <View className="flex-row items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-3 py-1.5 self-center">
                <Ionicons
                  name={step === 'phone' ? 'call-outline' : 'shield-checkmark'}
                  size={12}
                  color="#EA580C"
                />
                <Text className="text-xs font-bold text-orange-700">
                  {step === 'phone' ? 'Step 1 of 2' : 'Step 2 of 2'}
                </Text>
              </View>
            </View>

            {/* Headline */}
            <Text className="mb-2 text-3xl font-bold text-gray-900 leading-tight text-center">
              {step === 'phone' ? 'Enter Your Phone' : 'Verify with OTP'}
            </Text>

            {/* Subheadline */}
            <Text className="mb-8 text-base font-medium text-gray-600 leading-relaxed text-center">
              {step === 'phone'
                ? 'We will send a verification code to your phone number'
                : `Sent to +233${phoneNumber}`}
            </Text>

            {/* Form Section */}
            {step === 'phone' ? (
              // PHONE NUMBER STEP
              <View className="gap-6">
                {/* Phone Input Card */}
                <View className="rounded-2xl border border-gray-200 bg-white">
                  {/* Input Header */}
                  <View className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                    <Text className="text-xs font-bold uppercase tracking-wide text-gray-700">
                      Phone Number
                    </Text>
                  </View>

                  {/* Input Field */}
                  <View className="flex-row items-center gap-3 px-6 py-4">
                    <Feather name="phone" size={20} color="#EA580C" />
                    <View className="flex-1 flex-row items-center">
                      <Text className="text-lg font-semibold text-gray-600">+233</Text>
                      <TextInput
                        placeholder="XXX XXX XXXX"
                        placeholderTextColor="#D1D5DB"
                        keyboardType="phone-pad"
                        style={{ fontSize: 15.5 }}
                        className="ml-2 flex-1 font-semibold text-gray-600"
                        value={phoneNumber}
                        onChangeText={handlePhoneChange}
                        maxLength={15}
                        editable={!loading}
                      />
                    </View>
                    {canSendOtp && (
                      <View className="h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                        <Feather name="check" size={14} color="white" />
                      </View>
                    )}
                  </View>

                  {/* Helper Text */}
                  <View className="flex-row items-center gap-2 border-t border-gray-200 bg-gray-50 px-6 py-3">
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
                  className={`w-full flex-row items-center justify-center gap-2 rounded-xl py-4 ${canSendOtp ? 'bg-orange-600' : 'bg-gray-200'}`}
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
                <View className="rounded-2xl bg-white border border-gray-200">
                  {/* Input Header */}
                  <View className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                    <Text className="text-xs font-bold uppercase tracking-wide text-gray-700">
                      Verification Code
                    </Text>
                  </View>

                  {/* OTP Input Field */}
                  <View className="gap-4 px-6 py-6">
                    <View className="flex-row items-center gap-3">
                      <Ionicons name="shield-checkmark" size={20} color="#EA580C" />
                      <TextInput
                        placeholder="******"
                        placeholderTextColor="#D1D5DB"
                        keyboardType="number-pad"
                        maxLength={6}
                        style={{ fontSize: 26, letterSpacing: 8 }}
                        className="flex-1 py-3 font-bold text-gray-600 text-center"
                        value={otpCode}
                        onChangeText={handleOtpChange}
                        editable={!loading}
                      />
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
                  <View className="flex-row items-center gap-2 border-t border-gray-200 bg-gray-50 px-6 py-3">
                    <Text className="flex-1 text-xs text-gray-600">
                      Check your SMS for the 6-digit code
                    </Text>
                  </View>
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                  onPress={handleOtpVerify}
                  disabled={!verifyButtonEnabled}
                  className={`w-full flex-row items-center justify-center gap-2 rounded-xl py-4 ${canVerifyOtp ? 'bg-orange-600' : 'bg-gray-200'}`}
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
            <View className="mt-4 flex-row items-center justify-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 border border-gray-200">
              <Ionicons name="lock-closed" size={12} color="#6B7280" />
              <Text className="text-xs font-semibold text-gray-700">Secure by design</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}