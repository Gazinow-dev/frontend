import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Login } from '@/components/auth/page';
import { MainBottomTabNavigation, SearchNavigation } from '@/navigation';
import { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator();

const screenOption = {
  headerShown: false,
};

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainBottomTab" screenOptions={screenOption}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MainBottomTab" component={MainBottomTabNavigation} />
        <Stack.Screen name="SearchNavigation" component={SearchNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;

export const useRootNavigation = <RouteName extends keyof RootStackParamList>() => {
  return useNavigation<NativeStackNavigationProp<RootStackParamList, RouteName>>();
};
