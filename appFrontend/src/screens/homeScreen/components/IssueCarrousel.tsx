import React, { useState, useEffect, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, View } from 'react-native';
import { useGetPopularIssuesQuery } from '@/global/apis/hooks';
import { FontText } from '@/global/ui';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useAppDispatch } from '@/store';
import { getIssueId } from '@/store/modules';
import dayjs from 'dayjs';
import { IssueContent } from '@/global/apis/entity';
import { useQueryClient } from 'react-query';
import { COLOR } from '@/global/constants';

interface IssueCarrouselProps {
  isRefreshing: boolean;
  setIsRefreshing: (isRefreshing: boolean) => void;
}

const IssueCarrousel = ({ isRefreshing, setIsRefreshing }: IssueCarrouselProps) => {
  const navigation = useRootNavigation();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { popularIssues, popularIssuesRefetch, isPopularIssuesLoading } =
    useGetPopularIssuesQuery();
  const [itemWidth, setItemWidth] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    queryClient.invalidateQueries(['getPopularIssues']);
    if (isRefreshing) {
      popularIssuesRefetch();
    }
    setIsRefreshing(false);
  }, [isRefreshing]);

  const [newPopularIssues, setNewPopularIssues] = useState<IssueContent[]>();

  useEffect(() => {
    if (!popularIssues || popularIssues.length === 0) return;

    const startData = popularIssues[0];
    const newList = [...popularIssues, startData];

    setNewPopularIssues(newList);
  }, [popularIssues]);

  const [autoScrollTime, setAutoscrollTime] = useState<number>(3000);

  useEffect(() => {
    if (!popularIssues || popularIssues.length === 0) return;

    const interval = setInterval(() => {
      if (currentIndex === popularIssues.length) {
        setAutoscrollTime(1);
        scrollViewRef.current?.scrollTo({ x: 0, animated: false });
        setCurrentIndex(0);
        setAutoscrollTime(3000);
      } else {
        scrollViewRef.current?.scrollTo({ x: itemWidth * (currentIndex + 1), animated: true });
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setAutoscrollTime(3000);
      }
    }, autoScrollTime);

    return () => clearInterval(interval);
  }, [currentIndex, itemWidth, popularIssues]);

  const newListIndex = () => {
    if (popularIssues && currentIndex === popularIssues.length) return 1;
    return currentIndex + 1;
  };

  // 수동 스크롤 시 인덱스 변경
  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / itemWidth);
    setCurrentIndex(index);
  };

  if (!popularIssues || !newPopularIssues || newPopularIssues.length < 1) return null;
  return (
    <ScrollView
      className="mx-[-16px] flex-row rounded-13"
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      scrollEventThrottle={200}
      decelerationRate="normal"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ width: `${100 * newPopularIssues.length}%` }}
      onContentSizeChange={(width) => setItemWidth(width / newPopularIssues.length)}
      onMomentumScrollEnd={handleMomentumScrollEnd}
    >
      {newPopularIssues.map((issue, index: number) => (
        <View style={{ width: itemWidth }} key={index}>
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? COLOR.GRAY_E5 : COLOR.WHITE,
              padding: 16,
              paddingVertical: 20,
              margin: 16,
              marginBottom: 0,
              borderRadius: 12,
              gap: 6,
            })}
            onPress={() => {
              dispatch(getIssueId(issue.id));
              navigation.navigate('IssueStack', { screen: 'IssueDetail' });
            }}
          >
            <FontText text="NOW" className="text-13 leading-19 text-light-blue" fontWeight="600" />
            <View>
              <FontText
                text={issue.title}
                className="leading-21"
                fontWeight="500"
                numberOfLines={1}
              />
              <View className="flex-row justify-between mt-4">
                <FontText
                  text={dayjs(issue.startDate).fromNow()}
                  className="text-13 leading-18 text-gray-999"
                />
                <View className="bg-[#F3F3F3] rounded-full flex-row px-8">
                  <FontText
                    text={`${newListIndex()}`}
                    className="text-13 text-gray-4b4 leading-18"
                  />
                  <FontText text="/" className="mx-2 text-13 text-gray-4b4 leading-18" />
                  <FontText
                    text={`${popularIssues.length}`}
                    className="text-13 text-gray-4b4 leading-18"
                  />
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
};

export default IssueCarrousel;
