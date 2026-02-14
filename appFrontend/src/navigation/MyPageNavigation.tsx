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
import NotiSettingsScreen from '@/screens/myRootScreen/components/NotiSettingsScreen';
import NotiSettingsDetailScreen from '@/screens/myRootScreen/components/NotiSettingsDetailScreen';
import SubscribeTermsScreen from '@/screens/myRootScreen/components/SubscribeTermsScreen';
import PersonalTermsScreen from '@/screens/myRootScreen/components/PersonalTermsScreen';
import Toast from 'react-native-toast-message';
import toastConfig from '@global/utils/ToastConfig';
import MyCommentsScreen from '@/screens/myRootScreen/components/MyCommentsScreen';
import NoticesScreen from '@/screens/myRootScreen/components/NoticesScreen';
import NoticeDetailScreen from '@/screens/myRootScreen/components/NoticeDetailScreen';

const Stack = createStackNavigator<MyPageStackParamList>();

const screenOption = {
  headerShown: false,
};

const MyPageNavigation = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="MyRootScreen" screenOptions={screenOption}>
        <Stack.Screen name="MyRootScreen" component={MyRootScreen} />
        <Stack.Screen name="ChangeNickNameScreen" component={ChangeNickNameScreen} />
        <Stack.Screen name="MyCommentsScreen" component={MyCommentsScreen} />
        <Stack.Screen name="ChangePwScreen" component={ChangePwScreen} />
        <Stack.Screen name="ConfirmPwScreen" component={ConfirmPwScreen} />
        <Stack.Screen name="ConfirmQuitScreen" component={ConfirmQuitScreen} />
        <Stack.Screen name="ManageAccountScreen" component={ManageAccountScreen} />
        <Stack.Screen name="NotiSettingsScreen" component={NotiSettingsScreen} />
        <Stack.Screen name="NotiSettingsDetailScreen" component={NotiSettingsDetailScreen} />
        <Stack.Screen name="NoticesScreen" component={NoticesScreen} />
        <Stack.Screen name="NoticeDetailScreen" component={NoticeDetailScreen} />
        <Stack.Screen name="SubscribeTermsScreen" component={SubscribeTermsScreen} />
        <Stack.Screen name="PersonalTermsScreen" component={PersonalTermsScreen} />
      </Stack.Navigator>
      <Toast config={toastConfig} />
    </>
  );
};

export default MyPageNavigation;

export const useMyPageNavigation = <RouteName extends keyof MyPageStackParamList>() => {
  return useNavigation<StackNavigationProp<MyPageStackParamList, RouteName>>();
};
