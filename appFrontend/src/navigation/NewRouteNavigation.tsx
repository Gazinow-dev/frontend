import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import { NewRouteStackParamList } from './types/navigation';
import { useNavigation } from '@react-navigation/native';
import SavedRoutesScreen from '@/screens/savedRoutesScreen';
import SwapScreen from '@/screens/savedRoutesScreen/components/SwapStation';
import SearchScreen from '@/screens/savedRoutesScreen/components/SearchStation';
import ResultScreen from '@/screens/savedRoutesScreen/components/SelectNewRoute';
import DetailScreen from '@/screens/searchPathResultDetailScreen';
import NameScreen from '@/screens/savedRoutesScreen/components/SaveNewRoute';
import Toast from 'react-native-toast-message';
import toastConfig from '@global/utils/ToastConfig';

const Stack = createStackNavigator<NewRouteStackParamList>();

const screenOption = {
  headerShown: false,
};

const NewRouteNavigation = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="SavedRoutes" screenOptions={screenOption}>
        <Stack.Screen name="SavedRoutes" component={SavedRoutesScreen} />
        <Stack.Screen name="Swap" component={SwapScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Name" component={NameScreen} />
      </Stack.Navigator>
      <Toast config={toastConfig} />
    </>
  );
};

export default NewRouteNavigation;

export const useNewRouteNavigation = <RouteName extends keyof NewRouteStackParamList>() => {
  return useNavigation<StackNavigationProp<NewRouteStackParamList, RouteName>>();
};
