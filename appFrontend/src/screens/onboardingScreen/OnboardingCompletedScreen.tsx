import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { Image, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FontText } from '@/global/ui';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { OnboardingStackParamList } from '@/navigation/types/navigation';

const OnboardingCompletedScreen = () => {
  const navigation = useRootNavigation();
  const { pathName } = useRoute().params as {
    pathName: OnboardingStackParamList['OnboardingCompleted']['pathName'];
  };

  useEffect(() => {
    setTimeout(async () => {
      await AsyncStorage.setItem('showCoachMark', 'true');
      navigation.reset({ routes: [{ name: 'MainBottomTab' }] });
    }, 1000);
  }, []);

  return (
    <SafeAreaView className="flex-1 px-16 bg-gray-9f9 pb-50">
      <View className="items-center justify-center flex-1 space-y-33">
        <FontText text={`${pathName} 저장이 완료됐어요!`} className="text-24" fontWeight="700" />
        <Image source={require('@assets/images/clap_3d.png')} className="h-342 w-328" />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingCompletedScreen;
