import React, { useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import MyTabModal from '@/global/components/MyTabModal';
import { debounce } from 'lodash';
import XCircle from '@assets/icons/x-circle-standard.svg';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import IconCheck from '@assets/icons/check_green.svg';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import { useChangePasswordMutation, useCheckPasswordMutation } from '../apis/hooks';

const ChangePwScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const [popupVisible, setPopupVisible] = useState<boolean>(false);

  const [curPassword, setCurPassword] = useState<string>('');
  const [changePassword, setChangePassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isDoneBtnDisabled, setIsDoneBtnDisabled] = useState<boolean>(true);

  const [isPwRight, setIsPwRight] = useState<boolean>(false);
  const [isNewPwValid, setIsNewPwValid] = useState<boolean>(false);

  const [isValidCombination, setIsValidCombination] = useState<boolean>(false);
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

    if (isCombination && isLength) {
      setIsNewPwValid(true);
    } else {
      setIsNewPwValid(false);
    }
  };

  const lengValidColor = isValidLength ? COLOR.LIGHT_GREEN : COLOR.GRAY_999;
  const comValidColor = isValidCombination ? COLOR.LIGHT_GREEN : COLOR.GRAY_999;

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

  const { checkPasswordMutate } = useCheckPasswordMutation({
    onSuccess: () => {
      setIsPwRight(true);
    },
    onError: (error: any) => {
      setIsPwRight(false);
    },
  });

  const { changePasswordMutate } = useChangePasswordMutation({
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

  useEffect(() => {
    if (
      isPwRight &&
      isNewPwValid &&
      isValidLength &&
      isValidCombination &&
      !isNewEqualsToOld &&
      confirmPassword === changePassword
    ) {
      setIsDoneBtnDisabled(false);
    } else {
      setIsDoneBtnDisabled(true);
    }
  }, [isPwRight, curPassword, confirmPassword, changePassword]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-16">
        <View className="flex-row items-center justify-between mb-39">
          <TouchableOpacity
            className="flex-row items-center gap-16 py-16"
            onPress={() => myPageNavigation.goBack()}
          >
            <IconLeftArrowHead color="#3F3F46" width={24} />
            <FontText value="비밀번호 변경" textSize="18px" lineHeight={23} textWeight="Medium" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressDone} disabled={isDoneBtnDisabled}>
            <FontText
              value="완료"
              textSize="16px"
              textColor={isDoneBtnDisabled ? COLOR.GRAY_999 : COLOR.BASIC_BLACK}
              textWeight="SemiBold"
              lineHeight={21}
            />
          </TouchableOpacity>
        </View>

        <FontText
          value="현재 비밀번호"
          textSize="14px"
          textWeight="Medium"
          lineHeight={21}
          textColor={COLOR.BASIC_BLACK}
        />
        <Input
          className="py-12 mt-6 mb-2 px-18 rounded-5 bg-gray-f2"
          value={curPassword}
          placeholder={`비밀번호를 입력해주세요`}
          placeholderTextColor={COLOR.GRAY_BE}
          inputMode="text"
          onChangeText={handleCurPasswordChange}
          autoFocus
          secureTextEntry
        />
        {curPassword !== '' && (
          <View className="flex-row items-center mt-6 ml-9">
            {isPwRight ? <IconCheck stroke={COLOR.LIGHT_GREEN} /> : <XCircle width={14} />}
            <FontText
              value={isPwRight ? ' 비밀번호가 확인되었습니다' : ' 비밀번호가 틀립니다'}
              textSize="12px"
              textWeight="Medium"
              lineHeight={14}
              textColor={isPwRight ? COLOR.LIGHT_GREEN : COLOR.LIGHT_RED}
            />
          </View>
        )}
        <FontText
          className="mt-28"
          value="새로운 비밀번호"
          textSize="14px"
          textWeight="Medium"
          lineHeight={21}
          textColor={COLOR.BASIC_BLACK}
        />
        <Input
          className="py-12 mt-6 mb-2 px-18 rounded-5 bg-gray-f2"
          value={changePassword}
          placeholder={`변경하실 비밀번호를 입력해주세요`}
          placeholderTextColor={COLOR.GRAY_BE}
          inputMode="text"
          onChangeText={(text) => checkInputValid(text)}
          secureTextEntry
        />
        {isNewEqualsToOld && changePassword !== '' && (
          <View className="flex-row items-center mt-6 mb-10 ml-9">
            <XCircle height={14} />
            <FontText
              value=" 기존 비밀번호는 사용할 수 없어요"
              textSize="12px"
              textWeight="Medium"
              lineHeight={14}
              textColor={COLOR.LIGHT_RED}
            />
          </View>
        )}
        {!isNewEqualsToOld && changePassword !== '' && (
          <View className="flex-row items-center mt-6 mb-10 ml-9">
            <IconCheck stroke={lengValidColor} />
            <FontText
              className="mr-12"
              value=" 8자-20자 이내"
              textSize="12px"
              textWeight="Medium"
              textColor={lengValidColor}
            />
            <IconCheck stroke={comValidColor} />
            <FontText
              value=" 영어, 숫자, 특수문자 포함"
              textSize="12px"
              textWeight="Medium"
              textColor={comValidColor}
            />
          </View>
        )}
        <Input
          className="py-12 mt-6 mb-2 px-18 rounded-5 bg-gray-f2"
          value={confirmPassword}
          placeholder={`비밀번호를 확인해주세요`}
          placeholderTextColor={COLOR.GRAY_BE}
          inputMode="text"
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {confirmPassword !== '' && changePassword !== '' && (
          <View className="flex-row items-center mt-6 ml-9">
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
              lineHeight={14}
              textColor={confirmPassword !== changePassword ? COLOR.LIGHT_RED : COLOR.LIGHT_GREEN}
            />
          </View>
        )}

        <MyTabModal
          isVisible={popupVisible}
          onCancel={() => {
            handleOnCancel();
          }}
          title="비밀번호가 변경되었습니다"
          cancelText="확인"
          isSingleBtn
        />
      </View>
    </SafeAreaView>
  );
};
export default ChangePwScreen;
