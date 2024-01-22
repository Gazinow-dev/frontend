import styled from '@emotion/native';

import { IconButton, TextButton } from '@/components/common/molecules';
import { FontText } from '@/components/common/atoms';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { CHANGE_NICKNAME_PAGE, CHANGE_PW_PAGE, CONFIRM_QUIT_PAGE, MY_PAGE_NAVIGATION } from '@/constants/navigation';
import { Image } from 'react-native';
import { iconPath } from '@/assets/icons/iconPath';

const AccountManagePage = () => {
    const nickName = '사용자17349245'
    const userEmail = 'abcdef@naver.com'
    const versionInfo = '0.0.0'
    const navigation = useRootNavigation();

    //     const changeNickName() => {
    // nickName= 
    //     }
    return (
        <Container>
            <MenuContainer onPress={() => { navigation.navigate(MY_PAGE_NAVIGATION, { screen: CHANGE_PW_PAGE }) }}>
                <TextButton
                    value="비밀번호 변경"
                    textSize="16px"
                    textWeight="Regular"
                    lineHeight="21px"
                />
            </MenuContainer>
            <MenuContainer onPress={() => { navigation.navigate(MY_PAGE_NAVIGATION, { screen: CONFIRM_QUIT_PAGE }) }}>
                <TextButton
                    value="로그아웃"
                    textSize="16px"
                    textWeight="Regular"
                    lineHeight="21px"
                />
            </MenuContainer>
            <MenuContainer onPress={() => { navigation.navigate(MY_PAGE_NAVIGATION, { screen: CONFIRM_QUIT_PAGE }) }}>
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
  justify-content: space-between;
  padding: 0 16px;
  height: 53px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #ebebeb;
`;