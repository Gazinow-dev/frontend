import { TouchableOpacity, View } from 'react-native';
import { FontText } from '@global/ui';
import IconChevronLeft from '@assets/icons/icon_chevron-left.svg';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  retryFn: () => void;
}

const NetworkErrorScreen = ({ retryFn }: Props) => {
  const navigation = useRootNavigation();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity className="p-16 w-30" hitSlop={20} onPress={() => navigation.goBack()}>
        <IconChevronLeft />
      </TouchableOpacity>

      <View className="items-center justify-center flex-1 bg-white">
        <FontText
          text="이용에 불편을 드려 죄송합니다"
          className="text-18 leading-23 text-gray-999"
          fontWeight="600"
        />
        <FontText
          text={`일시적인 오류가 발생했어요\n다시 시도해 주세요`}
          className="mt-8 mb-32 text-center text-gray-999"
        />
        <TouchableOpacity onPress={retryFn} className="px-16 py-12 w-80 rounded-5 bg-black-717">
          <FontText text="재시도" className="text-center text-white text-14" fontWeight="600" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NetworkErrorScreen;
