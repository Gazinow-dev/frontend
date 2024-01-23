import styled from '@emotion/native';

import { IconButton, TextButton } from '@/components/common/molecules';
import { FontText } from '@/components/common/atoms';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { ACCOUNT_MANAGE_PAGE, CHANGE_NICKNAME_PAGE, CONTRACT_PAGE, MY_PAGE_NAVIGATION } from '@/constants/navigation';
import { Image } from 'react-native';
import { iconPath } from '@/assets/icons/iconPath';

const MyPage = () => {
    const nickName = '사용자17349245'
    const userEmail = 'abcdef@naver.com'
    const versionInfo = '0.0.0'
    const navigation = useRootNavigation();

    return (
        <Container>
            <NickNameContainer onPress={() => { navigation.push(MY_PAGE_NAVIGATION, { screen: CHANGE_NICKNAME_PAGE }) }}>
                <FontText
                    value={nickName}
                    textSize="16px"
                    textWeight="Regular"
                    lineHeight="21px"
                />
                <IconButton
                    iconType="Ionicons"
                    isFontIcon
                    iconName="pencil"
                    iconWidth="13"
                    iconColor="#49454F"
                />
            </NickNameContainer>
            <FontText
                value={userEmail}
                textSize="12px"
                textWeight="Regular"
                lineHeight="15px"
            />
            <MenuContainer onPress={() => { navigation.push(MY_PAGE_NAVIGATION, { screen: ACCOUNT_MANAGE_PAGE }) }}>
                <TextButton
                    value="계정관리"
                    textSize="16px"
                    textWeight="Regular"
                    lineHeight="21px"
                />
                <Image source={iconPath.backBtn} style={{ width: 14, height: 17, transform: [{ scaleX: -1 }] }} />
            </MenuContainer>
            <MenuContainer onPress={() => { navigation.push(MY_PAGE_NAVIGATION, { screen: CONTRACT_PAGE }) }}>
                <TextButton
                    value="약관 및 정책"
                    textSize="16px"
                    textWeight="Regular"
                    lineHeight="21px"
                />
                <Image source={iconPath.backBtn} style={{ width: 14, height: 17, transform: [{ scaleX: -1 }] }} />
            </MenuContainer>
            <VersionContainer>
                <FontText
                    value="버전"
                    textSize="16px"
                    textWeight="Regular"
                    lineHeight="21px"
                />
                <FontText
                    value={`v ${versionInfo} 최신버전입니다`}
                    textSize="12px"
                    textWeight="Regular"
                    lineHeight="17px"
                />
            </VersionContainer>
        </Container >
    );
};

export default MyPage;

const Container = styled.View`
  background-color: white;
  flex: 1;
`;
const NickNameContainer = styled.Pressable`
  flex-direction: row;
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
const VersionContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 16px;
  height: 53px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #ebebeb;
`;