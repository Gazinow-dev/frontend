import { MyRoutesType } from '@/global/apis/entity';
import { SubwaySimplePath } from '@/global/components';
import { COLOR } from '@/global/constants';
import { FontText } from '@/global/ui';
import { useHomeNavigation } from '@/navigation/HomeNavigation';
import { Pressable, View } from 'react-native';
import IssuesBanner from './IssuesBanner';
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
        paddingVertical: 28,
        paddingHorizontal: 16,
        borderTopColor: COLOR.GRAY_EB,
        borderTopWidth: 1,
        borderBottomLeftRadius: isLastItem ? 15 : 0,
        borderBottomRightRadius: isLastItem ? 15 : 0,
      })}
      onPress={() => homeNavigation.push('SubwayPathDetail', { state: route })}
    >
      <View className="gap-6 mb-20">
        <View className="flex-row">
          <View
            className={cn('rounded-16 px-6 py-4 bg-gray-beb', {
              'bg-[#FBDCDA] mb-2': hasIssues,
            })}
          >
            <FontText
              text={hasIssues ? `${filteredTotalTime} 이상 예상` : `평균 ${filteredTotalTime}`}
              className={cn('text-12 text-gray-999 leading-14 text-center', {
                'text-light-red': hasIssues,
              })}
              fontWeight="500"
            />
          </View>
        </View>
        <FontText
          text={route.roadName}
          numberOfLines={1}
          className="text-18 leading-23"
          fontWeight="500"
        />
        {!hasIssues && (
          <FontText text="올라온 이슈가 없어요" className="text-13 leading-19 text-gray-999" />
        )}
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
