import { COLOR } from '@/global/constants';
import cn from 'classname';
import { FontText, Input } from '@/global/ui';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useCheckNickname, useSignUp } from '../apis/hooks';
import { debounce } from 'lodash';
import { useAppDispatch } from '@/store';
import { getAuthorizationState, saveUserInfo } from '@/store/modules';
import StepButton from '../ui/StepButton';
import { setEncryptedStorage } from '@/global/utils';
import IconCheck from '@assets/icons/check.svg';
import IconXCircle from '@assets/icons/x-circle-standard.svg';
import { SignUpParams } from '../apis/entity';
import messaging from '@react-native-firebase/messaging';
import React from 'react';
import { trackRegisterFinish, trackRegisterTerms } from '@/analytics/register.events';
import { trackLogin } from '@/analytics/auth.events';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NicknameStepProps {
  nicknameValue: string;
  signUpData: SignUpParams;
  changeNicknameValue: (value: string) => void;
  setStep: () => void;
}

const NicknameStep = ({
  nicknameValue,
  signUpData,
  changeNicknameValue,
  setStep,
}: NicknameStepProps) => {
  const dispatch = useAppDispatch();

  const [checkMessage, setCheckMessage] = useState<string>('');

  const { signUpMutate } = useSignUp({
    onSuccess: async (res) => {
      const { email, nickName, accessToken, refreshToken, memberId } = res;
      dispatch(saveUserInfo({ email, nickname: nickName }));
      dispatch(getAuthorizationState('success auth'));
      await setEncryptedStorage('access_token', accessToken);
      await setEncryptedStorage('refresh_token', refreshToken);
      await AsyncStorage.removeItem('isSocialLoggedIn');
      trackRegisterFinish('email');
      trackLogin({ type: 'email', userId: memberId, email });
      setStep();
    },
  });

  const { data, isLoading, checkNicknameMutate } = useCheckNickname({
    onSettled: (data, error) => {
      if (!!data) setCheckMessage(data.message);
      else if (!!error) {
        if (error.response?.status === 409) setCheckMessage('중복된 닉네임입니다');
        if (error.response?.status === 422)
          setCheckMessage('사용할 수 없는 단어가 포함되어 있습니다');
        if (error.response?.status === 400)
          setCheckMessage('영어(소문자,대문자), 한글, 숫자만 입력 가능합니다');
      }
    },
  });

  const changeNicknameHandler = (value: string) => {
    if (value.length > 7) return;
    changeNicknameValue(value);
    setCheckMessage('');
    checkNicknameDebounce(value);
  };

  const checkNicknameDebounce = useCallback(
    debounce((value: string) => {
      if (value.length < 2) return;
      checkNicknameMutate(value);
    }, 700),
    [],
  );

  useEffect(() => {
    trackRegisterTerms();
  }, []);

  return (
    <View className="flex-1">
      <View className="gap-10">
        <FontText text={`사용하실 닉네임을\n입력해주세요`} className="text-24" fontWeight="700" />
        <FontText
          text="다른 사용자들이 볼 수 있고, 내 프로필에서 수정할 수 있어요"
          className="text-13 text-gray-999"
        />
      </View>

      <View className="flex-1 mt-40">
        <View className="justify-center pl-16 mt-6 mb-8 rounded-5 bg-gray-f2 py-13">
          <Input
            value={nicknameValue}
            placeholder="닉네임 입력"
            placeholderTextColor={COLOR.GRAY_BE}
            fontSize="16px"
            onChangeText={(text) => changeNicknameHandler(text)}
            className="h-25"
          />
        </View>

        <View className="flex-row items-center ml-9">
          {checkMessage && (
            <>
              {data?.state === 200 ? (
                <IconCheck width={14} height={14} color={COLOR.LIGHT_GREEN} />
              ) : (
                <IconXCircle width={14} height={14} />
              )}
              <View className="w-3" />
              <FontText
                text={checkMessage}
                className={cn('text-12', {
                  'text-light-green': data?.state === 200,
                  'text-light-red': data?.state !== 200,
                })}
                fontWeight="500"
              />
            </>
          )}
          {!!nicknameValue && nicknameValue.length < 2 && (
            <>
              <IconXCircle width={14} height={14} />
              <View className="w-3" />
              <FontText
                text="2~7글자 입력해주세요"
                className="text-12 text-light-red"
                fontWeight="500"
              />
            </>
          )}
        </View>
      </View>

      <StepButton
        value="확인"
        backgroundCondition={
          data?.state === 200 && !!checkMessage && !isLoading && nicknameValue.length >= 2
        }
        onPress={async () => {
          const firebaseToken = await messaging().getToken();
          signUpMutate({
            ...signUpData,
            nickName: signUpData.nickname,
            firebaseToken,
          });
        }}
        disabled={data?.state !== 200 || (!checkMessage && isLoading && nicknameValue.length < 2)}
      />
    </View>
  );
};

export default NicknameStep;
