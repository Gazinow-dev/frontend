import { MyRoutesType } from '@/global/apis/entity';
import { SubwaySimplePath } from '@/global/components';
import { COLOR } from '@/global/constants';
import { FontText } from '@/global/ui';
import { useHomeNavigation } from '@/navigation/HomeNavigation';
import { Pressable, View } from 'react-native';
import IssuesBanner from './IssuesBanner';
import cn from 'classname';

interface Props {
  route: MyRoutesType;
  hasIssues: boolean;
  isLastItem: boolean;
}

const RouteItem = ({ route, hasIssues, isLastItem }: Props) => {
  const homeNavigation = useHomeNavigation();

  const timeText = (() => {
    const minutes = Number(route.totalTime);

    const base =
      minutes > 60
        ? `${Math.floor(minutes / 60)}시간 ${minutes % 60}\u2060분`
        : `${minutes}\u2060분`;

    return hasIssues ? `${base} 이상 예상` : `평\u2060균 \u2060${base}`;
  })();

  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
        paddingVertical: 28,
        paddingHorizontal: 16,
        gap: 16,
        borderTopColor: COLOR.GRAY_EB,
        borderTopWidth: 1,
        borderBottomLeftRadius: isLastItem ? 15 : 0,
        borderBottomRightRadius: isLastItem ? 15 : 0,
      })}
      onPress={() => homeNavigation.push('SubwayPathDetail', { state: route })}
    >
      <View className="mb-4 space-y-6">
        <View className="flex-row">
          <View
            className={cn('rounded-16 bg-gray-beb px-6 py-4', {
              'mb-2 bg-[#FBDCDA]': hasIssues,
            })}
          >
            <FontText
              text={timeText}
              className={cn('text-center text-12 leading-14 text-gray-999', {
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

      {hasIssues && <IssuesBanner subPaths={route.subPaths} isHomeScreen />}
    </Pressable>
  );
};

export default RouteItem;
