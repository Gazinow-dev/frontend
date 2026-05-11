import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { isFirstRunType } from '@/navigation/MainBottomTabNavigation';
import {
  IconTextWalkthroughMypath,
  IconTextWalkthroughNoti,
  ImgWalkthroughMypath,
  ImgWalkthroughNoti,
} from '@/assets/images';

interface Props {
  setIsFirstRun: (isFirstRun: isFirstRunType) => void;
}

const Walkthrough = ({ setIsFirstRun }: Props) => {
  const { width, height } = Dimensions.get('window');
  const [walkthroughStep, setWalkthroughStep] = useState<'Path' | 'Noti'>('Path');

  return (
    <SafeAreaView className="absolute h-full w-full flex-1 bg-[#000000BF]">
      {walkthroughStep === 'Path' && (
        <Pressable onPress={() => setWalkthroughStep('Noti')}>
          <View style={{ height: height * 0.3 }} />
          <IconTextWalkthroughMypath className="mb-16 ml-21" />
          <ImgWalkthroughMypath className="mx-16" width={width - 32} />
        </Pressable>
      )}
      {walkthroughStep === 'Noti' && (
        <Pressable
          onPress={() => setIsFirstRun('finishedWalkThrough')}
          className="items-end w-full h-full"
        >
          <ImgWalkthroughNoti className="-mt-4 mr-11" />
          <IconTextWalkthroughNoti className="mt-16 mr-15" />
        </Pressable>
      )}
    </SafeAreaView>
  );
};
export default Walkthrough;
