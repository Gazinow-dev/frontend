import * as Amplitude from '@amplitude/analytics-react-native';
import { SessionReplayPlugin } from '@amplitude/plugin-session-replay-react-native';
import { AMPLITUDE_API_KEY, MODE, SENTRY_DSN } from '@env';
import { fetch } from '@react-native-community/netinfo';
import analytics from '@react-native-firebase/analytics';
import * as Sentry from '@sentry/react-native';
import RNExitApp from 'react-native-exit-app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import React, { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { RootNavigation } from '@/navigation';
import { store } from '@/store';
import { version as currentVersion } from '../package.json';
import { RootStackParamList } from './navigation/types/navigation';

Amplitude.init(AMPLITUDE_API_KEY, undefined, {
  disableCookies: true,
}).promise;

Amplitude.add(
  new SessionReplayPlugin({
    sampleRate: 1,
  }),
).promise;

Sentry.init({
  enabled: MODE === 'production',
  dsn: SENTRY_DSN,
  release: currentVersion,
  tracesSampleRate: 1.0,
});

const queryClient = new QueryClient();

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const App = (): JSX.Element => {
  // 앱 진입 시 네트워크 확인
  useEffect(() => {
    const checkNetworkAndRetry = async () => {
      const state = await fetch();
      if (!state.isConnected) {
        Alert.alert('', '네트워크 환경이 좋지 않습니다.\n잠시후 다시 시도해주세요.', [
          {
            text: '종료',
            onPress: () => {
              RNExitApp.exitApp();
            },
            style: 'default',
          },
          {
            text: '다시시도',
            onPress: () => {
              checkNetworkAndRetry();
            },
            style: 'cancel',
          },
        ]);
      }
    };
    checkNetworkAndRetry();
  }, []);

  const routeNameRef = useRef<string | null>(null);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer
          ref={navigationRef}
          onReady={async () => {
            if (!navigationRef.current) return;
            const cur = navigationRef.current.getCurrentRoute();
            if (cur) {
              routeNameRef.current = cur.name;
              await analytics().logScreenView({
                screen_name: cur.name,
                screen_class: cur.name,
              });
            }
          }}
          onStateChange={async () => {
            if (!navigationRef.current) return;
            const previousRouteName = routeNameRef.current;
            const cur = navigationRef.current.getCurrentRoute();
            if (cur && previousRouteName !== cur.name) {
              await analytics().logScreenView({
                screen_name: cur.name,
                screen_class: cur.name,
              });
            }
          }}
        >
          <RootNavigation />
        </NavigationContainer>
      </QueryClientProvider>
    </Provider>
  );
};

export default Sentry.wrap(App);
