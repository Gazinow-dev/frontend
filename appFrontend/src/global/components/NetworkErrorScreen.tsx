import { TouchableOpacity, View } from 'react-native';
import { FontText } from '@global/ui';
import IconChevronLeft from '@assets/icons/icon_chevron-left.svg';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NetworkErrorScreenProps {
  retryFn: () => void;
  isShowBackBtn?: boolean;
}

const NetworkErrorScreen = ({ retryFn, isShowBackBtn }: NetworkErrorScreenProps) => {
  const navigation = useRootNavigation();
  return (
    <SafeAreaView className="flex-1 bg-white">
      {isShowBackBtn && (
        <TouchableOpacity className="w-30 p-16" hitSlop={20} onPress={() => navigation.goBack()}>
          <IconChevronLeft />
        </TouchableOpacity>
      )}

      <View className="flex-1 items-center justify-center bg-white">
        <FontText
          text="이용에 불편을 드려 죄송합니다"
          className="text-18 leading-23 text-gray-999"
          fontWeight="600"
        />
        <FontText
          text={`일시적인 오류가 발생했어요\n다시 시도해 주세요`}
          className="mb-32 mt-8 text-center text-gray-999"
        />
        <TouchableOpacity onPress={retryFn} className="w-80 rounded-5 bg-black-717 px-16 py-12">
          <FontText text="확인" className="text-center text-14 text-white" fontWeight="600" />
        </TouchableOpacity>
      </View>

      <View className="h-100" />
    </SafeAreaView>
  );
};

export default NetworkErrorScreen;
