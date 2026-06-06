#!/usr/bin/env bash
set -euo pipefail

# =========================
# Project-specific defaults
# =========================
IOS_SCHEME="gazinow"
IOS_WORKSPACE="ios/gazinow.xcworkspace"

# =========================
# Detect IDs
# =========================
detect_android_app_id() {
  local gradle_file="android/app/build.gradle"
  if [[ -f "$gradle_file" ]]; then
    # applicationId "com.xxx"
    local id
    id=$(grep -E 'applicationId\s+"[^"]+"' "$gradle_file" | head -n 1 | sed -E 's/.*applicationId\s+"([^"]+)".*/\1/')
    if [[ -n "${id:-}" ]]; then
      echo "$id"
      return
    fi
  fi
  echo ""
}

detect_ios_bundle_id() {
  local pbxproj="ios/gazinow.xcodeproj/project.pbxproj"
  if [[ -f "$pbxproj" ]]; then
    # PRODUCT_BUNDLE_IDENTIFIER = com.xxx;
    # $(...) 같은 변수 아닌 실제 값 우선
    local id
    id=$(grep -E 'PRODUCT_BUNDLE_IDENTIFIER\s*=\s*[^;]+' "$pbxproj" \
      | grep -v '\$' \
      | head -n 1 \
      | sed -E 's/.*=\s*([^;]+);/\1/' \
      | tr -d ' ')
    if [[ -n "${id:-}" ]]; then
      echo "$id"
      return
    fi
  fi
  echo ""
}

ANDROID_APP_ID="$(detect_android_app_id)"
IOS_BUNDLE_ID="$(detect_ios_bundle_id)"

echo "📌 Detected ANDROID_APP_ID: ${ANDROID_APP_ID:-"(not found)"}"
echo "📌 Detected IOS_BUNDLE_ID:    ${IOS_BUNDLE_ID:-"(not found)"}"

# =========================
# Kill / Clean caches
# =========================
echo "🧯 Kill Metro/Node..."
pkill -f "react-native start" || true
pkill -f "metro" || true
pkill -f "node.*metro" || true

if command -v watchman >/dev/null 2>&1; then
  echo "🧹 watchman watch-del-all..."
  watchman watch-del-all || true
fi

echo "🧹 Remove JS caches..."
rm -rf "$TMPDIR/metro-"* "$TMPDIR/haste-map-"* "$TMPDIR/react-"* 2>/dev/null || true
rm -rf ~/.metro 2>/dev/null || true

echo "🧹 Remove node_modules..."
rm -rf node_modules

echo "📦 Install JS deps..."
if [[ -f yarn.lock ]]; then
  yarn install
else
  npm ci || npm install
fi

# =========================
# Android: clean + uninstall
# =========================
echo "🤖 Android clean..."
rm -rf android/.gradle android/build android/app/build
( cd android && ./gradlew clean )

if command -v adb >/dev/null 2>&1; then
  if [[ -n "${ANDROID_APP_ID:-}" ]]; then
    echo "📵 Android uninstall: $ANDROID_APP_ID"
    adb uninstall "$ANDROID_APP_ID" || true
  else
    echo "⚠️ ANDROID_APP_ID 못 찾아서 uninstall 스킵 (android/app/build.gradle 확인)"
  fi
else
  echo "⚠️ adb 없음. Android uninstall 스킵"
fi

# =========================
# iOS: pods/derivedData clean + uninstall(sim)
# =========================
echo "🍏 iOS clean..."
rm -rf ios/Pods ios/Podfile.lock ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData/* 2>/dev/null || true

if command -v pod >/dev/null 2>&1; then
  ( cd ios && pod install )
else
  echo "⚠️ CocoaPods 없음. (pod install 수동 필요)"
fi

if command -v xcrun >/dev/null 2>&1; then
  # booted simulator에서 앱 삭제
  if [[ -n "${IOS_BUNDLE_ID:-}" ]]; then
    echo "📵 iOS uninstall (sim booted): $IOS_BUNDLE_ID"
    xcrun simctl uninstall booted "$IOS_BUNDLE_ID" || true
  else
    echo "⚠️ IOS_BUNDLE_ID 못 찾아서 sim uninstall 스킵 (ios/gazinow.xcodeproj/project.pbxproj 확인)"
  fi
fi

echo ""
echo "✅ FULL CLEAN DONE."
echo "-------------------"
echo "Now reinstall/run:"
echo "  - Android: npx react-native run-android"
echo "  - iOS:     npx react-native run-ios --scheme \"$IOS_SCHEME\""