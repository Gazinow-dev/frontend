import { COLOR } from '@/global/constants';
import { FontText } from '@/global/ui';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, TouchableOpacity, View } from 'react-native';
import IconCheck from '@assets/icons/check.svg';
import { WebView } from 'react-native-webview';
import StepButton from '../ui/StepButton';
import IconX from '@assets/icons/cross_x.svg';
import IconRightArrowHead from '@assets/icons/right_arrow_head.svg';
import { trackRegisterPassword } from '@/analytics/register.events';
import { SafeAreaView } from 'react-native-safe-area-context';

type AgreeTermsType = '약관 전체 동의' | '(필수) 서비스 약관 동의' | '(필수) 개인정보 수집 동의';

const listData: AgreeTermsType[] = ['(필수) 서비스 약관 동의', '(필수) 개인정보 수집 동의'];

interface Props {
  setStep: () => void;
  closeModal: () => void;
}

const SubscribeTermsModal = ({ setStep, closeModal }: Props) => {
  const height = Dimensions.get('window').height;

  const animRef = useRef(new Animated.Value(height)).current;

  const [openUrl, setOpenUrl] = useState<string>('');
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<AgreeTermsType[]>([]);

  useLayoutEffect(() => {
    setIsCheckAll(() => {
      return (
        agreeTerms.includes('약관 전체 동의') || listData.every((term) => agreeTerms.includes(term))
      );
    });
  }, [agreeTerms]);

  const changeAgreeTerms = (text: AgreeTermsType) => {
    const isExist = agreeTerms.includes(text);
    if (isExist) {
      if (agreeTerms.includes('약관 전체 동의')) {
        setAgreeTerms((prev) => prev.filter((item) => item !== text && item !== '약관 전체 동의'));
        return;
      }
      setAgreeTerms((prev) => prev.filter((item) => item !== text));
    } else {
      if (agreeTerms.length === 2) {
        setAgreeTerms((prev) => [...prev, text, '약관 전체 동의']);
        return;
      }
      setAgreeTerms((prev) => [...prev, text]);
    }
  };

  const allChangeAgreeTerms = () => {
    if (isCheckAll) setAgreeTerms([]);
    else setAgreeTerms(['약관 전체 동의', '(필수) 개인정보 수집 동의', '(필수) 서비스 약관 동의']);
  };

  const webViewHandler = (text: AgreeTermsType) => {
    switch (text) {
      case '(필수) 서비스 약관 동의':
        setOpenUrl(
          'https://reflective-pincushion-d6c.notion.site/ver-1-12bd734b37b34bbaa58741e7f72bbda0',
        );
        break;
      case '(필수) 개인정보 수집 동의':
        setOpenUrl(
          'https://reflective-pincushion-d6c.notion.site/ver-1-c94b91a436814e3f86881f9f144f8581?pvs=4',
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const animation = Animated.timing(animRef, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    });

    animation.start();
    trackRegisterPassword();

    return () => animation.stop();
  }, []);

  return (
    <Modal visible onRequestClose={!!openUrl ? () => setOpenUrl('') : closeModal} transparent>
      {!!openUrl ? (
        <SafeAreaView className="flex-1">
          <View className="pb-10 pl-16 bg-white border-b-1 border-gray-ddd pt-13">
            <TouchableOpacity hitSlop={20} onPress={() => setOpenUrl('')}>
              <IconX width={24} height={24} />
            </TouchableOpacity>
          </View>
          <WebView source={{ uri: openUrl }} />
        </SafeAreaView>
      ) : (
        <>
          {/* 백그라운드 */}
          <View className="flex-1 justify-end bg-[#00000099]">
            <Animated.View
              className="h-[65%] bg-white px-16 pt-33"
              style={{
                borderTopStartRadius: 14,
                borderTopEndRadius: 14,
                transform: [{ translateY: animRef }],
              }}
            >
              <Pressable
                hitSlop={10}
                className="flex-row items-center pl-10 mb-15 rounded-5 bg-gray-9f9 py-13"
                onPress={allChangeAgreeTerms}
              >
                <View className="items-center justify-center mr-10 h-22 w-22 rounded-3 bg-gray-3e3">
                  {isCheckAll && <IconCheck width={18} height={18} color={COLOR.WHITE} />}
                </View>
                <FontText text="약관 전체 동의" className="text-14" fontWeight="600" />
              </Pressable>

              <View className="flex-1">
                {listData.map((text) => (
                  <Pressable
                    key={text}
                    hitSlop={10}
                    className="flex-row items-center justify-between pl-10 mb-24"
                    onPress={() => changeAgreeTerms(text)}
                  >
                    <View className="flex-row items-center">
                      <View className="items-center justify-center mr-10 h-22 w-22 rounded-3 bg-gray-3e3">
                        {agreeTerms.includes(text) && (
                          <IconCheck width={18} height={18} color={COLOR.WHITE} />
                        )}
                      </View>
                      <FontText text={text} className="test-14" fontWeight="600" />
                    </View>
                    <TouchableOpacity hitSlop={20} onPress={() => webViewHandler(text)}>
                      <IconRightArrowHead width={12} height={12} color={COLOR.GRAY_CA} />
                    </TouchableOpacity>
                  </Pressable>
                ))}
              </View>

              <StepButton
                value="완료"
                backgroundCondition={isCheckAll}
                onPress={setStep}
                disabled={!isCheckAll}
              />
            </Animated.View>
          </View>
        </>
      )}
    </Modal>
  );
};

export default SubscribeTermsModal;
