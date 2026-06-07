#!/usr/bin/env bash
#
# 물리 iOS 기기에 빌드 → 설치 → 실행 (devicectl 사용)
#
# RN CLI 15.x(run-ios)는 물리 기기 설치를 ios-deploy로만 처리하는데,
# ios-deploy는 iOS 17+ 기기를 지원하지 않아 "Installing and launching..."에서 멈춘다.
# 이 스크립트는 Xcode와 동일하게 Apple의 devicectl(CoreDevice)로 설치/실행한다.
#
# 기본은 Debug + Metro 자동 실행 → Hot Reload 지원.
#
# 사용법:
#   yarn ios:device                         # Debug + .env.development, Metro 자동 실행(Hot Reload)
#   ENVFILE=.env.production yarn ios:device # 다른 env로 Debug 실행
#   CONFIGURATION=Release yarn ios:device   # Release(자체 번들, Metro/Hot Reload 없음)
#
set -euo pipefail

cd "$(dirname "$0")/.."

SCHEME="gazinow"
WORKSPACE="ios/gazinow.xcworkspace"
CONFIGURATION="${CONFIGURATION:-Debug}"
export ENVFILE="${ENVFILE:-.env.development}"
DERIVED="ios/build/device-dd"
DEVICES_JSON="/tmp/gazinow-devices.json"
METRO_PORT="${RCT_METRO_PORT:-8081}"

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

# 2) Debug면 Metro(번들 서버) 보장 → Hot Reload
#    Debug 빌드는 JS를 번들에 넣지 않고 런타임에 Metro에서 받아오므로 Metro가 떠 있어야 한다.
if [ "$CONFIGURATION" = "Debug" ]; then
  if lsof -i ":$METRO_PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "⚡️ Metro 이미 실행 중 (:$METRO_PORT)"
  else
    echo "⚡️ Metro 시작 (백그라운드, ENVFILE=$ENVFILE) → /tmp/gazinow-metro.log"
    ENVFILE="$ENVFILE" nohup npx react-native start --reset-cache >/tmp/gazinow-metro.log 2>&1 &
    disown || true
    # Metro 기동 대기 (status 200 뜰 때까지, 최대 ~30초)
    for _ in $(seq 1 30); do
      if curl -s "http://localhost:${METRO_PORT}/status" 2>/dev/null | grep -q packager-status:running; then
        echo "⚡️ Metro 준비 완료"
        break
      fi
      sleep 1
    done
  fi
fi

# 3) 빌드 (기기용)
echo "🛠  빌드 — $CONFIGURATION (ENVFILE=$ENVFILE)..."
xcrun xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -destination "generic/platform=iOS" \
  -derivedDataPath "$DERIVED" \
  -allowProvisioningUpdates \
  build

# 4) 산출물(.app) + 번들 ID 확인 (빌드 결과에서 직접 읽음)
APP_PATH=$(ls -d "$DERIVED/Build/Products/$CONFIGURATION-iphoneos/"*.app 2>/dev/null | head -1)
[ -d "$APP_PATH" ] || { echo "❌ .app 산출물을 찾지 못했습니다: $DERIVED"; exit 1; }
BUNDLE_ID=$(/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "$APP_PATH/Info.plist")
echo "📦 $APP_PATH"
echo "🆔 $BUNDLE_ID"

# 5) 설치 → 실행 (devicectl)
echo "⬇️  설치..."
xcrun devicectl device install app --device "$DEVICE_ID" "$APP_PATH"

echo "🚀 실행..."
xcrun devicectl device process launch --device "$DEVICE_ID" "$BUNDLE_ID"

echo "✅ 완료 — $DEVICE_NAME 에서 실행됨"
if [ "$CONFIGURATION" = "Debug" ]; then
  echo "⚡️ Hot Reload 활성 (Metro 연결). 기기와 Mac이 같은 Wi-Fi인지 확인하세요."
  echo "   JS가 안 받아지면 기기에서 앱 흔들기 → Settings에서 번들러 주소를 Mac IP로 지정."
fi
