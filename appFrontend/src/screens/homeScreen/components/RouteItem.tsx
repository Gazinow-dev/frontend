import { MyRoutesType } from '@/global/apis/entity';
import { SubwaySimplePath } from '@/global/components';
import { COLOR } from '@/global/constants';
import { FontText } from '@/global/ui';
import { useHomeNavigation } from '@/navigation/HomeNavigation';
import { Pressable, View } from 'react-native';
import IssuesBanner from './IssuesBanner';
import IconRightArrowHead from '@/assets/icons/right_arrow_head.svg';
import cn from 'classname';

interface RouteItemProps {
  route: MyRoutesType;
  hasIssues: boolean;
  isLastItem: boolean;
}

const RouteItem = ({ route, hasIssues, isLastItem }: RouteItemProps) => {
  const homeNavigation = useHomeNavigation();

  const filteredTotalTime =
    route.totalTime > 60
      ? Math.floor(route.totalTime / 60) + '시간 ' + (route.totalTime % 60) + '분'
      : route.totalTime + '분';

  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 23,
        borderTopColor: COLOR.GRAY_EB,
        borderTopWidth: 1,
        borderBottomLeftRadius: isLastItem ? 15 : 0,
        borderBottomRightRadius: isLastItem ? 15 : 0,
      })}
      onPress={() => homeNavigation.push('SubwayPathDetail', { state: route })}
    >
      <View className="flex-row items-center justify-between mb-24">
        <FontText text={route.roadName} className="text-18" fontWeight="700" />
        <View
          className={cn('px-6 py-4 ml-8 rounded-16', {
            'bg-[#FBDCDA]': hasIssues,
            'bg-transparent': !hasIssues,
          })}
        >
          <FontText
            text={hasIssues ? `${filteredTotalTime} 이상 예상` : `평균 ${filteredTotalTime}`}
            className={cn('text-12 leading-14', {
              'text-light-red': hasIssues,
              'text-gray-999': !hasIssues,
            })}
            fontWeight="500"
          />
        </View>
        <View className="flex-1" />

        <View className="flex-row items-center">
          <FontText text="세부정보" className="text-13 leading-19 text-gray-999" />
          <View className="w-4" />
          <IconRightArrowHead color={COLOR.GRAY_999} />
        </View>
      </View>
      <SubwaySimplePath
        pathData={route.subPaths}
        arriveStationName={route.lastEndStation}
        betweenPathMargin={24}
      />
      {hasIssues ? <IssuesBanner subPaths={route.subPaths} /> : null}
    </Pressable>
  );
};

export default RouteItem;
