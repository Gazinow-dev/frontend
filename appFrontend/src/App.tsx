import React, { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { RootNavigation } from '@/navigation';
import { store } from '@/store';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { MODE, SENTRY_DSN } from '@env';
import { version as currentVersion } from '../package.json';
import { fetch } from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import { RootStackParamList } from './navigation/types/navigation';
import analytics from '@react-native-firebase/analytics';

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
