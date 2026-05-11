import { Dimensions, Pressable, View } from 'react-native';
import { useState } from 'react';
import { isFirstRunType } from '@/navigation/MainBottomTabNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
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
          <View style={{ height: height * 0.33 }} />
          <IconTextWalkthroughMypath className="mb-16 ml-21" />
          <ImgWalkthroughMypath className="mx-16" width={width - 32} />
        </Pressable>
      )}
      {walkthroughStep === 'Noti' && (
        <Pressable
          onPress={() => setIsFirstRun('finishedWalkThrough')}
          className="h-full w-full items-end"
        >
          <ImgWalkthroughNoti className="-mt-4 mr-11" />
          <IconTextWalkthroughNoti className="mr-15 mt-16" />
        </Pressable>
      )}
    </SafeAreaView>
  );
};
export default Walkthrough;
