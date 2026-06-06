import cn from 'classname';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { StationDataTypes } from '@/store/modules';
import { useSavedSubwayRoute } from '@/global/apis/hooks';
import { SubwaySimplePath } from '@/global/components';
import { FontText } from '@/global/ui';
import { useOnboardingNavigation } from '@/navigation/OnboardingNavigation';
import { OnboardingStackParamList } from '@/navigation/types/navigation';
import { trackMapBookmark5Finish } from '@/analytics/map.events';
import { useAppSelect } from '@/store';
import { OnboardingHeader } from './components';

export interface SelectedStationTypes {
  departure: StationDataTypes;
  arrival: StationDataTypes;
}

const OnboardingWalkTimeScreen = () => {
  const onboardingNavigation = useOnboardingNavigation();
  const { newPath } = useRoute().params as {
    newPath: OnboardingStackParamList['OnboardingWalkTime']['newPath'];
  };
  if (!newPath) return null;

  const selectedStation = useAppSelect((state) => state.subwaySearch.selectedStation);

  const [walkTime, setWalkTime] = useState({ before: 5, after: 5 });
  const adjust = (key: 'before' | 'after', delta: number) => {
    setWalkTime((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta), // 0 미만으로 안 내려가게
    }));
  };

  const pathData = {
    station_departure: newPath.firstStartStation,
    station_arrival: newPath.lastEndStation,
    line_departure: newPath.subPaths[1].name,
    line_arrival: newPath.subPaths.at(-2)?.name!,
  };

  const newPathName = '출근길' + Math.floor(Math.random() * 1000) + 1;

  const { mutate } = useSavedSubwayRoute({
    onSuccess: async (newPathId) => {
      trackMapBookmark5Finish({ ...pathData, name: newPathName });
      onboardingNavigation.push('OnboardingSetAlert', {
        newPath: { ...newPath, roadName: newPathName, id: newPathId },
      });
    },
    onError: () => {},
  });

  const handleNext = () =>
    mutate({
      ...newPath,
      roadName: newPathName,
      walkingTimeFromStartStation: walkTime.before,
      walkingTimeToEndStation: walkTime.after,
    });

  const totalTime = newPath.totalTime + walkTime.before + walkTime.after;

  const timeText =
    totalTime > 59
      ? `${Math.floor(totalTime / 60)}시간${totalTime % 60 ? ` ${totalTime % 60}분` : ''}`
      : `${totalTime}분`;

  return (
    <SafeAreaView className="relative flex-1 px-16 bg-gray-9f9">
      <OnboardingHeader />
      <View className="pt-16 pb-14">
        <View className="relative">
          <View className="h-6 w-full rounded-3 bg-[#78787833]" />
          <View className={`absolute z-10 h-6 w-1/2 rounded-3 bg-black-717`} />
        </View>
      </View>

      <View className="h-28" />

      <View className="space-y-10">
        <FontText
          text="역까지 걸어서 몇 분인가요?"
          fontWeight="700"
          className="text-24 leading-32"
        />
        <FontText
          text="실제 이동 시간을 더 정확하게 계산해요"
          className="text-13 leading-19 text-gray-999"
        />
      </View>

      <View className="h-28" />

      <View className="flex-1 space-y-16">
        {/* 경로 컴포넌트 */}
        <View className="p-16 pt-0 bg-white rounded-14">
          <SubwaySimplePath
            pathData={newPath.subPaths}
            arriveStationName={selectedStation.arrival.stationName}
            betweenPathMargin={16}
          />
        </View>

        {/* 걷는 시간 조절 컴포넌트 */}
        <View className="px-16 py-20 space-y-16 bg-white rounded-14">
          {/* 출발지 */}
          <View className="flex-row justify-between">
            <View>
              <FontText
                text={`출발지 → ${selectedStation.departure.stationName.split('(')[0]}`}
                fontWeight="500"
              />
              <FontText text="역까지 걷는 시간" className="text-13 leading-19 text-gray-999" />
            </View>

            <View className="flex-row items-center justify-between space-x-12">
              <TouchableOpacity
                className="h-28 w-28 items-center justify-center rounded-full bg-[#7676801F]"
                onPress={() => adjust('before', -1)}
                disabled={walkTime.before < 2}
              >
                <FontText
                  text="-"
                  className={cn('text-15 leading-20', {
                    'text-[#3C3C434D]': walkTime.before < 2,
                  })}
                />
                <View className="h-3" />
              </TouchableOpacity>

              <FontText
                text={`${walkTime.before}분`}
                fontWeight="500"
                className="w-40 text-center"
              />

              <TouchableOpacity
                className="h-28 w-28 items-center justify-center rounded-full bg-[#7676801F]"
                onPress={() => adjust('before', 1)}
              >
                <FontText text="+" className="text-15 leading-20" />
                <View className="h-3" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="h-1 bg-gray-beb" />

          {/* 목적지 */}
          <View className="flex-row justify-between">
            <View>
              <FontText
                text={`${selectedStation.arrival.stationName.split('(')[0]} → 목적지`}
                fontWeight="500"
              />
              <FontText text="목적지까지 걷는 시간" className="text-13 leading-19 text-gray-999" />
            </View>

            <View className="flex-row items-center justify-between space-x-12">
              <TouchableOpacity
                className="h-28 w-28 items-center justify-center rounded-full bg-[#7676801F]"
                onPress={() => adjust('after', -1)}
                disabled={walkTime.after < 2}
              >
                <FontText
                  text="-"
                  className={cn('text-15 leading-20', {
                    'text-[#3C3C434D]': walkTime.after < 2,
                  })}
                />
                <View className="h-3" />
              </TouchableOpacity>

              <FontText
                text={`${walkTime.after}분`}
                fontWeight="500"
                className="w-40 text-center"
              />

              <TouchableOpacity
                className="h-28 w-28 items-center justify-center rounded-full bg-[#7676801F]"
                onPress={() => adjust('after', 1)}
              >
                <FontText text="+" className="text-15 leading-20" />
                <View className="h-3" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 예상 소요 시간 컴포넌트 */}
        <View className="flex-row items-center justify-between p-16 bg-white rounded-14">
          <View>
            <FontText text="예상 소요 시간" fontWeight="500" />
            <FontText text="도보포함" className="text-13 leading-19 text-gray-999" />
          </View>
          <FontText text={timeText} fontWeight="700" className="text-center text-20 leading-25" />
        </View>
      </View>

      <TouchableOpacity className="mb-56 rounded-5 bg-black-717 p-11" onPress={handleNext}>
        <FontText
          text="다음"
          className="text-center text-white text-17 leading-26"
          fontWeight="600"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingWalkTimeScreen;
