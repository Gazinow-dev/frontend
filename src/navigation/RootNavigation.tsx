import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Login } from '@/components/auth/page';
import { MainBottomTabNavigation, SearchNavigation } from '@/navigation';

const Stack = createStackNavigator();

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
