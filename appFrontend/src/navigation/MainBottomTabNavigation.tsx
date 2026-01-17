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
import { Pressable, StatusBar } from 'react-native';
import { MyPageNavigation } from '.';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { Walkthrough } from '@/screens/homeScreen/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { trackHomeTabClick } from '@/analytics/map.events';
import { trackNowTabClick } from '@/analytics/now.events';
import { trackMyTabClick } from '@/analytics/my.events';

const Tab = createBottomTabNavigator();

const screenOption: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarStyle: {
    backgroundColor: COLOR.GRAY_F9,
    paddingVertical: 8,
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

  // 워크스루 종료 시 알림 권한 요청, 안드로이드 알림 default 채널 생성
  useEffect(() => {
    if (isFirstRun === 'finishedWalkThrough') {
      const requestPermission = async () => {
        await notifee.requestPermission();
      };
      const createDefaultNotiChannel = async () => {
        await notifee.createChannel({
          id: 'high_priority_channel',
          name: 'Important Notifications',
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        });
      };
      requestPermission();
      createDefaultNotiChannel();
    }
  }, [isFirstRun]);

  return (
    <>
      <Tab.Navigator initialRouteName={HOME} screenOptions={screenOption}>
        <Tab.Screen
          name="homeStack"
          component={HomeNavigation}
          options={{
            tabBarButton: (props) => (
              <Pressable
                className="flex-1 gap-5"
                onPress={(e) => {
                  trackHomeTabClick();
                  props.onPress?.(e);
                }}
              >
                {props.children}
              </Pressable>
            ),
            tabBarLabel: ({ focused }) => (
              <FontText
                text="홈"
                className={cn('text-center text-10 leading-12 text-gray-d7d', {
                  'text-light-blue': focused,
                })}
                fontWeight={focused ? '600' : '400'}
              />
            ),
            tabBarIcon: ({ focused }) => <>{focused ? <IconFocusedMap /> : <IconUnFocusedMap />}</>,
          }}
        />
        <Tab.Screen
          name="NowScreen"
          component={NowScreen}
          options={{
            tabBarButton: (props) => (
              <Pressable
                className="flex-1 gap-5"
                onPress={(e) => {
                  trackNowTabClick();
                  props.onPress?.(e);
                }}
              >
                {props.children}
              </Pressable>
            ),
            tabBarLabel: ({ focused }) => (
              <FontText
                text="NOW"
                className={cn('text-center text-10 leading-12 text-gray-d7d', {
                  'text-light-blue': focused,
                })}
                fontWeight={focused ? '600' : '400'}
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
            tabBarButton: (props) => (
              <Pressable
                className="flex-1 gap-5"
                onPress={(e) => {
                  trackMyTabClick();
                  props.onPress?.(e);
                }}
              >
                {props.children}
              </Pressable>
            ),
            tabBarLabel: ({ focused }) => (
              <FontText
                text="마이"
                className={cn('text-center text-10 leading-12 text-gray-d7d', {
                  'text-light-blue': focused,
                })}
                fontWeight={focused ? '600' : '400'}
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
