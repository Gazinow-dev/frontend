import toastConfig from '@global/utils/ToastConfig';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import {
  PathNameScreen,
  PathSelectScreen,
  SavedPathsScreen,
  StationSearchScreen,
  SwapStationScreen,
} from '@/screens/savePathScreen';
import DetailScreen from '@/screens/searchPathResultDetailScreen';
import { SavePathStackParamList } from './types/navigation';

const Stack = createStackNavigator<SavePathStackParamList>();

const screenOption = {
  headerShown: false,
};

const SavePathNavigation = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="SavedPaths" screenOptions={screenOption}>
        <Stack.Screen name="PathName" component={PathNameScreen} />
        <Stack.Screen name="PathSelect" component={PathSelectScreen} />
        <Stack.Screen name="SavedPaths" component={SavedPathsScreen} />
        <Stack.Screen name="StationSearch" component={StationSearchScreen} />
        <Stack.Screen name="SwapStation" component={SwapStationScreen} />
        <Stack.Screen name="PathDetail" component={DetailScreen} />
      </Stack.Navigator>
      <Toast config={toastConfig} />
    </>
  );
};

export default SavePathNavigation;

export const useSavePathNavigation = <RouteName extends keyof SavePathStackParamList>() => {
  return useNavigation<StackNavigationProp<SavePathStackParamList, RouteName>>();
};
