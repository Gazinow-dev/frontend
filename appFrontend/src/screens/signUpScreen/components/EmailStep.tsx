import { View } from 'react-native';
import type { TextInput } from 'react-native/types';
import { FontText, Input, Space } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useEffect, useRef, useState } from 'react';
import { useEmailConfirm } from '../apis/hooks';
import ConfirmEmailModal from './ConfirmEmailModal';
import useBackgroundInterval from '../hooks/useBackgroundInterval';
import StepButton from '../ui/StepButton';
import IconCheck from '@assets/icons/check.svg';
import IconXCircle from '@assets/icons/x-circle-standard.svg';

const emailValidation = new RegExp(
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
);

export interface TimerType {
  minutes: number;
  seconds: number;
}

interface EmailStepProps {
  emailValue: string;
  setStep: () => void;
  changeEmailValue: (value: string) => void;
}

const EmailStep = ({ emailValue, setStep, changeEmailValue }: EmailStepProps) => {
  const inputRef = useRef<TextInput>(null);

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

      <View style={{ flex: 1 }}>
        <View style={{ marginBottom: 51 }}>
          <FontText
            value="회원가입"
            textSize="24px"
            textWeight="Bold"
            textColor={COLOR.BASIC_BLACK}
          />
          <Space height="10px" />
          <FontText
            value="본인인증을 위한 이메일을 입력해주세요"
            textSize="13px"
            textWeight="Regular"
            textColor={COLOR.GRAY_999}
          />
        </View>

        <View style={{ flex: 1 }}>
          <FontText value="Email" textSize="14px" textWeight="Medium" textColor="#7c8183" />
          <View
            style={{
              backgroundColor: COLOR.GRAY_F2,
              paddingVertical: 13,
              marginTop: 6,
              marginBottom: 8,
              justifyContent: 'center',
              paddingLeft: 16,
              borderRadius: 5,
            }}
          >
            <Input
              isBlur={isOpenConfirmModal}
              value={emailValue}
              placeholder="이메일(아이디)입력"
              placeholderTextColor={COLOR.GRAY_BE}
              fontSize="16px"
              onChangeText={(text) => changeEmailHandler(text)}
              keyboardType="email-address"
              style={{ height: 25 }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 9 }}>
            {!errorMessage && isValidEmail && (
              <>
                <IconCheck width={14} height={14} color={COLOR.LIGHT_GREEN} />
                <Space width="3px" />
                <FontText
                  value="올바른 이메일 형식입니다"
                  textSize="12px"
                  textWeight="Medium"
                  textColor={COLOR.LIGHT_GREEN}
                />
              </>
            )}
            {!errorMessage && !isValidEmail && emailValue && (
              <>
                <IconXCircle width={14} height={14} />
                <Space width="3px" />
                <FontText
                  value="올바른 이메일 형식이 아닙니다"
                  textSize="12px"
                  textWeight="Medium"
                  textColor={COLOR.LIGHT_RED}
                />
              </>
            )}
            {errorMessage && (
              <>
                <IconXCircle width={14} height={14} />
                <Space width="3px" />
                <FontText
                  value={errorMessage}
                  textSize="12px"
                  textWeight="Medium"
                  textColor={COLOR.LIGHT_RED}
                />
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
