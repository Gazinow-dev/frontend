import React, { useMemo, useState } from 'react';
import { SingleIssueContainer, LaneButtons, PopularIssues } from './components';
import { FreshSubwayLineName, IssueGet, NowScreenCapsules } from '@/global/apis/entity';
import { FlatList, RefreshControl, View } from 'react-native';
import {
  useGetAllIssuesQuery,
  useGetIssuesByLaneQuery,
  useGetPopularIssuesQuery,
} from '@/global/apis/hooks';
import { FontText } from '@/global/ui';
import { subwayReturnLineName } from '@/global/utils/subwayLine';
import LoadingCircle from '@/global/components/animations/LoadingCircle';
import { SafeAreaView } from 'react-native-safe-area-context';

const NowScreen = () => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<NowScreenCapsules>('전체');

  const { popularIssues, popularIssuesRefetch } = useGetPopularIssuesQuery();

  const {
    allIssues,
    allIssuesRefetch,
    allIssuesHasNextPage,
    fetchAllIssuesNextPage,
    isAllIssuesLoading,
  } = useGetAllIssuesQuery();

  const { laneIssues, laneIssuesRefetch, laneIssuesHasNextPage, fetchLaneIssuesNextPage } =
    useGetIssuesByLaneQuery(subwayReturnLineName(activeButton as FreshSubwayLineName)!);

  // 선택된 캡슐에 따른 데이터 렌더링
  const flattenedData = useMemo(() => {
    if (activeButton === '전체') {
      return allIssues?.pages.flatMap((page) => page.content) ?? [];
    }
    return laneIssues?.pages.flatMap((page) => page.content) ?? [];
  }, [activeButton, allIssues, laneIssues]);

  const isDataEmpty = flattenedData.length < 1;

  const data = isDataEmpty ? ['LaneButtons', ''] : ['LaneButtons', ...flattenedData];

  const renderItem = ({ item, index }: { item: IssueGet | string; index: number }) => {
    if (index === 0) {
      return <LaneButtons activeButton={activeButton} setActiveButton={setActiveButton} />;
    } else if (isDataEmpty) {
      return (
        <View className="h-[70%] items-center justify-center">
          <FontText text="올라온 이슈가 없어요" className="text-18 text-gray-999" />
        </View>
      );
    } else {
      return <SingleIssueContainer key={`${item}_${index}`} issue={item as IssueGet} />;
    }
  };

  const ListHeaderComponent = (
    <>
      <PopularIssues popularIssues={popularIssues ?? []} />
      <FontText
        text={`${activeButton} ${activeButton === '전체' ? '이슈' : 'NOW'}`}
        className="mx-16 mt-32 text-20 leading-25"
        fontWeight="600"
      />
    </>
  );

  const ListFooterComponent = !isDataEmpty ? <View className="h-64" /> : <></>;

  const onRefreshHandler = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        popularIssuesRefetch(),
        activeButton === '전체' ? allIssuesRefetch() : laneIssuesRefetch(),
      ]);
    } catch (error) {
      // TODO: 에러 처리
    } finally {
      setIsRefreshing(false);
    }
  };

  const refreshControl = <RefreshControl onRefresh={onRefreshHandler} refreshing={isRefreshing} />;

  const onEndReachedHandler = () => {
    if (activeButton === '전체' && allIssuesHasNextPage) {
      fetchAllIssuesNextPage();
    } else if (activeButton !== '전체' && laneIssuesHasNextPage) {
      fetchLaneIssuesNextPage();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {isAllIssuesLoading ? (
        <View className="items-center justify-center flex-1">
          <LoadingCircle width={50} height={50} />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          refreshControl={refreshControl}
          onEndReached={onEndReachedHandler}
          onEndReachedThreshold={0.7}
          stickyHeaderIndices={[1]}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item, index) => `${item}_${index}`}
        />
      )}
    </SafeAreaView>
  );
};

export default NowScreen;
