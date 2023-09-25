import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Login } from '@/components/auth/page';
import { LOGIN, MAIN_BOTTOM_TAB, SEARCH_NAVIGATION } from '@/constants/navigation';
import { MainBottomTabNavigation, SearchNavigation } from '@/navigation';
import { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator();

const screenOption = {
  headerShown: false,
};

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={MAIN_BOTTOM_TAB} screenOptions={screenOption}>
        <Stack.Screen name={LOGIN} component={Login} />
        <Stack.Screen name={MAIN_BOTTOM_TAB} component={MainBottomTabNavigation} />
        <Stack.Screen name={SEARCH_NAVIGATION} component={SearchNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;

export const useRootNavigation = <RouteName extends keyof RootStackParamList>() => {
  return useNavigation<NativeStackNavigationProp<RootStackParamList, RouteName>>();
};
