import { useRootNavigation } from '@/navigation/RootNavigation';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconChevronLeft from '@assets/icons/icon_chevron-left.svg';
import LoadingCircle from '@/global/components/animations/LoadingCircle';

const LoadingScreen = () => {
  const navigation = useRootNavigation();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity className="w-30 p-16" hitSlop={20} onPress={() => navigation.goBack()}>
        <IconChevronLeft />
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center bg-white">
        <LoadingCircle width={50} height={50} />
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
