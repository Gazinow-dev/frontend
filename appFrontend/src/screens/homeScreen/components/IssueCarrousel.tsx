import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useGetAllIssuesQuery, useGetPopularIssuesQuery } from '@/global/apis/hooks';
import IssueKeywordIcon from '@/global/components/IssueKeywordIcon';
import { COLOR } from '@/global/constants';
import { FontText } from '@/global/ui';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useAppDispatch } from '@/store';
import { getIssueId } from '@/store/modules';
import dayjs from 'dayjs';
import { rawLineNameToColor } from '@/global/utils/subwayLine';
import { IssueContent } from '@/global/apis/entity';

const IssueCarrousel = () => {
  const navigation = useRootNavigation();
  const dispatch = useAppDispatch();
  const { popularIssues, popularIssuesRefetch, isPopularIssuesLoading } =
    useGetPopularIssuesQuery();
  const { allIssues } = useGetAllIssuesQuery();
  const [itemWidth, setItemWidth] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  //TODO: 현재 유효한 이슈 배열
  // const currentDate = new Date();
  // const currentIssues = Array.from(
  //   new Set(
  //     allIssues?.pages[0].content.filter((issue) => new Date(issue.expireDate) >= currentDate),
  //   ),
  // ).slice(0, 3);

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
    else return currentIndex + 1;
  };

  if (!popularIssues || !newPopularIssues || newPopularIssues.length < 1) return null;
  return (
    <ScrollView
      className="mx-[-16px] flex-row rounded-13"
      ref={scrollViewRef}
      horizontal
      scrollEventThrottle={200}
      decelerationRate="normal"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ width: `${100 * newPopularIssues.length}%` }}
      onContentSizeChange={(width) => setItemWidth(width / newPopularIssues.length)}
    >
      {newPopularIssues.map((issue, index: number) => (
        <View style={{ width: itemWidth }} key={index}>
          <TouchableOpacity
            className="flex-row m-16 mb-0 p-16 rounded-12 bg-white"
            onPress={() => {
              dispatch(getIssueId(issue.id));
              navigation.navigate('IssueStack', { screen: 'IssueDetail' });
            }}
          >
            <IssueKeywordIcon
              width={30}
              height={30}
              keyword={issue.keyword}
              color={rawLineNameToColor(issue.lines[0])}
            />
            <View className="flex-1 mx-14">
              <FontText
                value={issue.title}
                textSize="13px"
                lineHeight={19}
                textWeight="SemiBold"
                textColor={COLOR.BASIC_BLACK}
                numberOfLines={1}
              />
              <FontText
                value={dayjs(issue.startDate).fromNow()}
                textSize="11px"
                lineHeight={13}
                textWeight="Medium"
                textColor={COLOR.GRAY_999}
              />
            </View>

            <View className="items-end">
              <FontText
                value="NOW"
                textSize="12px"
                lineHeight={14}
                textWeight="Bold"
                textColor="#346BF7"
              />
              <View className="bg-[#F3F3F3] rounded-27 w-36 h-16 mt-4 justify-center">
                <FontText
                  value={`${newListIndex()}/${popularIssues.length}`}
                  textSize="11px"
                  lineHeight={13}
                  textWeight="Medium"
                  textColor="#B4B4B4"
                  textAlign="center"
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default IssueCarrousel;
