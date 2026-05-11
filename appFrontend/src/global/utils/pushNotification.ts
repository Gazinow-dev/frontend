import { useCallback, useEffect } from 'react';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidVisibility, EventType } from '@notifee/react-native';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { AppState, AppStateStatus, Platform } from 'react-native';

const rootNavigation = useRootNavigation();

export const pushNotification = () => {
  // 포그라운드 알림 수신 표시 및 클릭 처리
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      displayReceivedNotification(remoteMessage);
      notifee.onForegroundEvent(async ({ type }) => {
        if (type === EventType.PRESS) {
          await handleNotificationPress(remoteMessage);
        }
      });
    });
    return unsubscribe;
  }, []);
};

// 포그라운드 알림 화면에 표시
export const displayReceivedNotification = async (
  message: FirebaseMessagingTypes.RemoteMessage,
) => {
  const { title, body } = message.notification!;

  // 채널 생성
  const channelId = await notifee.createChannel({
    // Miscellaneous 채널 삭제, Important Notifications로 통임
    id: 'fcm_fallback_notification_channel',
    name: 'Important Notifications',
    importance: AndroidImportance.HIGH,
  });

  // 디바이스에 알림 표시
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      timeoutAfter: 5000,
      smallIcon: 'ic_notification',
      color: '#346BF7',
    },
  });
};

// 알림 클릭 시 remoteMessage의 data(Path값, 알림 id)를 경로 상세 페이지 화면의 param으로 넣고 화면 이동
export const handleNotificationPress = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  const pathJsonString = remoteMessage.data?.path as string;
  const notificationId = Number(remoteMessage.data?.notificationId);

  // 경로 상세 화면으로 이동하기 위한 path값과 알림 읽음 처리를 위한 알림 id 값
  if (pathJsonString && notificationId) {
    const parseJsonString = (pathJsonString: string) => {
      try {
        return JSON.parse(pathJsonString);
      } catch (error) {
        console.error('JSON 파싱 오류:', error);
      }
    };
    const parsedPathObject = parseJsonString(pathJsonString);

    await rootNavigation.navigate('SubwayPathDetail', {
      state: parsedPathObject,
      notificationId,
    });
  }
};

// 안드로이드 앱 종료 상태일 때 알림 클릭 핸들러
if (Platform.OS === 'android') {
  const getNotification = useCallback(async () => {
    const remoteMessage = await messaging().getInitialNotification();
    if (remoteMessage) {
      await handleNotificationPress(remoteMessage);
    }
  }, []);

  useEffect(() => {
    getNotification();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') getNotification();
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, [getNotification]);
}
