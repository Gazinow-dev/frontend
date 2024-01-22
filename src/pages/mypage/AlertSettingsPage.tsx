import styled from '@emotion/native';

import { IconButton, TextButton } from '@/components/common/molecules';
import { FontText } from '@/components/common/atoms';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { CHANGE_NICKNAME_PAGE, MY_PAGE_NAVIGATION } from '@/constants/navigation';
import { Image } from 'react-native';
import { iconPath } from '@/assets/icons/iconPath';

const AlertSettingsPage = () => {
    const nickName = '사용자17349245'
    const userEmail = 'abcdef@naver.com'
    const versionInfo = '0.0.0'
    const navigation = useRootNavigation();

    //     const changeNickName() => {
    // nickName= 
    //     }
    return (
        <Container>
            <NickNameContainer onPress={() => { navigation.navigate(MY_PAGE_NAVIGATION, { screen: 'ChangeNicknamePage' }) }}>
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
                // onPress={changeNickName()}
                />
            </NickNameContainer>
            <FontText
                value={userEmail}
                textSize="12px"
                textWeight="Regular"
                lineHeight="15px"
            />
            <MenuContainer>
                <TextButton
                    value="계정관리"
                    textSize="16px"
                    textWeight="Regular"
                    // onPress={submitFormData}
                    lineHeight="21px"
                />
                <Image source={iconPath.backBtn} style={{ width: 14, height: 17, transform: [{ scaleX: -1 }] }} />
            </MenuContainer>
            <MenuContainer>
                <TextButton
                    value="약관 및 정책"
                    textSize="16px"
                    textWeight="Regular"
                    // onPress={submitFormData}
                    lineHeight="21px"
                />
                <Image source={iconPath.backBtn} style={{ width: 14, height: 17, transform: [{ scaleX: -1 }] }} />
            </MenuContainer>
            <VersionContainer>
                <FontText
                    value="버전"
                    textSize="16px"
                    textWeight="Regular"
                    // onPress={submitFormData}
                    lineHeight="21px"
                />
                <FontText
                    value={`v ${versionInfo} 최신버전입니다`}
                    textSize="12px"
                    textWeight="Regular"
                    // onPress={submitFormData}
                    lineHeight="17px"
                />
            </VersionContainer>
        </Container >
    );
};
export default AlertSettingsPage;

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