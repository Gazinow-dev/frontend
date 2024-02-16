import styled from '@emotion/native';
import { useCallback, useState } from 'react';
import { Alert, Modal, Platform, StatusBar } from 'react-native';
import { FontText, Input, Space, TextButton } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useChangePasswordQuery, useCheckPasswordQuery } from '@/global/apis/hook';
import MyTabModal from '@/global/components/MyTabModal';
import { debounce } from 'lodash';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import XCircle from '@assets/icons/x-circle.svg';
import Check from '@assets/icons/check.svg';
import DeleteInputIcon from '@assets/icons/deleteInput.svg';
import CloseBtn from '@assets/icons/closeBtn.svg';

interface ModalProps {
  onCancel: () => void;
}

const ChangePwModal = ({ onCancel }: ModalProps) => {
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) + 4 : (StatusBar.currentHeight as number) - 4;

  const [popupVisible, setPopupVisible] = useState<boolean>(false);

  const [curPassword, setCurPassword] = useState<string>('');
  const [changePassword, setChangePassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isPwRight, setIsPwRight] = useState<boolean>(false);
  const [isNewPwValid, setIsNewPwValid] = useState<boolean>(false);

  const [isValueCombination, setIsValidCombination] = useState<boolean>(false);
  const [isValidLength, setIsValidLength] = useState<boolean>(false);

  const combinationValidation = new RegExp(
    /^(?=.*[a-zA-Z])(?=.*[!~.,?@#$%^&()_/|;:'"<>*+=-])(?=.*[0-9])/,
  );

  const checkInputValid = (text: string) => {
    setChangePassword(text);

    const isCombination = combinationValidation.test(text);
    setIsValidCombination(isCombination);
    const isLength = text.length >= 8 && text.length <= 20;
    setIsValidLength(isLength);

    if (isValueCombination && isValidLength) {
      setIsNewPwValid(true);
    }
  };

  const lengValidColor = isValidLength ? COLOR.LIGHT_GREEN : COLOR.GRAY_999;
  const comValidColor = isValueCombination ? COLOR.LIGHT_GREEN : COLOR.GRAY_999;

  const isNewEqualsToOld = curPassword === changePassword;

  const checkPasswordDebounce = useCallback(
    debounce((curPassword: string) => {
      checkPasswordMutate(curPassword);
    }, 500),
    [],
  );

  const handleCurPasswordChange = (curPassword: string) => {
    setCurPassword(curPassword);
    checkPasswordDebounce(curPassword);
  };

  const { checkPasswordMutate } = useCheckPasswordQuery({
    onSuccess: () => {
      setIsPwRight(true);
    },
    onError: (error: any) => {
      console.log(error);
      setIsPwRight(false);
    },
  });

  const { changePasswordMutate } = useChangePasswordQuery({
    onSuccess: () => {
      setPopupVisible(true);
      // TODO: 성공 토스트 띄우기
    },
    onError: (error: any) => {
      setIsNewPwValid(false);
      Alert.alert('비밀번호 변경 오류', '비밀번호 변경에 실패했습니다\n다시 시도해주세요');
    },
  });

  const onPressDone = () => {
    const data = { curPassword, changePassword, confirmPassword };
    changePasswordMutate(data);
  };

  const handleOnCancel = () => {
    setPopupVisible(false);
    onCancel();
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
          <FontText value="비밀번호 변경" textSize="18px" lineHeight="23px" textWeight="Medium" />
        </TitleContainer>
        <TextButton
          value="완료"
          textSize="16px"
          textColor={
            !isPwRight ||
            !isNewPwValid ||
            !isValidLength ||
            !isValueCombination ||
            isNewEqualsToOld ||
            confirmPassword !== changePassword
              ? COLOR.GRAY_999
              : COLOR.BASIC_BLACK
          }
          textWeight="Medium"
          lineHeight="21px"
          onPress={onPressDone}
          disabled={
            !isPwRight ||
            !isNewPwValid ||
            !isValidLength ||
            !isValueCombination ||
            isNewEqualsToOld ||
            confirmPassword !== changePassword
          }
        />
      </Header>

      <Container>
        <Space height="24px" />

        <FontText
          value="현재 비밀번호"
          textSize="14px"
          textWeight="SemiBold"
          lineHeight="21px"
          textColor={COLOR.BASIC_BLACK}
        />

        <InputContainer>
          <PwInput
            value={curPassword}
            placeholder={`비밀번호를 입력해주세요`}
            placeholderTextColor={COLOR.GRAY_BE}
            inputMode="text"
            onChangeText={handleCurPasswordChange}
            autoFocus
            secureTextEntry
          />
          <DeleteInputIcon width={19.5} onPress={() => setCurPassword('')} />
        </InputContainer>
        {curPassword !== '' && (
          <MessageContainer>
            {isPwRight ? <Check width={12} color={lengValidColor} /> : <XCircle width={14} />}
            <FontText
              value={isPwRight ? ' 비밀번호가 확인되었습니다' : ' 비밀번호가 틀립니다'}
              textSize="12px"
              textWeight="Medium"
              lineHeight="14px"
              textColor={isPwRight ? COLOR.LIGHT_GREEN : COLOR.LIGHT_RED}
            />
          </MessageContainer>
        )}

        <Space height="28px" />
        <FontText
          value="새로운 비밀번호"
          textSize="14px"
          textWeight="SemiBold"
          lineHeight="21px"
          textColor={COLOR.BASIC_BLACK}
        />
        <InputContainer>
          <PwInput
            value={changePassword}
            placeholder={`변경하실 비밀번호를 입력해주세요`}
            placeholderTextColor={COLOR.GRAY_BE}
            inputMode="text"
            onChangeText={(text) => checkInputValid(text)}
            secureTextEntry
          />
          <DeleteInputIcon width={19.5} onPress={() => setChangePassword('')} />
        </InputContainer>
        {isNewEqualsToOld ? (
          <MessageContainer>
            <XCircle width={14} />
            <FontText
              value=" 이전과 동일한 비밀번호로 변경할 수 없습니다"
              textSize="12px"
              textWeight="Medium"
              lineHeight="14px"
              textColor={COLOR.LIGHT_RED}
            />
          </MessageContainer>
        ) : (
          <MessageContainer>
            <Check width={12} color={lengValidColor} />
            <Space width="4px" />
            <FontText
              value="8자-20자 이내"
              textSize="12px"
              textWeight="Medium"
              textColor={lengValidColor}
            />
            <Space width="12px" />
            <Check width={12} color={comValidColor} />
            <Space width="4px" />
            <FontText
              value="영어, 숫자, 특수문자 포함"
              textSize="12px"
              textWeight="Medium"
              textColor={comValidColor}
            />
          </MessageContainer>
        )}

        <InputContainer>
          <PwInput
            value={confirmPassword}
            placeholder={`비밀번호를 확인해주세요`}
            placeholderTextColor={COLOR.GRAY_BE}
            inputMode="text"
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <DeleteInputIcon width={19.5} onPress={() => setConfirmPassword('')} />
        </InputContainer>
        {confirmPassword !== '' && confirmPassword !== changePassword && (
          <MessageContainer>
            <XCircle width={14} />
            <FontText
              value={` 비밀번호가 일치하지 않습니다`}
              textSize="12px"
              textWeight="Medium"
              lineHeight="14px"
              textColor={COLOR.LIGHT_RED}
            />
          </MessageContainer>
        )}
      </Container>

      <MyTabModal
        isVisible={popupVisible}
        onCancel={() => {
          handleOnCancel();
        }}
        title="비밀번호가 변경되었습니다"
        cancelText="확인"
        btnColor={COLOR.GRAY_F9}
      />
    </Modal>
  );
};
export default ChangePwModal;

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
  padding: 0 16px;
  background-color: ${COLOR.GRAY_F9};
`;
const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #d4d4d4;
  padding: 8px 16px 8px 18.25px;
  margin: 10px 0 0;
  background-color: ${COLOR.WHITE};
`;
const MessageContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 8px 0 0 9px;
`;
const PwInput = styled(Input)`
  height: 36px;
  flex: 1;
`;
