import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { IssueCarrousel, SwapStation, MyRoutes } from './components';
import { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { useTryAuthorization } from './hooks';
import IconBell from '@assets/icons/bell.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useHomeNavigation } from '@/navigation/HomeNavigation';

const HomeScreen = () => {
  const { isVerifiedUser, tryAuthorization } = useTryAuthorization();
  const rootNavigation = useRootNavigation();
  const homeNavigation = useHomeNavigation();

  useEffect(() => {
    if (isVerifiedUser !== 'yet') {
      setTimeout(() => {
        SplashScreen.hide();
      }, 500);
    }
  }, [isVerifiedUser]);

  useEffect(() => {
    if (isVerifiedUser === 'yet') tryAuthorization();
  }, []);

  const authStateHandler = () =>
    isVerifiedUser === 'success auth'
      ? homeNavigation.push('NotiHistory')
      : rootNavigation.navigate('AuthStack', { screen: 'Landing' });

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-f9">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16 }}
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
        {/* TODO: 배포 이후 백엔드 api 완성되면 주석 해제 */}
        {/* <TouchableOpacity
          onPress={authStateHandler}
          hitSlop={20}
          className="flex-row-reverse mt-15 ml-11"
        >
          <IconBell />
        </TouchableOpacity> */}
        <IssueCarrousel isRefreshing={isRefreshing} setIsRefreshing={setIsRefreshing} />
        <View className="h-16" />
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
