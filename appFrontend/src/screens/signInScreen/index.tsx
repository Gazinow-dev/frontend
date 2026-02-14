import { useState } from 'react';
import cn from 'classname';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { FontText, Input } from '@/global/ui';
import { setEncryptedStorage } from '@/global/utils';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { SignInFormTypes } from './apis/entity';
import { useSignInMutation } from './apis/hooks';
import { COLOR } from '@/global/constants';
import { useAppDispatch } from '@/store';
import { getAuthorizationState, saveUserInfo } from '@/store/modules';
import { IconArrowLeft, IconInvalid } from '@assets/icons';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trackLogin } from '@/analytics/auth.events';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      await AsyncStorage.removeItem('isSocialLoggedIn');
      trackLogin({ type: 'email', userId: data.memberId, email: data.email });
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
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1 px-16"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <TouchableOpacity
            className="mb-45 mt-30"
            hitSlop={20}
            onPress={() => navigation.goBack()}
          >
            <IconArrowLeft />
          </TouchableOpacity>

          <FontText
            text="이메일로 로그인"
            className="text-24 leading-35 text-black"
            fontWeight="600"
          />

          <View className="mt-55 flex-1 space-y-20">
            <View>
              <FontText
                text="Email"
                className="text-14 leading-21 text-gray-183"
                fontWeight="500"
              />
              <View className="mt-6 rounded-5 bg-gray-f2 py-13 pl-16">
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
            </View>
            <View>
              <FontText
                text="Password"
                className="text-14 leading-21 text-gray-183"
                fontWeight="500"
              />
              <View className="mt-6 rounded-5 bg-gray-f2 py-13 pl-16">
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
            </View>

            {!!errorMessage && (
              <View className="ml-9 mt-8 flex-row items-center space-x-3">
                <IconInvalid />
                <FontText text={errorMessage} className="text-12 text-light-red" fontWeight="500" />
              </View>
            )}
          </View>

          <TouchableOpacity
            className={cn('mb-20 items-center rounded-5 bg-gray-ddd py-11', {
              'bg-black-717': isValidEmail && !!formData.password,
            })}
            onPress={submitFormData}
            disabled={!isValidEmail || !formData.password}
          >
            <FontText text="로그인" className="text-17 leading-26 text-white" fontWeight="600" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
