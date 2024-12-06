import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import cn from 'classname';
import { COLOR, HOME, MY_ROOT } from '@/global/constants';
import HomeNavigation from './HomeNavigation';
import NowScreen from '@screens/nowScreen';
import IconFocusedMap from '@assets/icons/tab_map.svg';
import IconUnFocusedMap from '@assets/icons/tab_map_border.svg';
import IconNow from '@assets/icons/tab_now.svg';
import IconMy from '@assets/icons/tab_my.svg';
import { FontText } from '@/global/ui';
import { Platform, StatusBar } from 'react-native';
import { MyPageNavigation } from '.';
import notifee from '@notifee/react-native';
import { Walkthrough } from '@/screens/homeScreen/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const Tab = createBottomTabNavigator();

const screenOption: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarItemStyle: { paddingTop: 8, paddingBottom: 7 },
  tabBarStyle: {
    backgroundColor: COLOR.GRAY_F9,
    height: Platform.OS === 'ios' ? 79 + 5 : 49 + 5,
  },
};

export type isFirstRunType = 'isFirstRun' | 'finishedWalkThrough' | 'notFirstRun';

const MainBottomTabNavigation = () => {
  // 첫 실행이면 워크스루 띄우기
  const [isFirstRun, setIsFirstRun] = useState<isFirstRunType>('notFirstRun');

  const checkFirstRun = useCallback(async () => {
    const hasRunBefore = await AsyncStorage.getItem('hasRunBefore');
    if (!hasRunBefore) {
      await AsyncStorage.setItem('hasRunBefore', 'true');
      setIsFirstRun('isFirstRun');
    }
  }, []);

  useEffect(() => {
    checkFirstRun();
  }, []);

  // 워크스루 종료 시 알림 권한 요청
  useEffect(() => {
    if (isFirstRun === 'finishedWalkThrough') {
      const requestPermission = async () => {
        await notifee.requestPermission();
      };
      requestPermission();
    }
  }, [isFirstRun]);

  return (
    <>
      <Tab.Navigator initialRouteName={HOME} screenOptions={screenOption}>
        <Tab.Screen
          name="homeStack"
          component={HomeNavigation}
          options={{
            tabBarLabel: ({ focused }) => (
              <FontText
                text="홈"
                className={cn('text-10 mt-5', {
                  'text-light-blue': focused,
                  'text-gray-d7d': !focused,
                })}
                fontWeight="600"
              />
            ),
            tabBarIcon: ({ focused }) => {
              return <>{focused ? <IconFocusedMap /> : <IconUnFocusedMap />}</>;
            },
          }}
        />
        <Tab.Screen
          name="NowScreen"
          component={NowScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <FontText
                text="NOW"
                className={cn('text-10 mt-5', {
                  'text-light-blue': focused,
                  'text-gray-d7d': !focused,
                })}
                fontWeight="600"
              />
            ),
            tabBarIcon: ({ focused }) => (
              <IconNow
                color={focused ? COLOR.LIGHT_BLUE : 'transparent'}
                strokeWidth={focused ? 0 : 1}
                stroke={COLOR.GRAY_7D}
              />
            ),
          }}
        />
        <Tab.Screen
          name={MY_ROOT}
          component={MyPageNavigation}
          options={{
            tabBarLabel: ({ focused }) => (
              <FontText
                text="마이"
                className={cn('text-10 mt-5', {
                  'text-light-blue': focused,
                  'text-gray-d7d': !focused,
                })}
                fontWeight="600"
              />
            ),
            tabBarIcon: ({ focused }) => (
              <IconMy
                color={focused ? COLOR.LIGHT_BLUE : 'transparent'}
                strokeWidth={focused ? 0 : 1}
                stroke={COLOR.GRAY_7D}
              />
            ),
          }}
        />
      </Tab.Navigator>
      {isFirstRun === 'isFirstRun' && <Walkthrough setIsFirstRun={setIsFirstRun} />}
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
    </>
  );
};

export default MainBottomTabNavigation;
