import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { HomeStackParamList } from '@/navigation/types/navigation';
import SearchPathResultScreen from '@/screens/searchPathResultScreen';
import SearchPathResultDetailScreen from '@/screens/searchPathResultDetailScreen';
import NotiHistoryScreen from '@/screens/homeScreen/components/NotiHistory';
import HomeScreen from '@/screens/homeScreen';
import toastConfig from '@global/utils/ToastConfig';
import { SavedPathsScreen } from '@/screens/savePathScreen';

const Stack = createStackNavigator<HomeStackParamList>();

const screenOption = {
  headerShown: false,
};

const HomeNavigation = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="Home" screenOptions={screenOption}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NotiHistory" component={NotiHistoryScreen} />
        <Stack.Screen name="SubwayPathResult" component={SearchPathResultScreen} />
        <Stack.Screen name="SubwayPathDetail" component={SearchPathResultDetailScreen} />
        <Stack.Screen name="SavedPaths" component={SavedPathsScreen} />
      </Stack.Navigator>
      <Toast config={toastConfig} />
    </>
  );
};

export default HomeNavigation;

export const useHomeNavigation = <RouteName extends keyof HomeStackParamList>() => {
  return useNavigation<StackNavigationProp<HomeStackParamList, RouteName>>();
};
