import React, { useState } from 'react';
import styled from '@emotion/native';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { getEncryptedStorage, removeEncryptedStorage } from '@/global/utils';
import { FontText, Space, TextButton } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useLogoutMutation } from '@/screens/signInScreen/apis/hook';
import ChangePwModal from './ChangePwModal';
import MyTabModal from '@/global/components/MyTabModal';
import { Modal, Platform, StatusBar } from 'react-native';
import ConfirmQuitModal from './ConfirmQuitModal';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import BackBtn from '@assets/icons/backBtn.svg';

interface RenderMenuProps {
  text: string;
  onPress: () => void;
}
interface ManageAccountModalProps {
  onCancel: () => void;
}

const ManageAccountModal = ({ onCancel }: ManageAccountModalProps) => {
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) + 4 : (StatusBar.currentHeight as number) - 4;

  const navigation = useRootNavigation();
  const [popupVisible, setPopupVisible] = useState(false);
  const [isChangePwModalOpened, setIsChangePwModalOpened] = useState(false);
  const [isConfirmQuitModalOpen, setIsConfirmQuitModalOpen] = useState<boolean>(false);

  const { logoutMutate } = useLogoutMutation({
    onSuccess: () => {
      removeEncryptedStorage('access_token');
      removeEncryptedStorage('refresh_token');
      navigation.reset({ routes: [{ name: 'AuthStack' }] });
    },
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
    <Modal visible onRequestClose={onCancel}>
      {/* TODO: 헤더 버튼 svg로 수정, 크기 조정 */}
      <Header
        style={{
          paddingTop: StatusBarHeight,
        }}
      >
        <BackBtn width="24px" onPress={onCancel} />
        <Space width="20px" />
        <FontText value="계정 관리" textSize="18px" lineHeight="23px" textWeight="Medium" />
      </Header>
      <Container>
        {renderMenu({
          text: '비밀번호 변경',
          onPress: () => setIsChangePwModalOpened(true),
        })}
        {renderMenu({ text: '로그아웃', onPress: () => showLogoutPopup() })}
        {renderMenu({
          text: '회원 탈퇴',
          onPress: () => setIsConfirmQuitModalOpen(true),
        })}
        {isChangePwModalOpened && (
          <ChangePwModal onCancel={() => setIsChangePwModalOpened(false)} />
        )}
        <MyTabModal
          isVisible={popupVisible}
          onCancel={hideModal}
          onConfirm={handleConfirm}
          title="로그아웃 할까요?"
          confirmText="로그아웃"
          cancelText="취소"
        />
      </Container>
      {isConfirmQuitModalOpen && (
        <ConfirmQuitModal onCancel={() => setIsConfirmQuitModalOpen(false)} />
      )}
    </Modal>
  );
};
export default ManageAccountModal;

const Header = styled.View`
  padding: 20px;
  flex-direction: row;
  align-items: center;
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
