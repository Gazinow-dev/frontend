import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FontText } from '@/global/ui';
import { getIssueId } from '@/store/modules';
import { useAppDispatch } from '@/store';
import { useRootNavigation } from '@/navigation/RootNavigation';
import dayjs from 'dayjs';
import cn from 'classname';
import IconHeart from '@/assets/icons/icon-heart-mono.svg';
import { IssueGet } from '@/global/apis/entity';

interface PopularIssuesProps {
  popularIssues: IssueGet[];
}

const PopularIssues = ({ popularIssues }: PopularIssuesProps) => {
  if (popularIssues.length < 1) return null;

  const dispatch = useAppDispatch();

  const navigation = useRootNavigation();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getIssueStatus = (startDate: string, expireDate: string) => {
    if (dayjs().isAfter(dayjs(expireDate))) return '종료';
    if (dayjs().isBefore(dayjs(startDate))) return '예정';
    return '진행';
  };

  return (
    <View>
      <View className="px-16 pt-24 pb-28">
        <FontText text="지금 인기 이슈" className="text-20 leading-25" fontWeight="600" />
      </View>

      <View className="px-16 pb-36">
        <View className="rounded-16 py-20 px-16 bg-[#F9FAFB]">
          {popularIssues?.map(({ id, title, startDate, expireDate, likeCount }, index) => {
            const issueStatus = getIssueStatus(startDate, expireDate);

            if (!isExpanded && index !== 0) return null;
            return (
              <TouchableOpacity
                className={index === 0 ? 'mt-0' : 'mt-36'}
                onPress={() => {
                  dispatch(getIssueId(id));
                  navigation.navigate('IssueStack', { screen: 'IssueDetail' });
                }}
                key={`${id}_${index}`}
              >
                <View className="flex-row space-x-10">
                  <FontText text={`${index + 1}`} className="w-12" fontWeight="700" />
                  <View className="space-y-12">
                    <FontText text={title} fontWeight="500" numberOfLines={2} />
                    <View className="flex-row items-center space-x-8">
                      <View className="flex-row items-center space-x-4">
                        <View
                          className={cn('w-6 h-6 rounded-full bg-light-red', {
                            'bg-[#F57F1F]': issueStatus === '예정',
                            'bg-gray-999': issueStatus === '종료',
                          })}
                        />
                        <FontText
                          text={issueStatus}
                          className={cn('text-13 leading-19 text-light-red ', {
                            'text-[#F57F1F]': issueStatus === '예정',
                            'text-gray-999': issueStatus === '종료',
                          })}
                        />
                      </View>
                      <View className="w-1 h-10 bg-[#D9D9D9]" />
                      <View className="flex-row items-center space-x-4">
                        <IconHeart color="#D1D6DB" width={18} height={18} />
                        <FontText
                          text={'' + likeCount}
                          className="text-13 leading-19 text-gray-999"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          <View className="flex-row-reverse">
            <TouchableOpacity onPress={() => setIsExpanded((prev) => !prev)} hitSlop={30}>
              <FontText
                text={isExpanded ? '접기' : '펼쳐보기'}
                className="text-right text-13 leading-19 text-gray-999"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="h-16 bg-gray-9f9" />
    </View>
  );
};
export default PopularIssues;
