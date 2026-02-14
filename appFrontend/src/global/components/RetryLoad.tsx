import { TouchableOpacity, View } from 'react-native';
import { FontText } from '@global/ui';
import { IconReload } from '@/assets/icons';

interface Props {
  retryFn: () => void;
}

const RetryLoad = ({ retryFn }: Props) => (
  <View className="py-70">
    <FontText text="다시 불러오기" className="text-center text-14 leading-21 text-gray-999" />
    <TouchableOpacity onPress={retryFn} className="mt-8 items-center" hitSlop={30}>
      <IconReload />
    </TouchableOpacity>
  </View>
);
export default RetryLoad;
