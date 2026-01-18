import { useRootNavigation } from '@/navigation/RootNavigation';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconChevronLeft from '@assets/icons/icon_chevron-left.svg';
import LoadingCircle from '@/global/components/animations/LoadingCircle';

const LoadingScreen = () => {
  const navigation = useRootNavigation();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity className="p-16 w-30" hitSlop={20} onPress={() => navigation.goBack()}>
        <IconChevronLeft />
      </TouchableOpacity>

      <View className="items-center justify-center flex-1 bg-white">
        <LoadingCircle />
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
