import { ScrollView, View } from 'react-native';
import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import IconCheck from '@assets/icons/check.svg';
import { useEffect, useState } from 'react';
import SubscribeTermsModal from './SubscribeTermsModal';
import StepButton from '../ui/StepButton';
import { trackRegisterAuthFinish } from '@/analytics/register.events';

const combinationValidation = new RegExp(
  /^(?=.*[a-zA-Z])(?=.*[!~.,?@#$%^&()_/|;:'"<>*+=-])(?=.*[0-9])/,
);

interface PasswordStepProps {
  emailValue: string;
  passwordValue: string;
  setStep: () => void;
  changePasswordValue: (value: string) => void;
}

const PasswordStep = ({
  emailValue,
  passwordValue,
  changePasswordValue,
  setStep,
}: PasswordStepProps) => {
  const [isTermsOpenModal, setIsTermsOpenModal] = useState<boolean>(false);
  const [isValueCombination, setIsValidCombination] = useState<boolean>(false);
  const [isValidLength, setIsValidLength] = useState<boolean>(false);

  const changeEmailHandler = (text: string) => {
    changePasswordValue(text);

    if (!text) return;
    const isCombination = combinationValidation.test(text);
    setIsValidCombination(isCombination);
    const isLength = text.length >= 8 && text.length <= 20;
    setIsValidLength(isLength);
  };

  const comValidColor = isValueCombination ? COLOR.LIGHT_GREEN : COLOR.GRAY_999;
  const lengValidColor = isValidLength ? COLOR.LIGHT_GREEN : COLOR.GRAY_999;

  const closeModal = () => setIsTermsOpenModal(false);

  useEffect(() => {
    trackRegisterAuthFinish();
  }, []);

  return (
    <>
      {isTermsOpenModal && <SubscribeTermsModal setStep={setStep} closeModal={closeModal} />}
      <View className="flex-1">
        <View className="gap-10">
          <FontText text="회원가입" className="text-24" fontWeight="700" />
          <FontText text="비밀번호를 입력해주세요" className="text-13 text-gray-999" />
        </View>

        <ScrollView className="flex-1 mt-51">
          <FontText text="Email" className="text-14 text-gray-183" fontWeight="500" />
          <View className="justify-center h-48 px-16 mt-6 mb-20 rounded-5 bg-gray-f2">
            <FontText text={emailValue} fontWeight="500" />
          </View>
          <FontText text="Password" className="text-14 text-gray-183" fontWeight="500" />
          <View className="justify-center px-16 mt-6 rounded-5 bg-gray-f2 py-13">
            <Input
              value={passwordValue}
              placeholder="비밀번호 입력"
              placeholderTextColor={COLOR.GRAY_BE}
              fontSize="16px"
              onChangeText={(text) => changeEmailHandler(text)}
              secureTextEntry
              className="h-25"
            />
          </View>
          <View className="flex-row items-center mt-8 mb-40 ml-9">
            <IconCheck width={12} height={12} color={lengValidColor} />
            <FontText
              text="8자-20자 이내"
              fontWeight="500"
              style={{ color: lengValidColor }}
              className="ml-4 mr-12 text-12"
            />
            <IconCheck width={12} height={12} color={comValidColor} />
            <FontText
              text="영어, 숫자, 특수문자 포함"
              fontWeight="500"
              style={{ color: comValidColor }}
              className="mr-12 text-12"
            />
          </View>
        </ScrollView>

        <StepButton
          value="회원가입"
          backgroundCondition={isValidLength && isValueCombination}
          onPress={() => setIsTermsOpenModal(true)}
          disabled={!isValidLength || !isValueCombination}
        />
      </View>
    </>
  );
};

export default PasswordStep;
