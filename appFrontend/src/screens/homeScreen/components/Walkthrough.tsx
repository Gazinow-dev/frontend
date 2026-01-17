import { Dimensions, Pressable, View } from 'react-native';
import { useState } from 'react';
import ImageMyPath from '@assets/icons/img_walkthrough_mypath.svg';
import ImageNoti from '@assets/icons/img_walkthrough_noti.svg';
import TextMyPath from '@assets/icons/text_walkthrough_mypath.svg';
import TextNoti from '@assets/icons/text_walkthrough_noti.svg';
import { isFirstRunType } from '@/navigation/MainBottomTabNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WalkthroughProps {
  setIsFirstRun: (isFirstRun: isFirstRunType) => void;
}

const Walkthrough = ({ setIsFirstRun }: WalkthroughProps) => {
  const { width, height } = Dimensions.get('window');
  const [walkthroughStep, setWalkthroughStep] = useState<'Path' | 'Noti'>('Path');

  return (
    <SafeAreaView className="absolute h-full w-full flex-1 bg-[#000000BF]">
      {walkthroughStep === 'Path' && (
        <Pressable onPress={() => setWalkthroughStep('Noti')}>
          <View style={{ height: height * 0.33 }} />
          <TextMyPath className="mb-16 ml-21" />
          <ImageMyPath className="mx-16" width={width - 32} />
        </Pressable>
      )}
      {walkthroughStep === 'Noti' && (
        <Pressable
          onPress={() => setIsFirstRun('finishedWalkThrough')}
          className="h-full w-full items-end"
        >
          <ImageNoti className="-mt-4 mr-11" />
          <TextNoti className="mr-15 mt-16" />
        </Pressable>
      )}
    </SafeAreaView>
  );
};
export default Walkthrough;
