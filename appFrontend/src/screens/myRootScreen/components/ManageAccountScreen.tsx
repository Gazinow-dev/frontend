import React, { useState } from 'react';
import styled from '@emotion/native';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { getEncryptedStorage, removeEncryptedStorage } from '@/global/utils';
import { FontText, Space, TextButton } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useLogoutMutation } from '@/screens/signInScreen/apis/hook';
import MyTabModal from '@/global/components/MyTabModal';
import { Pressable, SafeAreaView } from 'react-native';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import { showToast } from '@/global/utils/toast';
import { useAppDispatch } from '@/store';
import { getAuthorizationState } from '@/store/modules';

interface RenderMenuProps {
  text: string;
  onPress: () => void;
}

const ManageAccountScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const navigation = useRootNavigation();
  const [popupVisible, setPopupVisible] = useState(false);
  const dispatch = useAppDispatch();

  const { logoutMutate } = useLogoutMutation({
    onSuccess: () => {
      removeEncryptedStorage('access_token');
      removeEncryptedStorage('refresh_token');
      showToast('logout');
      dispatch(getAuthorizationState('fail auth'));
      navigation.goBack();
    },
  });

  const handleConfirm = async () => {
    const accessToken = await getEncryptedStorage('access_token');
    const refreshToken = await getEncryptedStorage('refresh_token');
    logoutMutate({ accessToken, refreshToken });
    setPopupVisible(false);
  };

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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.WHITE }}>
      <Header>
        <Pressable hitSlop={20} onPress={() => myPageNavigation.goBack()}>
          <IconLeftArrowHead color="#3F3F46" />
        </Pressable>
        <Space width="21px" />
        <FontText value="계정 관리" textSize="18px" lineHeight="23px" textWeight="Medium" />
      </Header>
      <Container>
        {renderMenu({
          text: '비밀번호 변경',
          onPress: () => myPageNavigation.navigate('ChangePwScreen'),
        })}
        {renderMenu({ text: '로그아웃', onPress: () => setPopupVisible(true) })}
        {renderMenu({
          text: '회원 탈퇴',
          onPress: () => myPageNavigation.navigate('ConfirmQuitScreen'),
        })}
        <MyTabModal
          isVisible={popupVisible}
          onCancel={() => setPopupVisible(false)}
          onConfirm={handleConfirm}
          title="로그아웃 할까요?"
          confirmText="로그아웃"
          cancelText="취소"
        />
      </Container>
    </SafeAreaView>
  );
};
export default ManageAccountScreen;

const Header = styled.View`
  padding: 0 0 0 22px;
  height: 56px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${COLOR.GRAY_EB};
`;
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
  border-bottom-color: ${COLOR.GRAY_EB};
`;
