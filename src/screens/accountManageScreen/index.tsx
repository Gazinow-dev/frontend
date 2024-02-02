import React, { useState } from 'react';
import styled from '@emotion/native';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useLogoutMutation } from '../loginScreen/apis/hook';
import { LOGIN, MY_NAVIGATION } from '@/global/constants';
import { getEncryptedStorage } from '@/global/utils';
import { TextButton } from '@/global/ui';
import { CHANGE_PW, CONFIRM_QUIT } from '@/global/constants/navigation';
import MyTabModal from '../../global/components/MyTabModal';

interface RenderMenuProps {
  text: string;
  onPress: () => void;
}

const AccountManageScreen = () => {
  const navigation = useRootNavigation();
  const [popupVisible, setPopupVisible] = useState(false);

  const { logoutMutate } = useLogoutMutation({
    onSuccess: () => navigation.reset({ routes: [{ name: LOGIN }] }),
  });

  const handleConfirm = async () => {
    const accessToken = await getEncryptedStorage('access_token');
    const refreshToken = await getEncryptedStorage('refresh_token');
    logoutMutate({ accessToken, refreshToken });
    hideModal();
  };

  const showLogoutPopup = () => setPopupVisible(true);
  const hideModal = () => setPopupVisible(false);

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
      {renderMenu({
        text: '비밀번호 변경',
        onPress: () => navigation.push(MY_NAVIGATION, { screen: CHANGE_PW }),
      })}
      {renderMenu({ text: '로그아웃', onPress: () => showLogoutPopup() })}
      {renderMenu({
        text: '회원 탈퇴',
        onPress: () => navigation.push(MY_NAVIGATION, { screen: CONFIRM_QUIT }),
      })}
      <MyTabModal
        isVisible={popupVisible}
        onCancel={hideModal}
        onConfirm={handleConfirm}
        title="로그아웃 할까요?"
        confirmText="로그아웃"
        cancelText="취소"
      />
    </Container>
  );
};
export default AccountManageScreen;

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