import { TouchableOpacity } from 'react-native-gesture-handler';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { LineCapsules } from '@/global/apis/entity';
import { useGetSavedRoutesQuery } from '@/global/apis/hooks';
import { LINE_CAPSULES } from '@/global/constants';
import { FontText } from '@/global/ui';
import { lineCapsuleToColor, lineCodeToLineCapsule } from '@/global/utils';
import { trackNowTotalIssueLine } from '@/analytics/now.events';
import { useAppSelect } from '@/store';

interface Props {
  activeButton: LineCapsules;
  setActiveButton: (activeButton: LineCapsules) => void;
}

const LaneButtons = ({ activeButton, setActiveButton }: Props) => {
  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);

  // 내가 저장한 경로의 노선만 가져옴
  const { myRoutes } = useGetSavedRoutesQuery();

  // 로그인 되어있으면 저장된 경로에 해당하는 노선 캡슐을 앞쪽에 배치
  const myLines = useMemo(() => {
    if (isVerifiedUser !== 'success auth') return [];
    return (
      [
        ...new Set(
          myRoutes?.flatMap((route) =>
            route.subPaths.map((sub) => lineCodeToLineCapsule(sub.stationCode)),
          ) ?? [],
        ),
      ]
        // 매핑에 없는 노선 코드는 lineCodeToLineCapsule이 undefined를 반환하므로 제거
        .filter((line): line is LineCapsules => line !== undefined)
        .sort()
    );
  }, [isVerifiedUser, myRoutes]);

  // 내가 저장한 경로의 노선이 아닌 나머지 노선
  const otherStations = LINE_CAPSULES.filter((line) => line !== '전체' && !myLines?.includes(line));

  return (
    <View className="bg-white pt-16">
      <ScrollView
        //TODO: iOS 측면 그라데이션
        fadingEdgeLength={130}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        className="space-x-12 pb-12 pt-4"
      >
        <View className="w-4" />
        {['전체' as const, ...myLines, ...otherStations].map((capsule) => (
          <TouchableOpacity
            key={capsule}
            onPress={() => {
              trackNowTotalIssueLine(capsule);
              setActiveButton(capsule);
            }}
            className="rounded-17 px-[8.48px] py-[6.79px]"
            style={{
              backgroundColor: activeButton === capsule ? lineCapsuleToColor(capsule) : '#F5F5F5',
            }}
          >
            <FontText
              text={capsule}
              style={{
                color: activeButton === capsule ? 'white' : lineCapsuleToColor(capsule),
              }}
              className="text-[12.92px] leading-[15.51px]"
              fontWeight="600"
            />
          </TouchableOpacity>
        ))}
        <View className="w-4" />
      </ScrollView>
    </View>
  );
};

export default LaneButtons;
