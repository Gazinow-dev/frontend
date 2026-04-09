import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  AuthNavigation,
  IssueNavigation,
  MainBottomTabNavigation,
  MyPageNavigation,
  OnboardingNavigation,
  SavePathNavigation,
} from '@/navigation';
import type { RootStackParamList } from '@/navigation/types/navigation';
import SearchPathResultDetailScreen from '@/screens/searchPathResultDetailScreen';
import { pushNotification } from '@/global/utils/pushNotification';

const Stack = createStackNavigator<RootStackParamList>();

const screenOption = {
  headerShown: false,
};

const RootNavigation = () => {
  pushNotification();
  return (
    <Stack.Navigator screenOptions={screenOption} initialRouteName="MainBottomTab">
      <Stack.Screen name="AuthStack" component={AuthNavigation} />
      <Stack.Screen name="IssueStack" component={IssueNavigation} />
      <Stack.Screen name="MainBottomTab" component={MainBottomTabNavigation} />
      <Stack.Screen name="MyPageNavigation" component={MyPageNavigation} />
      <Stack.Screen name="OnboardingNavigation" component={OnboardingNavigation} />
      <Stack.Screen name="SavePathNavigation" component={SavePathNavigation} />
      <Stack.Screen name="SubwayPathDetail" component={SearchPathResultDetailScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigation;

export const useRootNavigation = <RouteName extends keyof RootStackParamList>() => {
  return useNavigation<StackNavigationProp<RootStackParamList, RouteName>>();
};
