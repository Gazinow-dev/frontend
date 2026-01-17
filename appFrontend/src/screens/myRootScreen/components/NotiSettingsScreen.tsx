import React, { useEffect, useState, useCallback } from 'react';
import { AppState, AppStateStatus, TouchableOpacity, View } from 'react-native';
import { FontText } from '@/global/ui';
import IconChevronLeft from '@assets/icons/icon_chevron-left.svg';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import RequestNotiOn from './RequestNotiOn';
import NotiSettings from './NotiSettings';
import notifee from '@notifee/react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotiSettingsScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const [isNotiPermissionOn, setIsNotiPermissionOn] = useState<boolean>(false);

  const checkNotificationPermission = useCallback(async () => {
    const settings = await notifee.getNotificationSettings();
    setIsNotiPermissionOn(settings.authorizationStatus >= 1);
  }, []);

  useEffect(() => {
    checkNotificationPermission();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkNotificationPermission();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [checkNotificationPermission]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center gap-12 p-16">
        <TouchableOpacity onPress={() => myPageNavigation.goBack()} hitSlop={20}>
          <IconChevronLeft />
        </TouchableOpacity>
        <FontText text="알림 설정" className="text-18 leading-23" fontWeight="500" />
      </View>
      {isNotiPermissionOn ? <NotiSettings /> : <RequestNotiOn />}
    </SafeAreaView>
  );
};

export default NotiSettingsScreen;
