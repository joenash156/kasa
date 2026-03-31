#!/usr/bin/env bash

# Kasa API Setup Checklist
# Run this file to verify your API setup is complete

echo "🔍 Kasa API Setup Verification"
echo "=============================="
echo ""

# Check 1: Service files exist
echo "✓ Checking service files..."
files_to_check=(
  "services/api.ts"
  "services/auth.service.ts"
  "services/user.service.ts"
  "services/calls.service.ts"
  "services/api.utils.ts"
  "services/index.ts"
  "types/api.types.ts"
  "hooks/useApi.ts"
  "hooks/useApi.advanced.ts"
)

missing_files=0
for file in "${files_to_check[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (MISSING)"
    missing_files=$((missing_files + 1))
  fi
done

echo ""
if [ $missing_files -eq 0 ]; then
  echo "✅ All service files are present!"
else
  echo "⚠️  $missing_files file(s) missing. Please create them."
fi

echo ""
echo "📋 Manual Checklist:"
echo "===================="
echo ""
echo "Phase 1: Configuration"
echo "  [ ] Set EXPO_PUBLIC_API_URL environment variable"
echo "  [ ] Or update baseURL in services/api.ts"
echo "  [ ] Get backend API documentation"
echo ""

echo "Phase 2: Authentication"
echo "  [ ] Install expo-secure-store: npm install expo-secure-store"
echo "  [ ] Implement getStoredAuthToken() in services/api.ts"
echo "  [ ] Update auth flow with actual endpoints"
echo "  [ ] Test OTP request/verify flow"
echo ""

echo "Phase 3: Integration"
echo "  [ ] Replace mock data with service calls"
echo "  [ ] Update app/(tabs)/logs.tsx with callsService.getCallLogs()"
echo "  [ ] Update components/CallForm.tsx with authService calls"
echo "  [ ] Update app/(tabs)/profile.tsx with userService.getUserProfile()"
echo "  [ ] Test all screens with real API"
echo ""

echo "Phase 4: Production"
echo "  [ ] Add error boundaries to async operations"
echo "  [ ] Implement token refresh flow"
echo "  [ ] Add loading states to all screens"
echo "  [ ] Test 401, 403, 404, 500 error scenarios"
echo "  [ ] Add analytics logging for API errors"
echo ""

echo "✨ Quick Start:"
echo "==============="
echo "1. Import services: import { authService } from '@/services'"
echo "2. Use hook: const { data, error, execute } = useApi(authService.requestOtp)"
echo "3. Call API: await execute('+233551234567')"
echo "4. Handle result: console.log(data) or console.log(error)"
echo ""

echo "📚 Documentation:"
echo "=================="
echo "- API_QUICKSTART.md - This file, start here"
echo "- API_ARCHITECTURE.md - Full architecture documentation"
echo "- API_INTEGRATION_EXAMPLES.ts - 10 copy-paste code examples"
echo ""

echo "✅ Setup Complete!"
echo "When ready, share EXPO_PUBLIC_API_URL and backend API docs."
