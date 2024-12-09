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
    <SafeAreaView className="flex-1 bg-gray-9f9">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 64 }}
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
        <View className="flex-row mt-15">
          <View className="flex-1" />
          <TouchableOpacity onPress={authStateHandler} hitSlop={20}>
            <IconBell />
          </TouchableOpacity>
        </View>
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
