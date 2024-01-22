import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HOME, MY_PAGE } from '@/constants';
import { HomePage } from '@/pages/home';
import { MyPage } from '@/pages/mypage';

const Tab = createBottomTabNavigator();

const screenOption = {
  headerShown: false,
};

const MainBottomTabNavigation = () => {
  return (
    <Tab.Navigator initialRouteName={HOME} screenOptions={screenOption}>
      <Tab.Screen name={HOME} component={HomePage} />
      <Tab.Screen name={MY_PAGE} component={MyPage} />
    </Tab.Navigator>
  );
};

export default MainBottomTabNavigation;
