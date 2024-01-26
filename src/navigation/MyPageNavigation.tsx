import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackNavigationProp } from '@react-navigation/stack';

import { EditRouteStackParamList, MyPageStackParamList } from '@/types/navigation';
import { MY_PAGE, CHANGE_NICKNAME_PAGE, ACCOUNT_MANAGE_PAGE, CHANGE_PW_PAGE, CONFIRM_QUIT_PAGE, CONTRACT_PAGE, NOTIFICATION_SETTINGS_PAGE, NOTIFICATION_ON_PAGE } from '@/constants/navigation';
import { AccountManagePage, ChangePwPage, ConfirmQuitPage, ContractPage, MyPage, ChangeNickNamePage, NotificationSettingsPage, NotificationOnPage } from '@/pages/mypage';
import styled from '@emotion/native';
import { IconButton } from '@/components/common/molecules';

const Stack = createStackNavigator<MyPageStackParamList>();

const renderHeaderLeft = (navigation: StackNavigationProp<EditRouteStackParamList, keyof EditRouteStackParamList>) => ({
    headerLeft: () => (
        <HeaderLeft>
            <IconButton
                isFontIcon={false}
                imagePath="backBtn"
                iconWidth="27px"
                iconHeight="20px"
                onPress={() => navigation.goBack()}
            />
        </HeaderLeft>
    ),
});

const renderHeaderNickname = (navigation: StackNavigationProp<EditRouteStackParamList, keyof EditRouteStackParamList>) => ({
    title: '닉네임 수정',
    headerLeft: () => (
        <HeaderLeft >
            <IconButton
                isFontIcon={false}
                imagePath="x"
                iconWidth="23px"
                iconHeight="23px"
                onPress={() => navigation.goBack()}
            />
        </HeaderLeft>
    )
});

const renderHeaderChangePw = (navigation: StackNavigationProp<EditRouteStackParamList, keyof EditRouteStackParamList>) => ({
    title: '비밀번호 변경',
    headerLeft: () => (
        <HeaderLeft >
            <IconButton
                isFontIcon={false}
                imagePath="backBtn"
                iconWidth="27px"
                iconHeight="20px"
                onPress={() => navigation.goBack()}
            />
        </HeaderLeft>
    )
});

const MyPageNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name={MY_PAGE} component={MyPage} />
            <Stack.Screen name={CHANGE_NICKNAME_PAGE} component={ChangeNickNamePage} options={({ navigation }) => 
                renderHeaderNickname(navigation)
            } />
            <Stack.Screen name={ACCOUNT_MANAGE_PAGE} component={AccountManagePage} options={({ navigation }) => ({
                title: '계정 관리', ...renderHeaderLeft(navigation)
            })} />
            <Stack.Screen name={NOTIFICATION_SETTINGS_PAGE} component={NotificationSettingsPage} options={({ navigation }) => ({
                title: '알림 설정', ...renderHeaderLeft(navigation)
            })} />
            <Stack.Screen name={NOTIFICATION_ON_PAGE} component={NotificationOnPage} options={({ navigation }) => ({
                title: '알림 설정', ...renderHeaderLeft(navigation)
            })} />
            <Stack.Screen name={CHANGE_PW_PAGE} component={ChangePwPage} options={({ navigation }) => 
                renderHeaderChangePw(navigation)
            } />
            <Stack.Screen name={CONFIRM_QUIT_PAGE} component={ConfirmQuitPage} options={({ navigation }) => ({
                title: '', ...renderHeaderLeft(navigation)
            })} />
            <Stack.Screen name={CONTRACT_PAGE} component={ContractPage} options={({ navigation }) => ({
                title: '',
                ...renderHeaderLeft(navigation)
            })}
            />
        </Stack.Navigator>
    );
};

export default MyPageNavigation;

export const useMyPageNavigation = <RouteName extends keyof MyPageStackParamList>() => {
    return useNavigation<StackNavigationProp<MyPageStackParamList, RouteName>>();
};
const HeaderLeft = styled.View`
  margin-left: 10px;
  flex-direction: row;
`;