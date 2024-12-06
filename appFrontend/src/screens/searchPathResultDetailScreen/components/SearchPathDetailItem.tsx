import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import cn from 'classname';
import { FontText, Space } from '@/global/ui';
import { subwayLineColor } from '@/global/utils';
import { SubPath } from '@/global/apis/entity';
import { COLOR } from '@/global/constants';
import IconWalkHuman from '@assets/icons/walk_human.svg';
import IconRightArrowHead from '@assets/icons/right_arrow_head.svg';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useAppDispatch } from '@/store';
import { getIssueId } from '@/store/modules';
import IconDownArrowHead from '@assets/icons/down_arrow_head.svg';
import IssueKeywordIcon from '@/global/components/IssueKeywordIcon';

interface SearchPathDetailItemProps {
  data: SubPath;
  isLastLane: boolean;
  lineLength: number;
}

const SearchPathDetailItem = ({ data, isLastLane, lineLength }: SearchPathDetailItemProps) => {
  const navigation = useRootNavigation();
  const dispatch = useAppDispatch();

  const [isOpenPathList, setIsOpenPathList] = useState<boolean>(false);
  const lastIdx = data.stations.length - 1;

  return (
    <View className="ml-38">
      {/* 출발역 */}
      <View
        className={cn('flex-row', {
          'mb-36': !isOpenPathList,
        })}
      >
        {/* 점과 선 */}
        <View>
          <View
            className="w-20 h-20 rounded-full"
            style={{
              backgroundColor: subwayLineColor(data.stationCode),
            }}
          />
          <View
            className={cn('w-4 flex-1 ml-8 mt-[-10px]', {
              'mb-[-40px]': !isOpenPathList,
            })}
            style={{
              backgroundColor: subwayLineColor(data.stationCode),
            }}
          />
        </View>
        <View className="flex-1 ml-16">
          <FontText
            text={data.stations[0].stationName}
            className="text-18"
            fontWeight="600"
            style={{
              color: subwayLineColor(data.stationCode),
            }}
          />
          <View className="flex-row items-center mt-4">
            <FontText text={data.way + ' 방향'} className="text-13 text-gray-999" />
            {data.direct && <FontText text=" 급행" className="text-12 text-[#EB5147]" />}
            <FontText
              text={
                data.door !== 'null'
                  ? ` | 빠른환승 ${data.door === '0-0' ? '모든 칸' : data.door}`
                  : ''
              }
              className="text-13 text-gray-999"
            />
          </View>

          {/* 이슈박스 */}
          {data.issueSummary.map((issue) => (
            <TouchableOpacity
              className="flex-row pt-10 pb-12 pl-12 pr-10 mt-4 bg-white border border-[#f0f0f0] rounded-10"
              onPress={() => {
                dispatch(getIssueId(issue.id));
                navigation.navigate('IssueStack', { screen: 'IssueDetail' });
              }}
            >
              <View className="mt-4 mr-8">
                <IssueKeywordIcon
                  width={18}
                  height={18}
                  keyword={issue.keyword}
                  color={subwayLineColor(data.stationCode)}
                />
              </View>
              <View className="flex-1 mr-8">
                <FontText
                  text={issue.title}
                  numberOfLines={1}
                  className="mb-2 text-13"
                  fontWeight="600"
                />
                <FontText
                  text={`도움돼요 ${issue.likeCount}개`}
                  className="text-11 text-gray-999"
                  fontWeight="500"
                />
              </View>
              <View className="justify-center">
                <IconRightArrowHead className="mb-2" color={COLOR.GRAY_999} />
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            activeOpacity={0.5}
            className="flex-row items-center mt-8 w-140"
            onPress={() => setIsOpenPathList((prev) => !prev)}
            disabled={data.stations.length < 3}
            hitSlop={20}
          >
            <FontText
              text={
                data.sectionTime > 60
                  ? data.stationCount +
                    '개역 (' +
                    Math.floor(data.sectionTime / 60) +
                    '시간 ' +
                    (data.sectionTime % 60) +
                    '분)'
                  : data.stationCount + '개역 (' + data.sectionTime + '분)'
              }
              className="text-13 text-[#49454f]"
            />
            {data.stations.length > 2 && (
              <IconDownArrowHead
                className="ml-4"
                width={10}
                height={10}
                rotation={isOpenPathList ? 180 : 0}
              />
            )}
          </TouchableOpacity>

          {/* 전체 경로 */}
          {isOpenPathList && (
            <View className="my-12">
              {data.stations.map((item, idx) => {
                if (data.stations.length - 1 > idx && idx !== 0) {
                  return (
                    <View
                      key={item.stationName.length + item.stationName}
                      className={cn('flex-row ml-[-32]', {
                        'mt-9': idx !== 0,
                      })}
                    >
                      <View
                        className="w-12 h-12 mr-20 bg-white border-2 rounded-12"
                        style={{
                          borderColor: subwayLineColor(data.stationCode),
                        }}
                      />
                      <FontText text={item.stationName} className="text-13 text-gray-999" />
                    </View>
                  );
                }
              })}
            </View>
          )}
        </View>
      </View>
      {/* 도착역 */}
      <View className="flex-row z-[99999] relative">
        <View
          className="w-20 h-20 rounded-full"
          style={{
            backgroundColor: subwayLineColor(data.stationCode),
          }}
        />
        <View className="ml-16">
          <FontText
            text={data.stations[lastIdx].stationName}
            className="text-18"
            fontWeight="600"
            style={{
              color: subwayLineColor(data.stationCode),
            }}
          />
        </View>
      </View>
      {!isLastLane && (
        <View className="mt-[-20px] ml-[-25px] flex-row items-center">
          <View className="mt-18">
            <IconWalkHuman width={24} height={24} />
          </View>
          <View className="overflow-hidden">
            <View className="ml-9 w-4 h-60 z-[-1] bg-gray-ddd" />
          </View>
        </View>
      )}
      {isLastLane && (
        <View
          className="items-center pb-24 pr-31"
          style={{
            paddingTop: lineLength > 1 ? '66%' : '100%',
          }}
        >
          <FontText text="powered by www.ODsay.com" className="text-10 text-gray-ddd" />
        </View>
      )}
    </View>
  );
};

export default SearchPathDetailItem;
