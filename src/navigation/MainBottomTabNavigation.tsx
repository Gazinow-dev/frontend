import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Home } from '@/components/home/page';

const Tab = createBottomTabNavigator();

const screenOption = {
  headerShown: false,
};

const MainBottomTabNavigation = () => {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={screenOption}>
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  );
};

export default MainBottomTabNavigation;
