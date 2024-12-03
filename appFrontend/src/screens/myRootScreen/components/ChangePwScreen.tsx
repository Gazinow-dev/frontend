import React, { useCallback, useEffect, useState } from 'react';
import cn from 'classname';
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
    onError: () => {
      setIsPwRight(false);
    },
  });

  const { changePasswordMutate } = useChangePasswordMutation({
    onSuccess: () => {
      setPopupVisible(true);
    },
    onError: () => {
      setIsNewPwValid(false);
      Alert.alert('비밀번호 변경 오류', '비밀번호 변경에 실패했습니다\n다시 시도해주세요');
    },
  });

  const onPressDone = () => {
    const data = { curPassword, changePassword, confirmPassword };
    changePasswordMutate(data);
  };

  const handleOnConfirm = () => {
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
            className="flex-row items-center py-16"
            onPress={() => myPageNavigation.goBack()}
          >
            <IconLeftArrowHead color="#3F3F46" width={24} className="mr-12" />
            <FontText text="비밀번호 변경" className="text-18 leading-23" fontWeight="500" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressDone} disabled={isDoneBtnDisabled}>
            <FontText
              text="완료"
              className={cn('leading-21', {
                'text-gray-999': isDoneBtnDisabled,
              })}
              fontWeight="600"
            />
          </TouchableOpacity>
        </View>

        <FontText text="현재 비밀번호" className="text-14 leading-21" fontWeight="500" />
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
          <View className="flex-row items-center mt-6 mb-10 ml-9">
            {isPwRight ? <IconCheck stroke={COLOR.LIGHT_GREEN} /> : <XCircle width={14} />}
            <FontText
              text={isPwRight ? ' 비밀번호가 확인되었습니다' : ' 비밀번호가 틀립니다'}
              className={cn('text-12 leading-14', {
                'text-light-green': isPwRight,
                'text-light-red': !isPwRight,
              })}
              fontWeight="500"
            />
          </View>
        )}
        <FontText className="mt-28 text-14 leading-21" text="새로운 비밀번호" fontWeight="500" />
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
              text=" 기존 비밀번호는 사용할 수 없어요"
              className="text-12 leading-14 text-light-red"
              fontWeight="500"
            />
          </View>
        )}
        {!isNewEqualsToOld && changePassword !== '' && (
          <View className="flex-row items-center mt-6 mb-10 ml-9">
            <IconCheck stroke={lengValidColor} />
            <FontText
              className="mr-12 text-12"
              text=" 8자-20자 이내"
              fontWeight="500"
              style={{
                color: lengValidColor,
              }}
            />
            <IconCheck stroke={comValidColor} className="ml-12" />
            <FontText
              text=" 영어, 숫자, 특수문자 포함"
              className="text-12"
              fontWeight="500"
              style={{
                color: comValidColor,
              }}
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
              text={
                confirmPassword !== changePassword
                  ? ' 비밀번호가 일치하지 않습니다'
                  : ' 비밀번호가 일치합니다'
              }
              className={cn('text-12 leading-14', {
                'text-light-red': confirmPassword !== changePassword,
                'text-light-green': confirmPassword === changePassword,
              })}
              fontWeight="500"
            />
          </View>
        )}

        <MyTabModal
          isVisible={popupVisible}
          onConfirm={handleOnConfirm}
          title="비밀번호가 변경되었습니다"
          confirmText="확인"
        />
      </View>
    </SafeAreaView>
  );
};
export default ChangePwScreen;
