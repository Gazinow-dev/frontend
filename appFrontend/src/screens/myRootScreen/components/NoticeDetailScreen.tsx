import { MyPageStackParamList } from '@/navigation/types/navigation';
import { useRoute } from '@react-navigation/native';
import { useQuery } from 'react-query';
import { getNoticeDetail } from '../apis/func';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontText } from '@/global/ui';
import { TouchableOpacity, View } from 'react-native';
import { IconChevronLeft } from '@assets/icons';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import dayjs from 'dayjs';
import { LoadingScreen, NetworkErrorScreen } from '@/global/components';

const NoticeDetailScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const { noticeId } = useRoute().params as MyPageStackParamList['NoticeDetailScreen'];

  const { data, refetch, isLoading, isError } = useQuery('getNoticeDetail', () =>
    getNoticeDetail(noticeId),
  );

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (isError || !data) {
    return <NetworkErrorScreen retryFn={refetch} />;
  }

  const { noticeTitle, noticeContent, createdAt } = data;

  return (
    <SafeAreaView className="flex-1 bg-white px-16">
      <TouchableOpacity
        className="w-30 py-16"
        hitSlop={20}
        onPress={() => myPageNavigation.goBack()}
      >
        <IconChevronLeft />
      </TouchableOpacity>
      <View className="space-y-28 py-16 pb-64">
        <View className="space-y-12">
          <FontText text={noticeTitle} className="text-20 leading-26" fontWeight="500" />
          <FontText
            text={dayjs(createdAt).format('YYYY.MM.DD')}
            className="text-14 text-gray-999"
          />
        </View>
        <View className="h-1 bg-gray-beb" />
        <FontText text={noticeContent} className="leading-25 text-black" />
      </View>
    </SafeAreaView>
  );
};

export default NoticeDetailScreen;
