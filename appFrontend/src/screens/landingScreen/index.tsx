import { FontText } from '@/global/ui';
import { useAuthNavigation } from '@/navigation/AuthNavigation';
import { Animated, TouchableOpacity, View } from 'react-native';
import SocialLogin from './components/SocialLogin';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconChevronLeftWhite } from '@/assets/icons';

const LandingScreen = () => {
  const navigation = useAuthNavigation();

  return (
    <View className="relative flex-1">
      <View className="absolute top-0 z-10 h-full w-full bg-black/50" />
      <Animated.Image
        source={require('@assets/images/landing_background.png')}
        className="h-full w-full"
        blurRadius={1.25}
      />
      <SafeAreaView className="absolute top-0 z-20 h-full w-full">
        <TouchableOpacity className="p-16" onPress={navigation.goBack} hitSlop={20}>
          <IconChevronLeftWhite />
        </TouchableOpacity>

        <View className="ml-37 mt-68">
          <FontText
            text="가는길 지금,"
            className="text-27 leading-36 tracking-[0px] text-white"
            fontWeight="700"
          />
          <FontText
            text={`무슨 일이\n일어나고 있을까요?`}
            className="text-27 leading-36 tracking-[0px] text-white"
          />
        </View>

        <View className="flex-1" />

        <SocialLogin />

        <View className="mb-83 flex-row items-center justify-center gap-15">
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn')}
            activeOpacity={0.5}
            hitSlop={20}
          >
            <FontText text="이메일 로그인" className="text-13 text-white" fontWeight="500" />
          </TouchableOpacity>
          <FontText text="|" className="text-13 text-white" />
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.5}
            hitSlop={20}
          >
            <FontText text="이메일 회원가입" className="text-13 text-white" fontWeight="500" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default LandingScreen;
