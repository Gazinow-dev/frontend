import { useState } from 'react';
import cn from 'classname';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontText, Input, Space } from '@/global/ui';
import { setEncryptedStorage } from '@/global/utils';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { SignInFormTypes } from './apis/entity';
import { useSignInMutation } from './apis/hooks';
import { COLOR } from '@/global/constants';
import { useAppDispatch } from '@/store';
import { getAuthorizationState, saveUserInfo } from '@/store/modules';
import IconXCircle from '@assets/icons/x-circle-standard.svg';
import IconLeftArrow from '@assets/icons/left_arrow_round.svg';
import messaging from '@react-native-firebase/messaging';

const emailValidation = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);

const initialFormState: SignInFormTypes = {
  email: '',
  password: '',
};

const SignInScreen = () => {
  const navigation = useRootNavigation();
  const dispatch = useAppDispatch();

  const { isLoading, signInMutate } = useSignInMutation({
    onSuccess: async (data) => {
      dispatch(saveUserInfo({ nickname: data.nickName, email: data.email }));
      dispatch(getAuthorizationState('success auth'));
      await setEncryptedStorage('access_token', data.accessToken);
      await setEncryptedStorage('refresh_token', data.refreshToken);
      navigation.reset({ routes: [{ name: 'MainBottomTab' }] });
    },
    onError: ({ status }) => {
      if (status === 401) setErrorMessage('비밀번호가 올바르지 않습니다');
      else setErrorMessage('이메일 또는 비밀번호를 확인해주세요');
    },
  });

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignInFormTypes>(initialFormState);

  const changeFormText = (type: 'email' | 'password', text: string) => {
    setFormData((prev) => ({ ...prev, [type]: text }));
    setErrorMessage('');

    if (type === 'email') {
      const isValid = emailValidation.test(text);
      setIsValidEmail(isValid);
    }
  };

  const submitFormData = async () => {
    const firebaseToken = await messaging().getToken();
    signInMutate({ ...formData, firebaseToken });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-9f9">
      <KeyboardAvoidingView
        className="flex-1 px-16"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity
          hitSlop={20}
          className="mb-43 mt-30 w-30"
          onPress={() => navigation.goBack()}
        >
          <IconLeftArrow color={COLOR.BASIC_BLACK} />
        </TouchableOpacity>

        <FontText text="이메일로 로그인" className="text-black text-24" fontWeight="700" />

        <Space height={75} />

        <ScrollView className="flex-1">
          <FontText text="Email" className="text-14 text-gray-183" fontWeight="500" />
          <View className="justify-center pl-16 mt-6 bg-gray-f2 py-13 rounded-5">
            <Input
              value={formData.email}
              placeholder="이메일을 입력해주세요"
              placeholderTextColor={COLOR.GRAY_BE}
              fontSize="16px"
              onChangeText={(text) => changeFormText('email', text)}
              keyboardType="email-address"
              isBlur={isLoading}
              textContentType="oneTimeCode"
              className="h-25"
            />
          </View>

          <Space height={20} />

          <FontText text="Password" className="text-14 text-gray-183" fontWeight="500" />
          <View className="justify-center pl-16 mt-6 bg-gray-f2 py-13 rounded-5">
            <Input
              placeholder="비밀번호를 입력해주세요"
              value={formData.password}
              placeholderTextColor={COLOR.GRAY_BE}
              fontSize="16px"
              onChangeText={(text) => changeFormText('password', text)}
              secureTextEntry
              isBlur={isLoading}
              className="h-25"
            />
          </View>

          {!!errorMessage && (
            <View className="flex-row items-center mt-8 ml-9">
              <IconXCircle width={14} height={14} />
              <Space width={3} />
              <FontText text={errorMessage} className="text-12 text-light-red" fontWeight="500" />
            </View>
          )}
        </ScrollView>
        <TouchableOpacity
          className={cn('rounded-5 justify-center items-center h-48 mb-20 bg-black-717', {
            'bg-gray-ddd': !(isValidEmail && !!formData.password),
          })}
          onPress={submitFormData}
          disabled={!isValidEmail || !formData.password}
        >
          <FontText text="로그인" className="text-white" fontWeight="600" />
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Space height={20} />
    </SafeAreaView>
  );
};

export default SignInScreen;
