import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import { SUBWAY_PATH_RESULT } from '@/global/constants';
import { HOME, SUBWAY_PATH_DETAIL } from '@/global/constants/navigation';
import { HomeStackParamList } from '@/navigation/types/navigation';
import SearchPathResultScreen from '@/screens/searchPathResultScreen';
import SearchPathResultDetailScreen from '@/screens/searchPathResultDetailScreen';
import NotiHistoryScreen from '@/screens/homeScreen/components/NotiHistory';
import HomeScreen from '@/screens/homeScreen';
import SavedRoutesScreen from '@/screens/savedRoutesScreen';
import toastConfig from '@global/utils/ToastConfig';

const Stack = createStackNavigator<HomeStackParamList>();

const screenOption = {
  headerShown: false,
};

const HomeNavigation = () => {
  return (
    <>
      <Stack.Navigator initialRouteName={HOME} screenOptions={screenOption}>
        <Stack.Screen name={HOME} component={HomeScreen} />
        <Stack.Screen name="NotiHistory" component={NotiHistoryScreen} />
        <Stack.Screen name={SUBWAY_PATH_RESULT} component={SearchPathResultScreen} />
        <Stack.Screen name={SUBWAY_PATH_DETAIL} component={SearchPathResultDetailScreen} />
        <Stack.Screen name="SavedRoutes" component={SavedRoutesScreen} />
      </Stack.Navigator>
      <Toast config={toastConfig} />
    </>
  );
};

export default HomeNavigation;

export const useHomeNavigation = <RouteName extends keyof HomeStackParamList>() => {
  return useNavigation<StackNavigationProp<HomeStackParamList, RouteName>>();
};
