import { COLOR } from '@/global/constants';
import { FontText } from '@/global/ui';
import { Image, View } from 'react-native';
import StepButton from '../ui/StepButton';
import { useRootNavigation } from '@/navigation/RootNavigation';

interface CompleteStepProps {
  nickname: string;
}

const CompleteStep = ({ nickname }: CompleteStepProps) => {
  const navigation = useRootNavigation();

  return (
    <View className="flex-1">
      <FontText
        value={`${nickname}님의 \n회원가입을 축하드립니다!`}
        textSize="24px"
        textWeight="Bold"
        textColor={COLOR.BASIC_BLACK}
      />

      <View className="flex-1 items-center mt-52">
        <Image source={require('../../../assets/images/clap_3d.png')} className="w-328 h-342" />
      </View>

      <StepButton
        value="확인"
        backgroundCondition={true} // 검정을 의미함
        onPress={() => navigation.reset({ routes: [{ name: 'MainBottomTab' }] })}
      />
    </View>
  );
};

export default CompleteStep;
