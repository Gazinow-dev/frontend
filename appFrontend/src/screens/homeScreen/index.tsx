import { RefreshControl, ScrollView, View } from 'react-native';
import { IssueCarrousel, SwapStation, MyRoutes } from './components';
import { useCallback, useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { useTryAuthorization } from './hooks';
import { IconBell } from '@/assets/icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useHomeNavigation } from '@/navigation/HomeNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from 'react-query';
import { getUnreadNotiCount } from '@/global/apis/func';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const { isVerifiedUser, tryAuthorization } = useTryAuthorization();
  const rootNavigation = useRootNavigation();
  const homeNavigation = useHomeNavigation();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { data: unreadData, refetch } = useQuery(['getUnreadNotiCount'], getUnreadNotiCount, {
    enabled: isVerifiedUser === 'success auth',
  });

  const authStateHandler = () =>
    isVerifiedUser === 'success auth'
      ? homeNavigation.push('NotiHistory')
      : rootNavigation.navigate('AuthStack', { screen: 'Landing' });

  useEffect(() => {
    if (isVerifiedUser !== 'yet') {
      setTimeout(() => {
        SplashScreen.hide();
      }, 500);
    }
  }, [isVerifiedUser]);

  useEffect(() => {
    if (isRefreshing) refetch();
  }, [isRefreshing]);

  useEffect(() => {
    if (isVerifiedUser === 'yet') tryAuthorization();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-9f9" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 64, gap: 16 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={isVerifiedUser === 'success auth'}
        refreshControl={
          <RefreshControl
            onRefresh={() => setIsRefreshing(true)}
            refreshing={isRefreshing}
            progressViewOffset={-10}
          />
        }
      >
        <View className="flex-row-reverse">
          <TouchableOpacity onPress={authStateHandler} hitSlop={20} className="relative">
            {(unreadData?.unreadNotificationCount ?? 0) > 0 &&
              isVerifiedUser === 'success auth' && (
                <View className="absolute right-2 top-2 z-10 h-10 w-10 rounded-full border-1 border-gray-9f9 bg-light-red" />
              )}
            <IconBell />
          </TouchableOpacity>
        </View>
        <IssueCarrousel isRefreshing={isRefreshing} setIsRefreshing={setIsRefreshing} />
        <SwapStation />
        <MyRoutes
          isVerifiedUser={isVerifiedUser}
          isRefreshing={isRefreshing}
          setIsRefreshing={setIsRefreshing}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
