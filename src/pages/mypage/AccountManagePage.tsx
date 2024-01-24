import React, { useState } from 'react';
import styled from '@emotion/native';
import { IconButton, TextButton } from '@/components/common/molecules';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { CHANGE_PW_PAGE, CONFIRM_QUIT_PAGE, LOGIN, MY_PAGE_NAVIGATION } from '@/constants/navigation';
import { LogoutModal } from '@/components/myPage';
import { getEncryptedStorage } from '@/utils';
import { useLogoutMutation } from '@/hooks/queries/authQuery';

interface RenderMenuProps {
    text: string;
    onPress: () => void;
}

const AccountManagePage = () => {
    const navigation = useRootNavigation();
    const [popupVisible, setPopupVisible] = useState(false);

    const { logoutMutate } = useLogoutMutation({
        onSuccess: () => navigation.reset({ routes: [{ name: LOGIN }] }),
    });

    const handleLogout = async () => {
        const accessToken = await getEncryptedStorage('access_token');
        const refreshToken = await getEncryptedStorage('refresh_token');
        logoutMutate({ accessToken, refreshToken });
        hideLogoutPopup();
    };

    const showLogoutPopup = () => setPopupVisible(true);
    const hideLogoutPopup = () => setPopupVisible(false);

    const renderMenu = ({ text, onPress }: RenderMenuProps) => (
        <MenuContainer onPress={onPress}>
            <TextButton
                value={text}
                textSize="16px"
                textWeight="Regular"
                lineHeight="21px"
                onPress={onPress}
            />
        </MenuContainer>
    );

    return (
        <Container>
            {renderMenu({ text: '비밀번호 변경', onPress: () => navigation.push(MY_PAGE_NAVIGATION, { screen: CHANGE_PW_PAGE }) })}
            {renderMenu({ text: '로그아웃', onPress: () => showLogoutPopup() })}
            {renderMenu({ text: '회원 탈퇴', onPress: () => navigation.push(MY_PAGE_NAVIGATION, { screen: CONFIRM_QUIT_PAGE }) })}
            <LogoutModal isVisible={popupVisible} onCancel={hideLogoutPopup} onLogout={handleLogout} />
        </Container>
    );
};
export default AccountManagePage;

const Container = styled.View`
    background-color: white;
    flex: 1;
`;
const MenuContainer = styled.Pressable`
    flex-direction: row;
    padding: 0 16px;
    height: 53px;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: #ebebeb;
`;
const HeaderLeft = styled.View`
    margin-left: 10px;
    flex-direction: row;
`;