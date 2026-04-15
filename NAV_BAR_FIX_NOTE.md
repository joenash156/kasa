# Android Navigation Bar Background Fix

## What the issue was

The Android navigation bar background was staying light even when the app theme changed to dark or system-dark.

There were two separate causes:

1. The JavaScript API from `expo-navigation-bar` was refusing to set the background color.
2. Android itself was still allowed to enforce navigation bar contrast, which can wash the bar back to a light appearance on some devices.

That is why the warning kept appearing:

`setBackgroundColorAsync` is not supported with edge-to-edge enabled.

Even though the project was configured to avoid edge-to-edge, Expo's JavaScript wrapper still detected it as enabled and skipped the background color update.

## Why the warning happened

The warning did not come from your own code directly. It came from the `expo-navigation-bar` JavaScript layer.

That wrapper checks an edge-to-edge flag before it calls the native Android navigation bar API. In this project, that check was producing a false positive, so:

1. The wrapper logged the warning.
2. The wrapper returned early.
3. The native background color was never updated.

Because of that, only the button style sometimes changed, while the bar background itself often remained light.

## How it was fixed

The fix was done in three parts.

### 1. Bypass the false-positive JavaScript wrapper

File: [components/ThemeAwareNavigationBar.tsx](/home/joshua/Desktop/Projects/mobile_apps/kasa/components/ThemeAwareNavigationBar.tsx:1)

Instead of calling the `expo-navigation-bar` JavaScript helper, the code now calls the native `ExpoNavigationBar` module directly.

That avoids the incorrect edge-to-edge check and allows the app to:

1. Force navigation bar position to `relative`
2. Set the navigation bar background color
3. Set the navigation bar button style

The color is based on the app's resolved theme preference, not the device theme.

### 2. Keep Android out of edge-to-edge layout

File: [android/app/src/main/java/com/joenash156/kasa/MainActivity.kt](/home/joshua/Desktop/Projects/mobile_apps/kasa/android/app/src/main/java/com/joenash156/kasa/MainActivity.kt:17)

The activity already used:

`WindowCompat.setDecorFitsSystemWindows(window, true)`

That keeps the app in a normal non-edge-to-edge layout so the navigation bar can have a solid background color.

### 3. Disable Android navigation bar contrast enforcement

Files:

- [android/app/src/main/java/com/joenash156/kasa/MainActivity.kt](/home/joshua/Desktop/Projects/mobile_apps/kasa/android/app/src/main/java/com/joenash156/kasa/MainActivity.kt:26)
- [android/app/src/main/res/values/styles.xml](/home/joshua/Desktop/Projects/mobile_apps/kasa/android/app/src/main/res/values/styles.xml:2)

Android contrast enforcement can override the bar color and push it toward a light appearance.

It was disabled in both runtime and theme configuration:

1. `window.isNavigationBarContrastEnforced = false`
2. `android:enforceNavigationBarContrast` set to `false`

## Result

After these changes:

1. The warning stopped from our navigation bar code path
2. The navigation bar background started following the app theme correctly
3. The button icons still switch between light and dark for visibility

## Important note

Because part of the fix was native Android code, a full Android rebuild was required.

A normal Metro reload or fast refresh was not enough to apply the native navigation bar behavior changes.
