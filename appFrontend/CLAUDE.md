# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**가는길지금 (GaziNow)** is a React Native (v0.73.4) app for real-time Seoul subway route search and issue tracking. Users can save commute routes, receive push notifications for subway issues, and browse live issue reports by line.

## Commands

```bash
# Install dependencies (includes iOS pod install)
yarn i

# Run dev server
yarn start

# Run on device/simulator
yarn android:development      # Android dev env
yarn android:production       # Android prod env
yarn ios:development          # iOS dev env
yarn ios:production           # iOS prod env

# Lint
yarn lint

# Test
yarn test

# Full clean (nukes node_modules, Pods, Android build artifacts)
yarn clean

# Build Android release
yarn aab:android              # AAB bundle
yarn apk:android              # APK
```

Environment files: `.env.development` and `.env.production`. Variables are accessed via `@env` (react-native-dotenv). Key env vars: `API_BASE_URL`, `MODE`, `SENTRY_DSN`, `AMPLITUDE_API_KEY`.

## Path Aliases

Defined in `babel.config.js` via `babel-plugin-module-resolver`:

| Alias | Resolves to |
|---|---|
| `@` | `./src` |
| `@assets` | `./src/assets` |
| `@global` | `./src/global` |
| `@screens` | `./src/screens` |
| `@store` | `./src/store` |

## Architecture

### Navigation

`RootNavigation` (stack) is the top-level navigator. It contains:
- `AuthStack` → `AuthNavigation` (Landing / SignIn / SignUp)
- `MainBottomTab` → `MainBottomTabNavigation` (Home / NOW / My)
- `IssueStack` → `IssueNavigation`
- `MyPageNavigation` (account settings, notifications)
- `OnboardingNavigation` (first-time route setup flow)
- `SavePathNavigation` (saved route management)
- `SubwayPathDetail` (full-screen path detail)

All navigation param types are centralized in `src/navigation/types/navigation.ts`. Each stack has its own `*ParamList` type exported from there.

Use `useRootNavigation<RouteName>()` (from `src/navigation/RootNavigation.tsx`) for type-safe root-level navigation.

### API Layer

Two Axios instances in `src/global/apis/index.ts`:
- `publicServiceAPI` — unauthenticated requests
- `authServiceAPI` — attaches Bearer token from `EncryptedStorage`, auto-refreshes on 401, redirects to `AuthStack` on refresh failure

API functions (`func.ts`) → React Query hooks (`hooks.ts`) → screens. Screen-specific API code lives in `src/screens/<screen>/apis/`.

Types for all API entities (subway lines, paths, issues, pagination) are in `src/global/apis/entity.ts`. Key type distinction: `OriginLineName` (raw API format, e.g. `'수도권 2호선'`) vs `DisplayLineName` (app display format, e.g. `'2호선'`). Conversion utilities live in `src/global/utils/subwayLine.ts`.

### State Management

Redux Toolkit store (`src/store/`) with two slices:
- `auth` — user nickname, email, `isVerifiedUser` state (`'yet' | 'success auth' | 'fail auth'`)
- `subwaySearch` — departure/arrival station selection

Use `useAppSelect` (typed selector from `src/store/`) to read state.

### Styling

NativeWind (Tailwind CSS for React Native, v2). Custom theme values are in `tailwind.config.js` including:
- Pixel-exact spacing (0–999px as `spacing`, `borderRadius`, etc.)
- Subway line colors: `subway-line-1` through named lines (`subway-line-kj`, etc.)
- App colors: `light-blue` (#346BF7), `light-green`, `light-red`

The `COLOR` constant object in `src/global/constants/color.ts` mirrors these for use in JS style props.

### Global Shared Code

- `src/global/ui/` — reusable UI primitives: `FontText`, `Input`, `TimePicker`, `Toast`, `Toggle`
- `src/global/components/` — shared feature components (loading states, network error screen)
- `src/global/constants/` — `COLOR`, `LINE_CAPSULES`, analytics event names, subway line data
- `src/global/utils/` — `getEncryptedStorage`/`setEncryptedStorage` (token storage), subway line name converters

### Analytics

Amplitude (primary) and Firebase Analytics (screen views) are both active. `src/analytics/` contains event tracking functions organized by tab/feature (`auth.events.ts`, `map.events.ts`, `now.events.ts`, `my.events.ts`, `register.events.ts`). Call these from UI interaction handlers, not inside hooks.

### Fonts

Pretendard (Bold, Medium, Regular, SemiBold) in `src/assets/fonts/`. Use `FontText` component with the `fontWeight` prop rather than setting font families directly.

### Push Notifications

`@notifee/react-native` handles local notifications. `@react-native-firebase/messaging` handles FCM. Notification logic is bootstrapped in `MainBottomTabNavigation` (channel creation on first run) and `RootNavigation` (`pushNotification()` call).

### Error Monitoring

Sentry is initialized in `src/App.tsx`, enabled only in production (`MODE === 'production'`). API errors in `func.ts` use `Sentry.captureException` with structured context objects.
