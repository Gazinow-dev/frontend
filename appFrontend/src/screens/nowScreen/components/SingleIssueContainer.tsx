import React, { useMemo } from 'react';
import { FontText } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useAppDispatch } from '@/store';
import { getIssueId } from '@/store/modules';
import { useRootNavigation } from '@/navigation/RootNavigation';
import dayjs from 'dayjs';
import { Pressable, View } from 'react-native';
import cn from 'classname';
import { rawLineNameToNowCapsuleText } from '@/global/utils/subwayLine';
import IconHeart from '@/assets/icons/icon-heart-mono.svg';
import IconComment from '@/assets/icons/icon-chat-bubble-mono.svg';
import { IssueGet } from '@/global/apis/entity';
import { trackNowTotalIssueClick } from '@/analytics/now.events';

interface Props {
  issue: IssueGet;
}

const SingleIssueContainer = ({ issue }: Props) => {
  const dispatch = useAppDispatch();
  const navigation = useRootNavigation();

  const { id, title, content, startDate, expireDate, likeCount, commentCount, lines } = issue;

  const issueStatus = (() => {
    const now = dayjs();
    const start = dayjs(startDate);
    const expire = dayjs(expireDate);

    if (now.isAfter(expire)) return '종료';
    if (now.isBefore(start)) return '예정';
    return '진행';
  })();

  const relatedSubwayLines = useMemo(() => {
    const sortedLines = Array.from(new Set(lines)).sort();
    return sortedLines
      .map((line, index) =>
        index > 0 ? `･${rawLineNameToNowCapsuleText(line)}` : rawLineNameToNowCapsuleText(line),
      )
      .join('');
  }, [lines]);

  const timeAgo = dayjs(startDate).fromNow();

  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 20,
        flexDirection: 'row',
        columnGap: 12,
      })}
      onPress={() => {
        trackNowTotalIssueClick({
          title,
          status: issueStatus,
          like: likeCount,
          comments: commentCount,
          line: relatedSubwayLines,
          date: timeAgo,
        });
        dispatch(getIssueId(id));
        navigation.navigate('IssueStack', { screen: 'IssueDetail' });
      }}
    >
      <View
        className={cn('h-32 w-32 justify-center rounded-6 bg-[#EB514733]', {
          'bg-gray-beb': issueStatus === '종료',
          'bg-[#FF841F33]': issueStatus === '예정',
        })}
      >
        <FontText
          text={issueStatus}
          className={cn('text-center text-12 leading-14 text-light-red', {
            'text-gray-999': issueStatus === '종료',
            'text-[#F57F1F]': issueStatus === '예정',
          })}
          fontWeight="500"
        />
      </View>

      <View className="flex-1 space-y-6">
        <View className="flex-row space-x-8">
          <FontText text="영향권" className="text-13 leading-19 text-[#58606A]" fontWeight="600" />
          <FontText
            text={relatedSubwayLines}
            className="flex-1 text-13 leading-19 text-gray-999"
            numberOfLines={1}
          />
        </View>

        <FontText text={title} fontWeight="500" numberOfLines={2} />

        <FontText text={content} className="text-14 text-[#6A6A6A]" numberOfLines={2} />

        <View className="flex-row items-center space-x-8">
          <View className="flex-row items-center w-48 space-x-4">
            <IconHeart color="#D1D6DB" width={18} height={18} />
            <FontText text={'' + likeCount} className="text-13 leading-19 text-gray-999" />
          </View>
          <View className="flex-row items-center w-48 space-x-4">
            <IconComment width={18} height={18} />
            <FontText text={'' + commentCount} className="text-13 leading-19 text-gray-999" />
          </View>
          <View className="h-10 w-1 bg-[#D9D9D9]" />
          <FontText text={timeAgo} className="text-13 leading-19 text-gray-999" />
        </View>
      </View>
    </Pressable>
  );
};

export default SingleIssueContainer;
