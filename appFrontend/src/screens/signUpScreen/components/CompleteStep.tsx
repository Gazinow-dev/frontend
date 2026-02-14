import { FontText } from '@/global/ui';
import { Image, View } from 'react-native';
import StepButton from '../ui/StepButton';
import { useRootNavigation } from '@/navigation/RootNavigation';

interface Props {
  nickname: string;
}

const CompleteStep = ({ nickname }: Props) => {
  const navigation = useRootNavigation();

  return (
    <View className="flex-1">
      <FontText
        text={`${nickname}님의 \n회원가입을 축하드립니다!`}
        className="text-24"
        fontWeight="700"
      />

      <View className="items-center flex-1 mt-52">
        <Image source={require('../../../assets/images/clap_3d.png')} className="h-342 w-328" />
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
