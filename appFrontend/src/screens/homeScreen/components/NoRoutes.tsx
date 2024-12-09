import { View } from 'react-native';
import { FontText } from '@/global/ui';

const NoRoutes = () => (
  <View className="border-t-1 border-gray-beb">
    <FontText
      text="저장한 경로가 없어요"
      className="text-center text-16 py-27 text-gray-999"
      fontWeight="500"
    />
  </View>
);

export default NoRoutes;
