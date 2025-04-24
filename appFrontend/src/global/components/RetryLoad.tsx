import { TouchableOpacity, View } from 'react-native';
import { FontText } from '@global/ui';
import IconReload from '@assets/icons/reload.svg';

interface RetryLoadProps {
  retryFn: () => void;
}

const RetryLoad = ({ retryFn }: RetryLoadProps) => (
  <View className="py-70">
    <FontText text="다시 불러오기" className="text-center text-gray-999 leading-21 text-14" />
    <TouchableOpacity onPress={retryFn} className="items-center mt-8" hitSlop={30}>
      <IconReload />
    </TouchableOpacity>
  </View>
);
export default RetryLoad;
