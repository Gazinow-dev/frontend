import { MyPageStackParamList } from '@/navigation/types/navigation';
import { useRoute } from '@react-navigation/native';
import { useQuery } from 'react-query';
import { getNoticeDetail } from '../apis/func';
import NetworkErrorScreen from '@/global/components/NetworkErrorScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontText } from '@/global/ui';
import { TouchableOpacity, View } from 'react-native';
import IconLeftArrowHead from '@assets/icons/icon_chevron-left.svg';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import dayjs from 'dayjs';
import LoadingCircle from '@/global/components/animations/LoadingCircle';

const NoticeDetailScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const { noticeId } = useRoute().params as MyPageStackParamList['NoticeDetailScreen'];

  const { data, refetch, isLoading, isError } = useQuery('getNoticeDetail', () =>
    getNoticeDetail(noticeId),
  );

  if (!data || isError) return <NetworkErrorScreen retryFn={refetch} isShowBackBtn />;

  const { noticeTitle, noticeContent, createdAt } = data;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <LoadingCircle width={50} height={50} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white px-16">
      <TouchableOpacity
        className="w-30 py-16"
        hitSlop={20}
        onPress={() => myPageNavigation.goBack()}
      >
        <IconLeftArrowHead width={24} height={24} color="#3F3F46" />
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
