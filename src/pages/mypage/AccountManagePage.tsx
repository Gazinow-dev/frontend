import styled from '@emotion/native';

import { IconButton, TextButton } from '@/components/common/molecules';
import { FontText } from '@/components/common/atoms';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { CHANGE_PW_PAGE, CONFIRM_QUIT_PAGE, MY_PAGE_NAVIGATION } from '@/constants/navigation';
import { LogoutModal } from '@/components/myPage';
import { useState } from 'react';

const AccountManagePage = () => {
    const navigation = useRootNavigation();
    const [popupVisible, setPopupVisible] = useState<boolean>(false);

    const showLogoutPopup = () => setPopupVisible(true);
    const hideLogoutPopup = () => setPopupVisible(false);
    const handleLogout = async () => {
        console.log('로그아웃 확인 클릭')
        hideLogoutPopup();
    };
    navigation.setOptions({
        title: '계정관리',
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
    })

    return (
        <Container>
            <MenuContainer onPress={() => navigation.push(MY_PAGE_NAVIGATION, { screen: CHANGE_PW_PAGE })}>
                <TextButton
                    value="비밀번호 변경"
                    textSize="16px"
                    textWeight="Regular"
                    lineHeight="21px"
                />
            </MenuContainer>
            <MenuContainer onPress={() => showLogoutPopup()}>
                <TextButton
                    value="로그아웃"
                    textSize="16px"
                    textWeight="Regular"
                    lineHeight="21px"
                    onPress={() => showLogoutPopup()}
                />
            </MenuContainer>
            <LogoutModal
                isVisible={popupVisible}
                onCancel={hideLogoutPopup}
                onLogout={handleLogout}
            />
            <MenuContainer onPress={() => navigation.push(MY_PAGE_NAVIGATION, { screen: CONFIRM_QUIT_PAGE })}>
                <FontText
                    value="회원 탈퇴"
                    textSize="16px"
                    textWeight="Regular"
                    lineHeight="21px"
                />
            </MenuContainer>
        </Container >
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