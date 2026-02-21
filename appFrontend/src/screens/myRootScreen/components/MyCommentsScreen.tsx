import { useMemo, useState } from 'react';
import { View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { FontText } from '@/global/ui';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import { useGetMyComments } from '@screens/myRootScreen/apis/hooks';
import SingleCommentContainer from '@/screens/myRootScreen/components/SingleCommentContainer';
import { IconChevronLeft } from '@assets/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingScreen, NetworkErrorScreen } from '@/global/components';

const MyCommentsScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { data, refetch, fetchNextPage, hasNextPage, isLoading, isError } = useGetMyComments();

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
      <View className="flex-row items-center space-x-12 border-b-1 border-gray-beb p-16">
        <TouchableOpacity onPress={() => myPageNavigation.goBack()} hitSlop={20}>
          <IconChevronLeft />
        </TouchableOpacity>
        <FontText text="내가 쓴 댓글" className="text-18 leading-23" fontWeight="500" />
      </View>

      <FlatList
        data={flattenedData}
        renderItem={({ item, index }) => (
          <SingleCommentContainer item={item} key={`${index}_${item.issueCommentId}`} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        ListFooterComponent={<View className="h-64" />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <FontText text="내가 쓴 댓글이 없어요" className="text-[#DEDEDE]" />
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

export default MyCommentsScreen;
