import styled from '@emotion/native';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, SafeAreaView, View } from 'react-native';
import { FontText, Input, Space, TextButton } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useChangePasswordQuery, useCheckPasswordQuery } from '@/global/apis/hooks';
import MyTabModal from '@/global/components/MyTabModal';
import { debounce } from 'lodash';
import XCircle from '@assets/icons/x-circle-standard.svg';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import IconCheck from '@assets/icons/check_standard.svg';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';

const ChangePwScreen = () => {
  const myPageNavigation = useMyPageNavigation();
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
    } else {
      setIsNewPwValid(false);
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
      setIsPwRight(false);
    },
  });

  const { changePasswordMutate } = useChangePasswordQuery({
    onSuccess: () => {
      setPopupVisible(true);
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
    myPageNavigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.WHITE }}>
      <Header>
        <Pressable hitSlop={20} onPress={() => myPageNavigation.goBack()}>
          <IconLeftArrowHead color="#3F3F46" />
        </Pressable>
        <Space width="21px" />
        <FontText value="비밀번호 변경" textSize="18px" lineHeight="23px" textWeight="Medium" />
        <View style={{ flex: 1 }} />
        <Pressable hitSlop={20} onPress={onPressDone}>
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
            textWeight="SemiBold"
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
        </Pressable>
      </Header>

      <Container>
        <Space height="39px" />

        <FontText
          value="현재 비밀번호"
          textSize="14px"
          textWeight="Medium"
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
        </InputContainer>
        {curPassword !== '' && (
          <MessageContainer>
            {isPwRight ? <IconCheck stroke={COLOR.LIGHT_GREEN} /> : <XCircle width={14} />}
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
          textWeight="Medium"
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
        </InputContainer>
        {isNewEqualsToOld && changePassword !== '' && (
          <>
            <MessageContainer>
              <XCircle height={14} />
              <FontText
                value=" 기존 비밀번호는 사용할 수 없어요"
                textSize="12px"
                textWeight="Medium"
                lineHeight="14px"
                textColor={COLOR.LIGHT_RED}
              />
            </MessageContainer>
            <Space height="10px" />
          </>
        )}
        {!isNewEqualsToOld && changePassword !== '' && (
          <>
            <MessageContainer>
              <IconCheck stroke={lengValidColor} />
              <Space width="4px" />
              <FontText
                value="8자-20자 이내"
                textSize="12px"
                textWeight="Medium"
                textColor={lengValidColor}
              />
              <Space width="12px" />
              <IconCheck stroke={comValidColor} />
              <Space width="4px" />
              <FontText
                value="영어, 숫자, 특수문자 포함"
                textSize="12px"
                textWeight="Medium"
                textColor={comValidColor}
              />
            </MessageContainer>
            <Space height="10px" />
          </>
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
        </InputContainer>
        {confirmPassword !== '' && changePassword !== '' && (
          <MessageContainer>
            {confirmPassword !== changePassword ? (
              <XCircle width={14} />
            ) : (
              <IconCheck stroke={COLOR.LIGHT_GREEN} />
            )}
            <FontText
              value={
                confirmPassword !== changePassword
                  ? ' 비밀번호가 일치하지 않습니다'
                  : ' 비밀번호가 일치합니다'
              }
              textSize="12px"
              textWeight="Medium"
              lineHeight="14px"
              textColor={confirmPassword !== changePassword ? COLOR.LIGHT_RED : COLOR.LIGHT_GREEN}
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
    </SafeAreaView>
  );
};
export default ChangePwScreen;

const Header = styled.View`
  padding: 0 22px;
  height: 56px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Container = styled.View`
  flex: 1;
  padding: 0 16px;
`;
const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px 8px 18.25px;
  margin: 6px 0 2px;
  background-color: ${COLOR.GRAY_F2};
  border-radius: 5px;
`;
const MessageContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 6px 0 0 9px;
`;
const PwInput = styled(Input)`
  height: 36px;
  flex: 1;
`;
