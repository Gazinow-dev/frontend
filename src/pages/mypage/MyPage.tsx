import styled from '@emotion/native';
import { IconButton, TextButton } from '@/components/common/molecules';
import { FontText, Space } from '@/components/common/atoms';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { ACCOUNT_MANAGE_PAGE, NOTIFICATION_SETTINGS_PAGE, CHANGE_NICKNAME_PAGE, CONTRACT_PAGE, MY_PAGE_NAVIGATION, NOTIFICATION_ON_PAGE } from '@/constants/navigation';
import { Image } from 'react-native';
import { iconPath } from '@/assets/icons/iconPath';
import { COLOR } from '@/constants';
import { RESULTS, requestNotifications } from 'react-native-permissions';

const ALLOWED_PERMISSIONS = {
    [RESULTS.GRANTED]: true,
    [RESULTS.LIMITED]: true,
    [RESULTS.UNAVAILABLE]: true,
    [RESULTS.BLOCKED]: false,
    [RESULTS.DENIED]: false,
};

const requestNotificationPermission = async () => {
    const { status } = await requestNotifications(['alert']);
    return ALLOWED_PERMISSIONS[status];
};

interface RenderMenuProps {
    text: string;
    onPress?: () => void;
    versionInfo?: string;
}

const MyPage = () => {
    const nickName = '사용자17349245';
    const userEmail = 'abcdef@naver.com';
    const versionInfo = '0.0.0';
    const navigation = useRootNavigation();

    const confirmUserNotificationOn = async () => {
        const result = await requestNotificationPermission();
        if (!result) {
            navigation.push(MY_PAGE_NAVIGATION, { screen: NOTIFICATION_ON_PAGE })
        }
        else {
            navigation.push(MY_PAGE_NAVIGATION, { screen: NOTIFICATION_SETTINGS_PAGE })
        }
    }

    const renderMenu = ({ text, onPress, versionInfo }: RenderMenuProps) => (
        <MenuContainer onPress={onPress}>
            <TextButton
                value={text}
                textSize="16px"
                textWeight="Regular"
                lineHeight="21px"
                onPress={onPress}
            />
            {versionInfo ?
                <FontText value={`v ${versionInfo} 최신버전입니다`} textSize="12px" textWeight="Regular" lineHeight="17px" />
                :
                <Image source={iconPath.backBtn} style={{ width: 14, height: 17, transform: [{ scaleX: -1 }] }} />
            }
        </MenuContainer>
    );

    return (
        <Container>
            <ProfileContainer>
                <NickNameContainer onPress={() => { navigation.push(MY_PAGE_NAVIGATION, { screen: CHANGE_NICKNAME_PAGE }) }}>
                    <FontText
                        value={nickName}
                        textSize="16px"
                        textWeight="Medium"
                        lineHeight="21px"
                    />
                    <Space width='5px' />
                    <IconButton
                        iconType="Ionicons"
                        isFontIcon
                        iconName="pencil"
                        iconWidth="15"
                        iconColor={COLOR.GRAY_999}
                        onPress={() => { navigation.push(MY_PAGE_NAVIGATION, { screen: CHANGE_NICKNAME_PAGE }) }}
                    />
                </NickNameContainer>
                <FontText
                    value={userEmail}
                    textSize="12px"
                    textWeight="Regular"
                    lineHeight="15px"
                    textColor={COLOR.GRAY_999}
                />
            </ProfileContainer>
            {renderMenu({ text: '계정 관리', onPress: () => navigation.push(MY_PAGE_NAVIGATION, { screen: ACCOUNT_MANAGE_PAGE }) })}
            {renderMenu({ text: '알림 설정', onPress: () => confirmUserNotificationOn() })}
            {/* {renderMenu({ text: '알림 설정', onPress: () => navigation.push(MY_PAGE_NAVIGATION, { screen: NOTIFICATION_SETTINGS_PAGE }) })} */}
            {renderMenu({ text: '약관 및 정책', onPress: () => navigation.push(MY_PAGE_NAVIGATION, { screen: CONTRACT_PAGE }) })}
            {renderMenu({ text: '버전', versionInfo })}
        </Container>
    );
};

export default MyPage;

const Container = styled.View`
  background-color: white;
  flex: 1;
`;
const NickNameContainer = styled.Pressable`
  flex-direction: row;
  align-items: center;
`;
const ProfileContainer = styled.Pressable`
  padding: 45px 16px;
  background-color: ${COLOR.LIGHT_GRAY}
`;
const MenuContainer = styled.Pressable`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 16px;
  height: 53px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #ebebeb;
`;