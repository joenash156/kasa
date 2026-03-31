# 🚀 Authentication Implementation - Next Steps

## Immediate Actions Required

### 1. Create `.env` File from Example

```bash
cd c:\Users\joena\Desktop\My Web Projects\mobile_apps\kasa
cp .env.example .env
```

Then edit `.env` and add:

```env
EXPO_PUBLIC_API_URL=https://your-backend-server.com/caller/api
EXPO_PUBLIC_API_KEY=your-admin-api-key-here
```

---

### 2. Install Secure Token Storage

Choose ONE of these:

**Option A: Using Expo Secure Store (Recommended for React Native)**

```bash
npm install expo-secure-store
```

Then update [services/auth.service.ts](./services/auth.service.ts):

```typescript
// Uncomment these lines
import * as SecureStore from "expo-secure-store";

// In saveAuthToken():
await SecureStore.setItemAsync("authToken", token);

// In getAuthToken():
return await SecureStore.getItemAsync("authToken");

// In clearAuthTokens():
await SecureStore.deleteItemAsync("authToken");
```

**Option B: Using AsyncStorage**

```bash
npm install @react-native-async-storage/async-storage
```

Then update similarly with AsyncStorage methods.

---

### 3. Implement Login Screen

Update [app/(auth)/login.tsx](<./app/(auth)/login.tsx>):

```typescript
import { authService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [sessionId, setSessionId] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  // Step 1: Request OTP
  const { data: otpData, execute: requestOtp, error: otpError } =
    useApi(authService.requestOtp);

  const handleRequestOtp = async () => {
    try {
      const response = await requestOtp(phone);
      setSessionId(response.data.sessionId);
      setStep("otp");
      // Show OTP in dev mode
      if (response.data.otp) {
        Alert.alert("Dev Mode OTP: " + response.data.otp);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to request OTP");
    }
  };

  // Step 2: Verify OTP and login
  const { execute: verifyOtp, error: verifyError } =
    useApi(authService.verifyOtp);

  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp({ phone, otp });
      // Login successful!
      await login(
        response.data.user || {},
        response.data.caller_id,
        response.data.token
      );
      router.replace("/(tabs)/");
    } catch (error) {
      Alert.alert("Error", "OTP verification failed");
    }
  };

  return (
    <View>
      {step === "phone" ? (
        <>
          <TextInput
            placeholder="Phone number (0551234567)"
            value={phone}
            onChangeText={setPhone}
          />
          <Button
            title="Get OTP"
            onPress={handleRequestOtp}
          />
          {otpError && <Text>{otpError}</Text>}
        </>
      ) : (
        <>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
          />
          <Button
            title="Verify & Login"
            onPress={handleVerifyOtp}
          />
          {verifyError && <Text>{verifyError}</Text>}
        </>
      )}
    </View>
  );
}
```

---

### 4. Test the Flow in Dev Mode

With `EXPO_PUBLIC_APP_ENV=development`:

```
1. Enter phone: 0551234567
2. Press "Get OTP"
3. See OTP in Alert (dev mode only)
4. Enter OTP
5. Press "Verify & Login"
6. See redirect to home (/(tabs)/)
7. Token should be saved to SecureStore
```

---

### 5. Test Logout Flow

Add logout button to profile screen:

```typescript
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const { logout } = useAuth();

  return (
    <View>
      {/* Profile content */}
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

Test:

```
1. Click logout button
2. Verify redirect to login screen
3. Try accessing tabs directly - should redirect to login
4. Token should be cleared from storage
```

---

### 6. Verify Route Protection

Try accessing tabs without logging in:

- App should redirect to login screen
- After login, tabs become accessible
- After logout, tabs become inaccessible again

---

## File Reference

| File                                                   | Purpose              | Status             |
| ------------------------------------------------------ | -------------------- | ------------------ |
| [services/auth.service.ts](./services/auth.service.ts) | Auth API calls       | ✅ Complete        |
| [services/api.ts](./services/api.ts)                   | API interceptors     | ✅ Complete        |
| [context/AuthContext.tsx](./context/AuthContext.tsx)   | Auth state           | ✅ Complete        |
| [app/(tabs)/\_layout.tsx](<./app/(tabs)/_layout.tsx>)  | Route protection     | ✅ Complete        |
| [app/(auth)/login.tsx](<./app/(auth)/login.tsx>)       | Login UI             | ⚠️ TODO: Implement |
| [.env](./.env)                                         | Environment config   | ⚠️ TODO: Create    |
| [AUTH_IMPLEMENTATION.md](./AUTH_IMPLEMENTATION.md)     | Implementation guide | ✅ Complete        |

---

## Common Issues & Solutions

### Issue: "EXPO_PUBLIC_API_URL is undefined"

**Solution:** Not set in `.env` file

```bash
# Add to .env
EXPO_PUBLIC_API_URL=https://your-api.com/caller/api
```

### Issue: "Token not being saved"

**Solution:** SecureStore not installed or token storage not implemented

```bash
npm install expo-secure-store
```

Then uncomment the SecureStore code in auth.service.ts

### Issue: "Still logged in after logout"

**Solution:** Token not being cleared from storage

- Verify `clearAuthTokens()` is being called
- Check that SecureStore.deleteItemAsync is actually running

### Issue: "Loop redirecting to login"

**Solution:** `isAuthenticated` is always false

- Check login() is being called with correct data
- Verify token is saved before routing
- Add console.logs to debug isAuthenticated value

### Issue: "API requests don't have auth header"

**Solution:** Token retrieval from SecureStore failing

- Add error logging in auth.service.getAuthToken()
- Verify SecureStore is accessible
- Check X-API-Key header is being added

---

## Additional Notes

### Token Expiration (Future Enhancement)

The API currently doesn't support token refresh. When token expires (24 hours):

1. API returns 401
2. Request interceptor catches it
3. User is logged out
4. User must enter phone and OTP again

To implement refresh token flow later:

- Add `POST /auth/refresh-token` endpoint
- Store refreshToken alongside token
- Implement auto-retry with new token on 401

### Session Persistence (Already Implemented)

With SecureStore:

- Token persists across app restarts
- User stays logged in until logout
- 401 errors clear the token
- No need to re-login every app launch

### Testing Without Backend

For initial UI testing without backend:

- Mock the API responses in useApi hook
- Or use a fake API service temporarily
- Replace when backend is ready

---

## Deployment Checklist

Before production deployment:

- [ ] `.env` file created with real API URL and API Key
- [ ] SecureStore installed and token storage working
- [ ] Login screen UI implemented
- [ ] Logout button visible on profile screen
- [ ] Tested login → logout → login flow
- [ ] Verified tab routes redirect to login if not authenticated
- [ ] 401 errors properly redirect to login
- [ ] Token persists across app restarts
- [ ] No console errors or warnings
- [ ] Build succeeds: `eas build`

---

## Resources

- [API Documentation](./services/api-doc.txt)
- [Auth Implementation Details](./AUTH_IMPLEMENTATION.md)
- [API Architecture Guide](./API_ARCHITECTURE.md)
- [Integration Examples](./API_INTEGRATION_EXAMPLES.ts)

---

**Status: Ready for login screen implementation!**

Next: Copy the login screen code example above and implement it.
