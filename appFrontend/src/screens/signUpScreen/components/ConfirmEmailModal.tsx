import { COLOR } from '@/global/constants';
import cn from 'classname';
import { FontText, Input } from '@/global/ui';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import { TimerType } from './EmailStep';
import IconXCircle from '@assets/icons/x-circle-standard.svg';
import StepButton from '../ui/StepButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import IconLeftArrow from '@assets/icons/left_arrow_round.svg';
import LoadingCircle from '@/global/components/animations/LoadingCircle';
import { trackRegisterAuthSend } from '@/analytics/register.events';

interface ConfirmEmailModalProps {
  authNumber: string;
  timerValue: TimerType;
  closeModal: () => void;
  setStep: () => void;
  emailConfirmMutateHandler: () => void;
  isLoading: boolean;
}

const ConfirmEmailModal = ({
  authNumber,
  timerValue,
  closeModal,
  setStep,
  emailConfirmMutateHandler,
  isLoading,
}: ConfirmEmailModalProps) => {
  const StatusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) + 30 : 30;
  const [resendTextWidth, setResendTextWidth] = useState<number>(0);

  const animRef = useRef(new Animated.Value(500)).current;

  const [authNumberValue, setAuthNumberValue] = useState<string>('');
  const [isNotPass, setIsNotPass] = useState<boolean>(false);

  const freshTimerSeconds =
    timerValue.seconds < 10 ? `0${timerValue.seconds}` : timerValue.seconds + '';

  const changeValue = (value: string) => {
    setAuthNumberValue(value);
    setIsNotPass(false);
  };

  const checkAuthNumber = () => {
    if (authNumberValue === authNumber) setStep();
    else setIsNotPass(true);
  };

  useEffect(() => {
    const animation = Animated.timing(animRef, {
      toValue: StatusBarHeight,
      duration: 600,
      useNativeDriver: true,
    });

    animation.start();
    trackRegisterAuthSend();

    return () => animation.stop();
  }, []);

  return (
    <Modal
      visible
      onRequestClose={() => closeModal()}
      transparent
      // statusBarTranslucent FIXME: 모달 풀화면 요구시 활성화
      // presentationStyle="overFullScreen" FIXME: 모달 풀화면 요구시 활성화
    >
      {/* 백그라운드 */}
      <View className="flex-1 bg-[#00000099]">
        {/* 콘텐츠 */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="justify-end flex-1"
        >
          <Animated.View
            className="flex-1 px-16 pt-32 bg-white"
            style={{
              borderTopStartRadius: 14,
              borderTopEndRadius: 14,
              paddingBottom: StatusBarHeight,
              transform: [{ translateY: animRef }],
            }}
          >
            <TouchableOpacity hitSlop={10} className="mb-28" onPress={closeModal}>
              <IconLeftArrow color={COLOR.BASIC_BLACK} />
            </TouchableOpacity>

            <FontText
              text={`메일로 받은 인증번호를\n입력해주세요`}
              className="text-24"
              fontWeight="700"
            />

            <View className="flex-1 mt-57">
              <View className="flex-row items-center justify-center px-16 rounded-5 bg-gray-f2 py-13">
                <Input
                  value={authNumberValue}
                  placeholder="인증번호 4자리"
                  placeholderTextColor={COLOR.GRAY_BE}
                  fontSize="14px"
                  onChangeText={(value) => changeValue(value)}
                  keyboardType="number-pad"
                  className="flex-1 h-25"
                  maxLength={4}
                />
                <FontText text={timerValue.minutes + ':' + freshTimerSeconds} className="text-13" />
              </View>

              <View className="ml-[10.17] mt-7 flex-row items-center">
                {isNotPass && <IconXCircle width={14} height={14} />}
                <View className="w-3" />
                <FontText
                  text={
                    timerValue.minutes === 0 && timerValue.seconds === 0
                      ? '인증번호 만료시간이 지났습니다'
                      : '인증번호가 일치하지 않습니다'
                  }
                  className={cn('text-12 text-transparent', {
                    'text-light-red': isNotPass,
                  })}
                  fontWeight="500"
                />
              </View>

              <View className="flex-row justify-center space-x-8 mt-34">
                <FontText
                  text="메일을 받지 못하셨나요?"
                  className="text-13 leading-19 text-gray-999"
                />
                {isLoading ? (
                  <View style={{ width: resendTextWidth }}>
                    <LoadingCircle size={25} />
                  </View>
                ) : (
                  <Pressable onPress={emailConfirmMutateHandler}>
                    <FontText
                      onLayout={(e) => setResendTextWidth(e.nativeEvent.layout.width)}
                      text="재전송"
                      className="text-13 leading-18 text-gray-999"
                      fontWeight="700"
                      style={{ textDecorationLine: 'underline' }}
                    />
                  </Pressable>
                )}
              </View>
            </View>

            <StepButton
              value="입력완료"
              backgroundCondition={authNumberValue.length === 4}
              onPress={checkAuthNumber}
              disabled={authNumberValue.length < 4}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ConfirmEmailModal;
