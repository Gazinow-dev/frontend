#!/usr/bin/env bash
#
# 물리 iOS 기기에 빌드 → 설치 → 실행 (devicectl 사용)
#
# RN CLI 15.x(run-ios)는 물리 기기 설치를 ios-deploy로만 처리하는데,
# ios-deploy는 iOS 17+ 기기를 지원하지 않아 "Installing and launching..."에서 멈춘다.
# 이 스크립트는 Xcode와 동일하게 Apple의 devicectl(CoreDevice)로 설치/실행한다.
#
# 사용법:
#   yarn ios:device                      # Release(기본) + .env.production, Metro 불필요(자체 번들)
#   CONFIGURATION=Debug yarn ios:device  # Debug, 별도 터미널에서 `yarn start`(Metro) 필요
#   ENVFILE=.env.development yarn ios:device
#
set -euo pipefail

cd "$(dirname "$0")/.."

SCHEME="gazinow"
WORKSPACE="ios/gazinow.xcworkspace"
CONFIGURATION="${CONFIGURATION:-Release}"
export ENVFILE="${ENVFILE:-.env.production}"
DERIVED="ios/build/device-dd"
DEVICES_JSON="/tmp/gazinow-devices.json"

# 1) 연결된 기기 자동 탐지
echo "📱 기기 검색 (devicectl)..."
xcrun devicectl list devices --json-output "$DEVICES_JSON" >/dev/null 2>&1 || true

DEVICE_ID=$(node -e '
  let d; try { d = require(process.argv[1]); } catch (e) { process.exit(2); }
  const devs = (d.result && d.result.devices) || [];
  const dev =
    devs.find(x => (x.connectionProperties || {}).tunnelState === "connected") ||
    devs.find(x => (x.connectionProperties || {}).pairingState === "paired") ||
    devs[0];
  if (!dev) process.exit(3);
  process.stdout.write(dev.identifier);
' "$DEVICES_JSON" 2>/dev/null) || {
  echo "❌ 연결된 iOS 기기를 찾지 못했습니다. USB로 연결하고 '이 컴퓨터를 신뢰'를 허용하세요."
  exit 1
}

DEVICE_NAME=$(node -e '
  const d = require(process.argv[1]);
  const x = (d.result.devices || []).find(v => v.identifier === process.argv[2]);
  process.stdout.write((x && x.deviceProperties && x.deviceProperties.name) || process.argv[2]);
' "$DEVICES_JSON" "$DEVICE_ID")
echo "📱 대상: $DEVICE_NAME ($DEVICE_ID)"

# 2) 빌드 (기기용)
echo "🛠  빌드 — $CONFIGURATION (ENVFILE=$ENVFILE)..."
xcrun xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -destination "generic/platform=iOS" \
  -derivedDataPath "$DERIVED" \
  -allowProvisioningUpdates \
  build

# 3) 산출물(.app) + 번들 ID 확인 (빌드 결과에서 직접 읽음)
APP_PATH=$(ls -d "$DERIVED/Build/Products/$CONFIGURATION-iphoneos/"*.app 2>/dev/null | head -1)
[ -d "$APP_PATH" ] || { echo "❌ .app 산출물을 찾지 못했습니다: $DERIVED"; exit 1; }
BUNDLE_ID=$(/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "$APP_PATH/Info.plist")
echo "📦 $APP_PATH"
echo "🆔 $BUNDLE_ID"

# 4) 설치 → 실행 (devicectl)
echo "⬇️  설치..."
xcrun devicectl device install app --device "$DEVICE_ID" "$APP_PATH"

echo "🚀 실행..."
xcrun devicectl device process launch --device "$DEVICE_ID" "$BUNDLE_ID"

echo "✅ 완료 — $DEVICE_NAME 에서 실행됨"
if [ "$CONFIGURATION" = "Debug" ]; then
  echo "ℹ️  Debug 빌드입니다. JS 번들을 위해 다른 터미널에서 'yarn start'(Metro)를 켜두세요."
fi
