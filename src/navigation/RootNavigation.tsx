import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackNavigationProp } from '@react-navigation/stack';

import { EDIT_ROUTE_NAVIGATION, LOGIN, MAIN_BOTTOM_TAB, MY_PAGE_NAVIGATION, SEARCH_NAVIGATION } from '@/constants';
import { EditRouteNavigation, MainBottomTabNavigation, MyPageNavigation, SearchNavigation } from '@/navigation';
import { LoginPage } from '@/pages/auth';
import type { RootStackParamList } from '@/types/navigation';
import { tokenReissueFetch } from '@/apis/auth';
import { useMutation } from 'react-query';
import { useEffect } from 'react';
import { getEncryptedStorage, removeEncryptedStorage, setEncryptedStorage } from '@/utils';
import { View } from 'react-native';
import { FontText } from '@/components/common/atoms';

const Stack = createStackNavigator<RootStackParamList>();

const screenOption = {
  headerShown: false,
};

const RootNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOption}>
      <Stack.Screen
        name={'Temp'}
        component={() => {
          const rootNavigation = useRootNavigation();

          const { mutate } = useMutation(tokenReissueFetch, {
            onSuccess: async ({ newAccessToken, newRefreshToken }) => {
              await setEncryptedStorage('access_token', newAccessToken);
              await setEncryptedStorage('refresh_token', newRefreshToken);
              rootNavigation.replace(MAIN_BOTTOM_TAB);
            },
            onError: () => {
              removeEncryptedStorage('access_token');
              removeEncryptedStorage('refresh_token');
              rootNavigation.replace(LOGIN);
            },
          });

          const firstAuthorization = async () => {
            const accessToken = await getEncryptedStorage('access_token');
            const refreshToken = await getEncryptedStorage('refresh_token');
            if (!accessToken) {
              rootNavigation.navigate(LOGIN);
              return;
            } else {
              mutate({
                accessToken,
                refreshToken,
              });
            }
          };

          useEffect(() => {
            // 나중에 스플래쉬 스크린으로 로직 이동
            firstAuthorization();
          }, []);
          return (
            <View>
              <FontText value="자동 로그인 중" textSize="16px" textWeight="Bold" />
            </View>
          );
        }}
      />
      <Stack.Screen name={LOGIN} component={LoginPage} />
      <Stack.Screen name={MAIN_BOTTOM_TAB} component={MainBottomTabNavigation} />
      <Stack.Screen name={SEARCH_NAVIGATION} component={SearchNavigation} />
      <Stack.Screen name={EDIT_ROUTE_NAVIGATION} component={EditRouteNavigation} />
      <Stack.Screen name={MY_PAGE_NAVIGATION} component={MyPageNavigation} />
    </Stack.Navigator>
  );
};

export default RootNavigation;

export const useRootNavigation = <RouteName extends keyof RootStackParamList>() => {
  return useNavigation<StackNavigationProp<RootStackParamList, RouteName>>();
};
