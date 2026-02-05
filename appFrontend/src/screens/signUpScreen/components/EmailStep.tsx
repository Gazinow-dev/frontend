import { View } from 'react-native';
import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useEffect, useRef, useState } from 'react';
import { useEmailConfirm } from '../apis/hooks';
import ConfirmEmailModal from './ConfirmEmailModal';
import useBackgroundInterval from '../hooks/useBackgroundInterval';
import StepButton from '../ui/StepButton';
import IconCheck from '@assets/icons/check.svg';
import IconXCircle from '@assets/icons/x-circle-standard.svg';

const emailValidation = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);

export interface TimerType {
  minutes: number;
  seconds: number;
}

interface Props {
  emailValue: string;
  setStep: () => void;
  changeEmailValue: (value: string) => void;
}

const EmailStep = ({ emailValue, setStep, changeEmailValue }: Props) => {
  const { authNumber, resetAuthNumber, emailConfirmMutate, isLoading } = useEmailConfirm({
    onSuccess: () => {
      setIsOpenConfirmModal(true);
    },
    onError: (error) => {
      setIsValidEmail(false);
      if (error.response?.status === 409) {
        setErrorMessage('이미 가입된 이메일입니다');
      } else if (error.response?.status === 400) {
        setErrorMessage('올바른 이메일 형식이 아닙니다');
      }
    },
  });

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [timer, setTimer] = useState<TimerType>({
    minutes: 5,
    seconds: 0,
  });

  const changeEmailHandler = (text: string) => {
    changeEmailValue(text);
    setErrorMessage('');
    if (!text) return;
    const isValid = emailValidation.test(text);
    setIsValidEmail(isValid);
  };

  const closeModal = () => {
    resetAuthNumber();
    resetTimer();
    setIsOpenConfirmModal(false);
  };

  const emailConfirmMutateHandler = () => emailConfirmMutate(emailValue);

  const resetTimer = () => {
    setTimer({
      minutes: 5,
      seconds: 0,
    });
  };

  const timerHandler = () => {
    if ((timer.minutes === 0 && timer.seconds === 0) || !isOpenConfirmModal) return;
    if (timer.seconds > 0) {
      setTimer((prev) => ({ ...prev, seconds: prev.seconds - 1 }));
    } else if (timer.seconds === 0) {
      setTimer((prev) => ({ minutes: prev.minutes - 1, seconds: 59 }));
    }
  };

  useBackgroundInterval(timerHandler, 1000);

  useEffect(() => {
    if (timer.minutes === 0 && timer.seconds === 0) {
      resetAuthNumber();
    }
  }, [timer]);

  return (
    <>
      {isOpenConfirmModal && (
        <ConfirmEmailModal
          authNumber={authNumber}
          timerValue={timer}
          closeModal={closeModal}
          setStep={setStep}
          emailConfirmMutateHandler={emailConfirmMutateHandler}
          isLoading={isLoading}
        />
      )}

      <View className="flex-1">
        <View className="gap-10 mb-51">
          <FontText text="회원가입" className="text-24" fontWeight="700" />
          <FontText
            text="본인인증을 위한 이메일을 입력해주세요"
            className="text-gray-9999 text-13"
          />
        </View>

        <View className="flex-1">
          <FontText text="Email" className="text-14 text-gray-183" fontWeight="500" />
          <View className="justify-center pl-16 mt-6 mb-8 rounded-5 bg-gray-f2 py-13">
            <Input
              isBlur={isOpenConfirmModal}
              value={emailValue}
              placeholder="이메일(아이디)입력"
              placeholderTextColor={COLOR.GRAY_BE}
              fontSize="16px"
              onChangeText={(text) => changeEmailHandler(text)}
              keyboardType="email-address"
              className="h-25"
            />
          </View>
          <View className="flex-row items-center ml-9">
            {!errorMessage && isValidEmail && (
              <>
                <IconCheck width={14} height={14} color={COLOR.LIGHT_GREEN} />
                <View className="w-3" />
                <FontText
                  text="올바른 이메일 형식입니다"
                  className="text-12 text-light-green"
                  fontWeight="500"
                />
              </>
            )}
            {!errorMessage && !isValidEmail && emailValue && (
              <>
                <IconXCircle width={14} height={14} />
                <View className="w-3" />
                <FontText
                  text="올바른 이메일 형식이 아닙니다"
                  className="text-12 text-light-red"
                  fontWeight="500"
                />
              </>
            )}
            {errorMessage && (
              <>
                <IconXCircle width={14} height={14} />
                <View className="w-3" />
                <FontText text={errorMessage} className="text-12 text-light-red" fontWeight="500" />
              </>
            )}
          </View>
        </View>

        <StepButton
          value="인증메일 전송"
          backgroundCondition={isValidEmail}
          onPress={emailConfirmMutateHandler}
          disabled={!isValidEmail || isLoading}
          isLoading={isLoading}
        />
      </View>
    </>
  );
};

export default EmailStep;
