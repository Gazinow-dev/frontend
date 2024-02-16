import styled from '@emotion/native';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useState } from 'react';
import { FontText, Space, TextButton } from '@/global/ui';
import { COLOR } from '@/global/constants';
import MyTabModal from '../../../global/components/MyTabModal';
import { useCheckPasswordQuery, useDeleteAccountMutation } from '@/global/apis/hook';
import { Modal, Platform, StatusBar } from 'react-native';
import { removeEncryptedStorage } from '@/global/utils';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import BackBtn from '@assets/icons/backBtn.svg';

interface ConfirmQuitModalProps {
  onCancel: () => void;
}

const ConfirmQuitModal = ({ onCancel }: ConfirmQuitModalProps) => {
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) + 4 : (StatusBar.currentHeight as number) - 4;

  const nickName = '사용자17349245';
  const navigation = useRootNavigation();
  const [popupVisible, setPopupVisible] = useState(false);
  const [confirmPwPopupVisible, setConfirmPwPopupVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const { deleteAccountMutate } = useDeleteAccountMutation({
    onSuccess: () => {
      removeEncryptedStorage('access_token');
      removeEncryptedStorage('refresh_token');
      navigation.reset({ routes: [{ name: 'AuthStack' }] });
    },
  });

  const { checkPasswordMutate } = useCheckPasswordQuery({
    onSuccess: () => {
      deleteAccountMutate();
      hideModal();
    },
    onError: (error) => {
      if (error.response.status === 400) {
        setPasswordInput('');
        //TODO: 기획 나오면 에러 처리 추가, css 수정
      }
    },
  });

  const handleConfirm = () => {
    hideModal();
    setConfirmPwPopupVisible(true);
  };
  const handleConfirmPw = () => {
    checkPasswordMutate(passwordInput);
  };

  const showQuitPopup = () => setPopupVisible(true);
  const hideModal = () => {
    setPopupVisible(false);
    setConfirmPwPopupVisible(false);
  };

  return (
    <Modal visible onRequestClose={onCancel}>
      {/* TODO: 헤더 버튼 svg로 수정, 크기 조정 */}
      <Header
        style={{
          paddingTop: StatusBarHeight,
        }}
      >
        <BackBtn width="24px" onPress={onCancel} />
      </Header>
      <Container>
        <AlertContainer>
          <FontText
            value={`${nickName}님,\n정말 탈퇴하시겠어요?`}
            textSize="24px"
            textWeight="Bold"
            lineHeight="32px"
          />
          <Space height="20px" />
          <FontText
            value={`탈퇴 시 계정의 모든 정보는 삭제되고\n재가입 시에도 복구하기 어려워요.`}
            textSize="16px"
            textWeight="Regular"
            lineHeight="21px"
          />
        </AlertContainer>
        <BottomBtn onPress={onCancel}>
          <TextButton
            value="이전으로 돌아가기"
            textSize="17px"
            textWeight="Regular"
            lineHeight="26px"
            textColor={COLOR.WHITE}
            onPress={onCancel}
          />
        </BottomBtn>
        <QuitBtn>
          <UnderLine>
            <TextButton
              value="탈퇴하기"
              textSize="13px"
              textWeight="Regular"
              lineHeight="18px"
              textColor={COLOR.GRAY_999}
              onPress={() => showQuitPopup()}
            />
          </UnderLine>
        </QuitBtn>
        <MyTabModal
          isVisible={popupVisible}
          onCancel={hideModal}
          onConfirm={handleConfirm}
          title="정말 탈퇴할까요?"
          confirmText="탈퇴할래요"
          cancelText="아니요"
        />
        {/* TODO: 키보드 올라오면 하단 버튼 올라오는 버그 수정 */}
        <MyTabModal
          isVisible={confirmPwPopupVisible}
          onCancel={hideModal}
          onConfirm={handleConfirmPw}
          title="비밀번호 확인"
          confirmText="탈퇴할래요"
          cancelText="취소"
          inputValue={passwordInput}
          setInputValue={setPasswordInput}
        />
      </Container>
    </Modal>
  );
};
export default ConfirmQuitModal;

const Header = styled.View`
  padding: 20px;
  flex-direction: row;
  align-items: center;
`;
const Container = styled.View`
  background-color: white;
  padding: 0 16px;
  flex: 1;
`;
const AlertContainer = styled.Pressable`
  flex: 1;
  margin-top: 29px;
`;
const BottomBtn = styled.Pressable`
  padding-vertical: 11px;
  margin-bottom: 24px;
  border-radius: 5px;
  align-items: center;
  background-color: ${COLOR.BASIC_BLACK};
`;
const QuitBtn = styled.Pressable`
  align-items: center;
  margin-bottom: 79px;
`;
const UnderLine = styled.Pressable`
  border-bottom-width: 1px;
  border-bottom-color: ${COLOR.GRAY_999};
`;
