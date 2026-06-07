# Android 16 KB 페이지 지원 — 업그레이드 스코핑

> 작성일: 2026-06-07 · 대상: GaziNow (RN 0.73.4) · 트리거: Play Console "Your app does not support 16 KB memory page sizes"

## 1. 문제 요약

Google Play는 **Android 15+(targetSdk 35)를 타깃하는 앱/업데이트**에 대해 16 KB 메모리 페이지 지원을 필수로 요구한다(2025-11-01 시행). 우리 앱은 `targetSdkVersion = 35`라 적용 대상이며, AAB 내 native `.so`들이 16 KB(0x4000) 정렬을 만족해야 한다.

현재 `targetSdk`를 34로 낮춰 회피하는 방법은 **불가** — Play가 이미 targetSdk 35를 필수로 요구(2025-08 마감)하기 때문.

## 2. 진단 결과

`app-release.aab`(v1.4.0)의 `arm64-v8a` 라이브러리 **61개 중 59개가 4 KB(0x1000) 정렬**.

| 정렬 | 개수 | 라이브러리 출처 |
|---|---|---|
| ✅ 0x4000 (16KB) | 2 | `libsentry.so`, `libsentry-android.so` — @sentry/react-native 6.19.0 |
| ❌ 0x1000 (4KB) | 59 | **전부 React Native가 배포하는 prebuilt** |

미정렬 59개 분류:
- **RN core** (`libreact_*`, `librrc_*`, `libjsi`, `libfbjni`, `libfb`, `libfolly_runtime`, `libglog`, `libyoga`, `libfabricjni`, `libturbomodulejsijni`, `libuimanagerjni`, `libreactnativejni`, `librninstance`, `libreactnativeblob` 등) → `react-android-0.73.4` AAR(prebuilt)
- **Hermes** (`libhermes.so`, `libhermes_executor.so`) → `hermes-android-0.73.4` AAR(prebuilt). 확인됨: `libhermes.so` LOAD align = `0x1000`
- **Fresco/이미지** (`libimagepipeline`, `libnative-filters`, `libnative-imagetranscoder`) → RN에 내장된 이미지 로더
- **libc++_shared.so** → 빌드에 쓰인 NDK(r25)에서 번들

### 핵심 결론
미정렬 `.so`는 **100% React Native 자체 산출물**(+ NDK의 libc++)이다. 서드파티 native 모듈(notifee, firebase, gesture-handler, screens, svg, webview, date-picker 등)은 **미정렬 `.so`를 하나도 만들지 않는다**(대부분 Java/Kotlin-only이거나 이미 정렬됨). 따라서:

> **16 KB 대응 = React Native 업그레이드.** prebuilt `.so`는 사후 재정렬이 불가능하므로 설정 변경(NDK 범프 등)만으로는 해결되지 않는다.

## 3. 권장 타깃

| 항목 | 현재 | 타깃 | 비고 |
|---|---|---|---|
| react-native | 0.73.4 | **0.77.x (최신 patch)** | 0.77+는 16KB 정렬 prebuilt 배포 + NDK 27 사용. **업그레이드 후 반드시 재검증**(§6) |
| react | 18.2.0 | 18.3.1 | 0.77이 요구. (0.78+는 React 19라 점프 더 큼 → 0.77이 최소 변경) |
| New Architecture | off | **off 유지** | 0.77에서 old arch 아직 지원. 깨짐 최소화 목적. (단, 향후 deprecated) |
| NDK | 25.1.x | 27.x | 0.77 기본값. libc++_shared 16KB 정렬됨 |
| AGP / Gradle | 8.6.0 / 8.7 | 0.77 템플릿 기준(8.7+/8.10+) | upgrade-helper 따라감 |

> RN 0.77로 가면 RN이 배포하는 react-android·hermes-android·fresco·libc++가 모두 16KB 정렬로 교체되어 **59개 미정렬이 일괄 해소**될 것으로 예상. (반드시 §6로 실측 확인)

## 4. 의존성 매트릭스

### A. 16 KB `.so`에 직접 관여 — RN 업그레이드로 자동 해소
- `react-native`, `hermes`(RN 종속), Fresco(RN 내장), `libc++_shared`(NDK)
- `@sentry/react-native` 6.19.0 → **이미 16KB**. RN 0.77 호환만 확인(6.x 호환 OK)

### B. `.so` 미관여, 그러나 RN 0.77 호환 위해 버전 점검 필요
> 아래 타깃 버전은 "RN 0.77 + old arch 호환" 기준 추정치 — 업그레이드 시 각 릴리즈 노트로 **정확 버전 확정 필요**.

| 패키지 | 현재 | 점검 방향 |
|---|---|---|
| react-native-screens | 3.29.0 | 4.x (RN 0.77 대응) |
| react-native-safe-area-context | 4.12.0 | 4.14+ / 5.x |
| react-native-gesture-handler | 2.16.0 | 2.20+ |
| react-native-svg | 15.0.0 | 15.8+ |
| react-native-webview | 13.8.1 | 13.12+ |
| react-native-screens/date-picker | 4.4.2 | 5.x |
| @react-native-firebase/* | 20.3.0 | 21.x (RN 0.76+ 지원선) |
| @notifee/react-native | 7.8.2 | 9.x 호환 확인 |
| lottie-react-native | 6.7.0 | 7.x 검토 |
| @react-native-async-storage/async-storage | 2.2.0 | 현행 OK 추정 |
| nativewind | 2.0.11 | 2.x 유지(메이저 업 지양) |
| @react-native/* (devDeps) | 0.73.x | **0.77.x로 RN과 동기화 필수** |
| metro-react-native-babel-preset | 0.76.8 | **제거**(@react-native/babel-preset로 대체됨) |

### C. JS-only, 영향 적음
redux/toolkit, react-redux, react-query, axios, dayjs, lodash, classname, react-native-config, react-native-status-bar-height, toast-message, shadow-2 등 — RN 0.77에서 대체로 그대로 동작. lint/build 단계에서 확인.

## 5. 단계별 계획

1. **브랜치**: `chore/rn-077-16kb` 생성 (현재 `ios-sdk-upgrade`와 별개로)
2. **RN 코어 업그레이드**: React Native Upgrade Helper(0.73.4 → 0.77.x) diff 적용 — `android/`, `ios/`, `package.json`, `babel/metro` 설정
   - `newArchEnabled=false` 유지, `hermesEnabled=true` 유지
   - NDK/AGP/Gradle 버전 0.77 템플릿에 맞춤
3. **devDeps 동기화**: `@react-native/*` 0.77.x, `metro-react-native-babel-preset` 제거
4. **native 모듈 호환 버전 적용**(§4-B) — 한 번에 올리고 빌드 깨지는 것부터 해결
5. **iOS 빌드 확인**: RN 점프는 iOS Podfile/pod도 바뀌므로 iOS도 함께 검증(현 브랜치명이 `ios-sdk-upgrade`인 점과도 맞물림)
6. **Android release 빌드 + 16KB 실측**(§6)
7. **회귀 테스트**: 온보딩 플로우, 경로 저장/알림, 푸시(notifee/FCM), 결제·웹뷰, 스플래시 등 native 비중 큰 영역 위주

## 6. 검증 방법 (재사용 가능)

release AAB 빌드 후 아래로 미정렬 `.so` 0개 확인:

```bash
READELF=$(ls "$HOME/Library/Android/sdk/ndk/"*/toolchains/llvm/prebuilt/*/bin/llvm-readelf | sort -V | tail -1)
cd /tmp && rm -rf aabcheck && mkdir aabcheck && cd aabcheck
unzip -q <경로>/app-release.aab 'base/lib/arm64-v8a/*'
for so in base/lib/arm64-v8a/*.so; do
  al=$("$READELF" -l "$so" | awk '/LOAD/{print $NF}' | sort -u | tail -1)
  [ "$al" != "0x4000" ] && [ "$al" != "0x10000" ] && echo "MISALIGNED: $al $(basename "$so")"
done
echo "done — 위 출력이 없으면 전부 16KB(이상) 정렬"
```

> 기준: LOAD 세그먼트 `p_align ≥ 0x4000`(16KB). 0x10000(64KB)도 허용.

## 7. 리스크 / 작업량

- **최대 리스크**: 0.73→0.77은 마이너 4단계 점프. New Arch는 끄더라도 RN 내부 변경 多 → 빌드 깨짐/네이티브 모듈 호환 이슈 예상.
- **롤백**: 별도 브랜치 작업, 기존 `app-release.aab`(v1.4.0) 보관.
- **작업량(러프)**: RN 코어 마이그레이션 0.5~1일 + 모듈 호환/빌드 안정화 1~2일 + iOS/Android 회귀 1일 ≈ **2.5~4일**. firebase/notifee 메이저 업이 끼면 +α.

## 8. 결론

설정 패치로는 해결 불가. **RN 0.77.x로의 업그레이드가 유일하고 충분한 해법**이며, 다행히 16KB 미정렬이 전부 RN 자체 산출물이라 업그레이드만 완료하면 일괄 해소될 가능성이 높다(반드시 §6 실측). 서드파티 모듈은 16KB 자체보다 "RN 0.77 호환" 관점의 버전 점검이 핵심.
