import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackNavigationProp } from '@react-navigation/stack';
import { MyPageStackParamList } from '@/navigation/types/navigation';
import MyRootScreen from '@/screens/myRootScreen';
import ChangeNickNameScreen from '@/screens/myRootScreen/components/ChangeNickNameScreen';
import ChangePwScreen from '@/screens/myRootScreen/components/ChangePwScreen';
import ConfirmPwScreen from '@/screens/myRootScreen/components/ConfirmPwScreen';
import ConfirmQuitScreen from '@/screens/myRootScreen/components/ConfirmQuitScreen';
import ManageAccountScreen from '@/screens/myRootScreen/components/ManageAccountScreen';
import NotiOnScreen from '@/screens/myRootScreen/components/NotiOnScreen';
import NotiSettingsScreen from '@/screens/myRootScreen/components/NotiSettingsScreen';
import SubscribeTermsScreen from '@/screens/myRootScreen/components/SubscribeTermsScreen';
import PersonalTermsScreen from '@/screens/myRootScreen/components/PersonalTermsScreen';

const Stack = createStackNavigator<MyPageStackParamList>();

const screenOption = {
  headerShown: false,
};

const MyPageNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="MyRootScreen" screenOptions={screenOption}>
      <Stack.Screen name="MyRootScreen" component={MyRootScreen} />
      <Stack.Screen name="ChangeNickNameScreen" component={ChangeNickNameScreen} />
      <Stack.Screen name="ChangePwScreen" component={ChangePwScreen} />
      <Stack.Screen name="ConfirmPwScreen" component={ConfirmPwScreen} />
      <Stack.Screen name="ConfirmQuitScreen" component={ConfirmQuitScreen} />
      <Stack.Screen name="ManageAccountScreen" component={ManageAccountScreen} />
      <Stack.Screen name="NotiOnScreen" component={NotiOnScreen} />
      <Stack.Screen name="NotiSettingsScreen" component={NotiSettingsScreen} />
      <Stack.Screen name="SubscribeTermsScreen" component={SubscribeTermsScreen} />
      <Stack.Screen name="PersonalTermsScreen" component={PersonalTermsScreen} />
    </Stack.Navigator>
  );
};

export default MyPageNavigation;

export const useMyPageNavigation = <RouteName extends keyof MyPageStackParamList>() => {
  return useNavigation<StackNavigationProp<MyPageStackParamList, RouteName>>();
};
