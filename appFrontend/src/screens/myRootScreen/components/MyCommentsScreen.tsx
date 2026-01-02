import { useMemo, useState } from 'react';
import { View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { FontText } from '@/global/ui';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import { useGetMyComments } from '@screens/myRootScreen/apis/hooks';
import SingleCommentContainer from '@/screens/myRootScreen/components/SingleCommentContainer';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import NetworkErrorScreen from '@/global/components/NetworkErrorScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyCommentsScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { data, refetch, fetchNextPage, hasNextPage, isError } = useGetMyComments();

  const flattenedData = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) ?? [];
  }, [data]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-16 space-x-12 border-b-1 border-gray-beb">
        <TouchableOpacity onPress={() => myPageNavigation.goBack()} hitSlop={20}>
          <IconLeftArrowHead width={24} color="#3F3F46" />
        </TouchableOpacity>
        <FontText text="내가 쓴 댓글" className="text-18 leading-23" fontWeight="500" />
      </View>
      {isError ? (
        <NetworkErrorScreen retryFn={refetch} />
      ) : (
        <FlatList
          data={flattenedData}
          renderItem={({ item, index }) => (
            <SingleCommentContainer item={item} key={`${index}_${item.issueCommentId}`} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          ListFooterComponent={<View className="h-64" />}
          ListEmptyComponent={
            <View className="items-center justify-center flex-1">
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
      )}
    </SafeAreaView>
  );
};

export default MyCommentsScreen;
