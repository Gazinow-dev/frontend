import { Dimensions, Pressable, SafeAreaView, View } from 'react-native';
import { useState } from 'react';
import ImageMyPath from '@assets/icons/img_walkthrough_mypath.svg';
import ImageNoti from '@assets/icons/img_walkthrough_noti.svg';
import TextMyPath from '@assets/icons/text_walkthrough_mypath.svg';
import TextNoti from '@assets/icons/text_walkthrough_noti.svg';
import { isFirstRunType } from '@/navigation/MainBottomTabNavigation';

interface WalkthroughProps {
  setIsFirstRun: (isFirstRun: isFirstRunType) => void;
}

const Walkthrough = ({ setIsFirstRun }: WalkthroughProps) => {
  const { width, height } = Dimensions.get('window');
  const [walkthroughStep, setWalkthroughStep] = useState<'Path' | 'Noti'>('Path');

  return (
    <SafeAreaView className="absolute flex-1 w-full h-full bg-[#000000BF]">
      {walkthroughStep === 'Path' && (
        <Pressable onPress={() => setWalkthroughStep('Noti')}>
          <View style={{ height: height * 0.26 }} />
          <TextMyPath className="mb-16 ml-21" />
          <ImageMyPath className="mx-16" width={width - 32} />
        </Pressable>
      )}
      {walkthroughStep === 'Noti' && (
        <Pressable
          onPress={() => setIsFirstRun('finishedWalkThrough')}
          className="items-end w-full h-full"
        >
          <ImageNoti className="mr-11 mt-9" />
          <TextNoti className="mt-16 mr-15" />
        </Pressable>
      )}
    </SafeAreaView>
  );
};
export default Walkthrough;
