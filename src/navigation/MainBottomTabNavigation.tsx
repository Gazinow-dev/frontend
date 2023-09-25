import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Home } from '@/components/home/page';
import { HOME } from '@/constants/navigation';

const Tab = createBottomTabNavigator();

const screenOption = {
  headerShown: false,
};

const MainBottomTabNavigation = () => {
  return (
    <Tab.Navigator initialRouteName={HOME} screenOptions={screenOption}>
      <Tab.Screen name={HOME} component={Home} />
    </Tab.Navigator>
  );
};

export default MainBottomTabNavigation;
