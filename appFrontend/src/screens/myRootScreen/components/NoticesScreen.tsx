import { useState } from 'react';
import { View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { FontText } from '@/global/ui';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import IconChevronLeft from '@assets/icons/icon_chevron-left.svg';
import NetworkErrorScreen from '@/global/components/NetworkErrorScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from 'react-query';
import { getNotices } from '../apis/func';
import NoticeContainer from './NoticeContainer';
import LoadingCircle from '@/global/components/animations/LoadingCircle';

const NoticesScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { data, refetch, isLoading, isError } = useQuery('getNotices', getNotices);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <LoadingCircle width={50} height={50} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center space-x-12 border-b-1 border-gray-beb p-16">
        <TouchableOpacity onPress={() => myPageNavigation.goBack()} hitSlop={20}>
          <IconChevronLeft />
        </TouchableOpacity>
        <FontText text="공지사항" className="text-18 leading-23" fontWeight="500" />
      </View>
      {isError ? (
        <NetworkErrorScreen retryFn={refetch} />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <NoticeContainer item={item} key={`${index}_${item.noticeId}`} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          ListFooterComponent={<View className="h-64" />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <FontText text="공지사항이 없어요" className="text-[#DEDEDE]" />
            </View>
          }
          refreshControl={
            <RefreshControl
              onRefresh={async () => {
                setIsRefreshing(true);
                await refetch();
                setIsRefreshing(false);
              }}
              refreshing={isRefreshing}
              progressViewOffset={-10}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default NoticesScreen;
