import { useMemo, useState } from 'react';
import { View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { FontText } from '@/global/ui';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import IconChevronLeft from '@assets/icons/icon_chevron-left.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoticeContainer from './NoticeContainer';
import { LoadingScreen, NetworkErrorScreen } from '@/global/components';
import { useGetUpdateNotices } from '../apis/hooks';

const NoticesScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { data, refetch, fetchNextPage, hasNextPage, isLoading, isError } = useGetUpdateNotices();

  const flattenedData = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) ?? [];
  }, [data]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (isError || !data) {
    return <NetworkErrorScreen retryFn={refetch} />;
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-16 space-x-12 border-b-1 border-gray-beb">
        <TouchableOpacity onPress={() => myPageNavigation.goBack()} hitSlop={20}>
          <IconChevronLeft />
        </TouchableOpacity>
        <FontText text="공지사항" className="text-18 leading-23" fontWeight="500" />
      </View>

      <FlatList
        data={flattenedData}
        renderItem={({ item, index }) => (
          <NoticeContainer item={item} key={`${index}_${item.noticeId}`} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        ListFooterComponent={<View className="h-64" />}
        ListEmptyComponent={
          <View className="items-center justify-center flex-1">
            <FontText text="공지사항이 없어요" className="text-[#DEDEDE]" />
          </View>
        }
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
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
    </SafeAreaView>
  );
};

export default NoticesScreen;
