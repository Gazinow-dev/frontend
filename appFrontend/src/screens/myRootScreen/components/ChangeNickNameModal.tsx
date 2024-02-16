import styled from '@emotion/native';
import { useState } from 'react';
import { Modal, Platform, StatusBar } from 'react-native';
import { FontText, Input, Space, TextButton } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useChangeNicknameQuery } from '@/global/apis/hook';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import XCircle from '@assets/icons/x-circle.svg';
import DeleteInputIcon from '@assets/icons/deleteInput.svg';
import CloseBtn from '@assets/icons/closeBtn.svg';

interface ModalProps {
  onCancel: () => void;
}

const ChangeNickNameModal = ({ onCancel }: ModalProps) => {
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) + 4 : (StatusBar.currentHeight as number) - 4;

  const [newNickname, setNewNickname] = useState<string>('');
  const [isNicknameValid, setIsNicknameValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { mutate } = useChangeNicknameQuery({
    onSuccess: () => {
      onCancel();
      //TODO: 성공 토스트 띄우기
    },
    onError: (error: any) => {
      setIsNicknameValid(false);
      setErrorMessage(getErrorMessage(error.response?.status));
      console.error(error);
    },
  });

  const getErrorMessage = (status: number | undefined) => {
    switch (status) {
      case 409:
        return '중복된 닉네임입니다.';
      case 404:
        return '회원이 존재하지 않습니다. 다시 로그인해주세요.';
      case 400:
        return '7글자 이하의 한글, 알파벳, 숫자를 입력해주세요.\n한글 자모음 단독으로 입력 불가';
      default:
        return '닉네임 변경에 실패하였습니다. 다시 시도해주세요.';
    }
  };

  return (
    <Modal visible onRequestClose={onCancel}>
      <Header
        style={{
          paddingTop: StatusBarHeight,
        }}
      >
        <TitleContainer>
          <CloseBtn width="24px" onPress={onCancel} />
          <Space width="12px" />
          <FontText value="닉네임 수정" textSize="18px" lineHeight="23px" textWeight="Medium" />
        </TitleContainer>
        <TextButton
          value="완료"
          textSize="16px"
          textColor={COLOR.GRAY_999}
          textWeight="Medium"
          lineHeight="21px"
          onPress={() => mutate(newNickname)}
        />
      </Header>
      <Container>
        <InputContainer>
          <SearchInput
            value={newNickname}
            placeholder={`새 닉네임을 입력하세요`}
            placeholderTextColor={COLOR.GRAY_999}
            inputMode="search"
            onChangeText={setNewNickname}
            autoFocus
          />
          <DeleteInputIcon width={19.5} onPress={() => setNewNickname('')} />
        </InputContainer>

        {!isNicknameValid && (
          <MessageContainer>
            <XCircle width={14} />
            <Space width="5px" />
            <FontText
              value={errorMessage}
              textSize="14px"
              textWeight="Medium"
              lineHeight="16px"
              textColor="#EB5147"
            />
          </MessageContainer>
        )}
      </Container>
    </Modal>
  );
};
export default ChangeNickNameModal;

const Header = styled.View`
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Container = styled.View`
  flex: 1;
  background-color: ${COLOR.GRAY_F9};
`;
const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #d4d4d4;
  padding: 8px 16px 8px 18.25px;
  margin: 34px 16px 0;
  background-color: ${COLOR.WHITE};
`;
const MessageContainer = styled.View`
  margin: 8px 25px;
  flex-direction: row;
`;
const SearchInput = styled(Input)`
  height: 36px;
  flex: 1;
`;
