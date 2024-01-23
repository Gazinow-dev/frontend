import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackNavigationProp } from '@react-navigation/stack';

import { MyPageStackParamList } from '@/types/navigation';
import { MY_PAGE, CHANGE_NICKNAME_PAGE, ACCOUNT_MANAGE_PAGE, ALERT_SETTINGS_PAGE, CHANGE_PW_PAGE, CONFIRM_QUIT_PAGE, CONTRACT_PAGE } from '@/constants/navigation';
import { AccountManagePage, AlertSettingsPage, ChangePwPage, ConfirmQuitPage, ContractPage, MyPage, NicknameInputPage } from '@/pages/mypage';

const Stack = createStackNavigator<MyPageStackParamList>();

const MyPageNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name={MY_PAGE} component={MyPage} />
            <Stack.Screen name={CHANGE_NICKNAME_PAGE} component={NicknameInputPage} />
            <Stack.Screen name={ACCOUNT_MANAGE_PAGE} component={AccountManagePage} />
            <Stack.Screen name={ALERT_SETTINGS_PAGE} component={AlertSettingsPage} />
            <Stack.Screen name={CHANGE_PW_PAGE} component={ChangePwPage} />
            <Stack.Screen name={CONFIRM_QUIT_PAGE} component={ConfirmQuitPage}/>
            <Stack.Screen name={CONTRACT_PAGE} component={ContractPage}/>
        </Stack.Navigator>
    );
};

export default MyPageNavigation;

export const useMyPageNavigation = <RouteName extends keyof MyPageStackParamList>() => {
    return useNavigation<StackNavigationProp<MyPageStackParamList, RouteName>>();
};
