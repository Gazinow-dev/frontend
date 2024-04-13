import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { CompleteStep, EmailStep, NicknameStep, PasswordStep } from './components';
import { COLOR } from '@/global/constants';
import { useAuthNavigation } from '@/navigation/AuthNavigation';
import IconLeftArrow from '@assets/icons/left_arrow_round.svg';
import { SignUpParams } from './apis/entity';

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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLOR.GRAY_F9,
      }}
    >
      <View
        style={{
          paddingTop: 30,
          paddingHorizontal: 16,
          flex: 1,
        }}
      >
        <TouchableOpacity
          hitSlop={10}
          activeOpacity={1}
          style={{ marginBottom: 43 }}
          disabled={step === 'complete'}
          onPress={backStepHandler}
        >
          <IconLeftArrow color={step === 'complete' ? 'transparent' : COLOR.BASIC_BLACK} />
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
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
