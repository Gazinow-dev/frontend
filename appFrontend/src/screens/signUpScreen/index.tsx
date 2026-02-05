import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { CompleteStep, EmailStep, NicknameStep, PasswordStep } from './components';
import { useAuthNavigation } from '@/navigation/AuthNavigation';
import IconArrowLeft from '@assets/icons/arrow-left.svg';
import { SignUpParams } from './apis/entity';
import { trackRegisterStart } from '@/analytics/register.events';
import { SafeAreaView } from 'react-native-safe-area-context';

export type SignUpStepType = 'email' | 'password' | 'nickname' | 'complete';

const SignUpScreen = () => {
  const navigation = useAuthNavigation();

  const [step, setStep] = useState<SignUpStepType>('email');
  const [signUpData, setSignUpData] = useState<SignUpParams>({
    email: '',
    password: '',
    nickname: '',
  });

  const changeSignUpValue = (key: SignUpStepType, value: string) => {
    setSignUpData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const backStepHandler = () => {
    switch (step) {
      case 'email':
        navigation.goBack();
        break;
      case 'password':
        setStep('email');
        break;
      case 'nickname':
        setStep('password');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    trackRegisterStart();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-9f9">
      <View className="flex-1 px-16">
        <View className="mb-43 mt-30">
          {step === 'complete' ? (
            <View className="h-24" />
          ) : (
            <TouchableOpacity hitSlop={10} onPress={backStepHandler}>
              <IconArrowLeft />
            </TouchableOpacity>
          )}
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={30}
        >
          {step === 'email' && (
            <EmailStep
              setStep={() => setStep('password')}
              emailValue={signUpData.email}
              changeEmailValue={(value: string) => changeSignUpValue('email', value)}
            />
          )}
          {step === 'password' && (
            <PasswordStep
              emailValue={signUpData.email}
              passwordValue={signUpData.password}
              changePasswordValue={(value: string) => changeSignUpValue('password', value)}
              setStep={() => setStep('nickname')}
            />
          )}
          {step === 'nickname' && (
            <NicknameStep
              nicknameValue={signUpData.nickname}
              signUpData={signUpData}
              changeNicknameValue={(value: string) => changeSignUpValue('nickname', value)}
              setStep={() => setStep('complete')}
            />
          )}
          {step === 'complete' && <CompleteStep nickname={signUpData.nickname} />}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
