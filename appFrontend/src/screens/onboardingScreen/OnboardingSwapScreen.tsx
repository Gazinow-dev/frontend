import cn from 'classname';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import React, { useState } from 'react';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { getSeletedStation, getStationType } from '@/store/modules';
import type { StationDataTypes } from '@/store/modules';
import { Path } from '@/global/apis/entity';
import { useGetSearchPaths } from '@/global/apis/hooks';
import { SubwaySimplePath } from '@/global/components';
import LoadingCircle from '@/global/components/animations/LoadingCircle';
import { ARRIVAL_STATION, COLOR, DEPARTURE_STATION } from '@/global/constants';
import { FontText } from '@/global/ui';
import { useOnboardingNavigation } from '@/navigation/OnboardingNavigation';
import {
  trackMapBookmark3ArrivalClick,
  trackMapBookmark3Choice,
  trackMapBookmark3DepartureClick,
} from '@/analytics/map.events';
import { IconSwapChange } from '@/assets/icons';
import { useAppDispatch, useAppSelect } from '@/store';
import { OnboardingHeader, OnboardingSearchModal } from './components';

export const pathTime = ({ totalTime }: Path) => {
  return totalTime > 59
    ? `${Math.floor(totalTime / 60)}시간${totalTime % 60 ? ` ${totalTime % 60}분` : ''}`
    : `${totalTime}분`;
};

export interface SelectedStationTypes {
  departure: StationDataTypes;
  arrival: StationDataTypes;
}

type StationTypes = typeof DEPARTURE_STATION | typeof ARRIVAL_STATION;

const OnboardingSwapScreen = () => {
  const onboardingNavigation = useOnboardingNavigation();
  const dispatch = useAppDispatch();
  const selectedStation = useAppSelect((state) => state.subwaySearch.selectedStation);

  const [isModalOpened, setModalOpened] = useState(false);

  const navigateSearchStation = (type: StationTypes) => {
    if (type === '출발역') {
      trackMapBookmark3DepartureClick();
    } else {
      trackMapBookmark3ArrivalClick();
    }
    dispatch(getStationType(type));
    setModalOpened(true);
  };

  const [selectedRoutePath, setSelectedRoutePath] = useState<Path | null>(null);

  const { data, isLoading } = useGetSearchPaths({
    params: {
      strStationName: selectedStation.departure.stationName,
      strStationLine: selectedStation.departure.stationLine,
      endStationName: selectedStation.arrival.stationName,
      endStationLine: selectedStation.arrival.stationLine,
    },
    enabled:
      !!selectedStation.departure.stationName &&
      !!selectedStation.departure.stationLine &&
      !!selectedStation.arrival.stationName &&
      !!selectedStation.arrival.stationLine,
  });

  const renderStationButton = (station: StationDataTypes, type: StationTypes) => (
    <TouchableOpacity
      className="justify-center w-full p-10 rounded-8 bg-gray-9f9"
      onPress={() => navigateSearchStation(type)}
    >
      <FontText
        text={station.stationName.split('(')[0] || type}
        className={cn('leading-21', {
          'text-gray-999': !station.stationName,
        })}
      />
    </TouchableOpacity>
  );

  const swapStation = () => {
    setSelectedRoutePath(null);
    dispatch(
      getSeletedStation({
        arrival: selectedStation.departure,
        departure: selectedStation.arrival,
      }),
    );
  };

  return (
    <SafeAreaView className="relative flex-1 bg-gray-9f9">
      {isModalOpened && <OnboardingSearchModal closeModal={() => setModalOpened(false)} />}
      <View className="px-16">
        <OnboardingHeader />
        <View className="pt-16 pb-14">
          <View className="relative">
            <View className="h-6 w-full rounded-3 bg-[#78787833]" />
            <View className="absolute z-10 w-1/4 h-6 rounded-3 bg-black-717" />
          </View>
        </View>

        <View className="h-28" />

        <View className="space-y-10">
          <FontText
            text="어떤 경로를 자주 이용하시나요?"
            fontWeight="700"
            className="text-24 leading-32"
          />
          <FontText
            text="이 경로에 문제가 생기면 바로 알려드려요"
            className="text-13 leading-19 text-gray-999"
          />
        </View>

        <View className="h-28" />

        <Shadow
          offset={[0, -4]}
          distance={34}
          startColor="#0000000D"
          style={{
            alignItems: 'center',
          }}
        >
          <View className="flex-row items-center bg-white space-x-15 rounded-14 pb-19 pl-17 pr-14 pt-21">
            <View className="flex-1 gap-8">
              {renderStationButton(selectedStation.departure, DEPARTURE_STATION)}
              {renderStationButton(selectedStation.arrival, ARRIVAL_STATION)}
            </View>
            <TouchableOpacity onPress={swapStation} hitSlop={20}>
              <IconSwapChange width={24} />
            </TouchableOpacity>
          </View>
        </Shadow>
      </View>

      <View className="flex-1 px-16 pt-16">
        {isLoading && (
          <View className="items-center justify-center flex-1">
            <LoadingCircle />
          </View>
        )}
        {!!selectedStation.departure.stationName &&
          !!selectedStation.arrival.stationName &&
          !data &&
          !isLoading && (
            <View className="items-center justify-center flex-1 bg-white rounded-14">
              <FontText text="검색 결과가 없어요" className="text-gray-999" />
            </View>
          )}
        {data && (
          <ScrollView className="rounded-14" showsVerticalScrollIndicator={false}>
            {data.paths.map((item, idx) => (
              <Pressable
                key={item.firstStartStation + item.totalTime}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? COLOR.GRAY_E5 : 'white',
                  paddingHorizontal: 16,
                  paddingTop: 20,
                  paddingBottom: 24,
                  borderBottomRightRadius: idx === data.paths.length - 1 ? 14 : 0,
                  borderBottomLeftRadius: idx === data.paths.length - 1 ? 14 : 0,
                  borderTopRightRadius: idx === 0 ? 14 : 0,
                  borderTopLeftRadius: idx === 0 ? 14 : 0,
                  borderTopColor: idx !== 0 ? COLOR.GRAY_EB : 'transparent',
                  borderTopWidth: idx !== 0 ? 1 : 0,
                })}
                onPress={() => {
                  trackMapBookmark3Choice({
                    station_departure: item.firstStartStation,
                    station_arrival: item.lastEndStation,
                    line_departure: item.subPaths[1].name,
                    line_arrival: item.subPaths.at(-2)?.name!,
                  });
                  setSelectedRoutePath(item);
                }}
              >
                <View className="flex-row items-center justify-between mb-8">
                  <View className="gap-4">
                    <FontText
                      text="평균 소요시간"
                      className="text-11 text-gray-999"
                      fontWeight="600"
                    />
                    <FontText text={pathTime(item)} className="text-20" fontWeight="600" />
                  </View>

                  <TouchableOpacity
                    className={cn(
                      'h-24 w-24 items-center justify-center rounded-full border-1 border-gray-ebe',
                      {
                        'border-light-blue': selectedRoutePath === item,
                      },
                    )}
                    onPress={() => {
                      trackMapBookmark3Choice({
                        station_departure: item.firstStartStation,
                        station_arrival: item.lastEndStation,
                        line_departure: item.subPaths[1].name,
                        line_arrival: item.subPaths.at(-2)?.name!,
                      });
                      setSelectedRoutePath(item);
                    }}
                    hitSlop={20}
                  >
                    {selectedRoutePath === item && (
                      <View className="rounded-full h-11 w-11 bg-light-blue" />
                    )}
                  </TouchableOpacity>
                </View>
                <SubwaySimplePath
                  pathData={item.subPaths}
                  arriveStationName={item.lastEndStation}
                  betweenPathMargin={24}
                  isHideIsuue
                />
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      <View className="bottom-0 w-full px-16 pt-10 bg-gray-9f9 pb-30">
        <TouchableOpacity
          className={cn('rounded-5 bg-gray-ddd p-11', {
            'bg-black-717': !!selectedRoutePath,
          })}
          onPress={() => {
            if (!selectedRoutePath) return;
            onboardingNavigation.push('OnboardingWalkTime', { newPath: selectedRoutePath });
          }}
          disabled={!selectedRoutePath}
        >
          <FontText
            text="다음"
            className="text-center text-white text-17 leading-26"
            fontWeight="600"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingSwapScreen;
