import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { FontText } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { SubwaySimplePath } from '@/global/components';
import { useGetSearchPaths } from '@/global/apis/hooks';
import { useEffect, useState } from 'react';
import { Path } from '@/global/apis/entity';
import { StationDataTypes } from '@/store/modules';
import { useNewRouteNavigation } from '@/navigation/NewRouteNavigation';
import { useAppSelect } from '@/store';
import SwapStation from './SwapStation';
import LoadingCircle from '@/global/components/animations/LoadingCircle';
import cn from 'classname';
import { trackMapBookmark3Choice } from '@/analytics/map.events';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SelectedStationTypes {
  departure: StationDataTypes;
  arrival: StationDataTypes;
}

const SelectNewRoute = () => {
  const newRouteNavigation = useNewRouteNavigation();
  const selectedStationRedux = useAppSelect(({ subwaySearch }) => subwaySearch.selectedStation);
  const [selectedRoutePath, setSelectedRoutePath] = useState<Path | null>(null);

  const [selectedStation, setSelectedStation] =
    useState<SelectedStationTypes>(selectedStationRedux);

  const { data, isLoading } = useGetSearchPaths({
    params: {
      strStationName: selectedStation.departure.stationName,
      strStationLine: selectedStation.departure.stationLine,
      endStationName: selectedStation.arrival.stationName,
      endStationLine: selectedStation.arrival.stationLine,
    },
    enabled:
      !!selectedStationRedux.departure.stationName &&
      !!selectedStationRedux.departure.stationLine &&
      !!selectedStationRedux.arrival.stationName &&
      !!selectedStationRedux.arrival.stationLine,
  });

  const pathTime = (item: Path) => {
    return item.totalTime > 60
      ? Math.floor(item.totalTime / 60) + '시간 ' + (item.totalTime % 60) + '분'
      : item.totalTime + '분';
  };

  useEffect(() => {
    setSelectedRoutePath(null);
  }, [data]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <SwapStation setSelectedStation={setSelectedStation} />
      <View className="flex-1 pb-10">
        {isLoading && (
          <View className="items-center mt-200">
            <LoadingCircle width={40} height={40} />
          </View>
        )}
        {!data && !isLoading && (
          <View className="items-center justify-center flex-1 bg-white">
            <FontText text="검색 결과가 없어요" className="text-gray-999" />
          </View>
        )}
        {data && (
          <ScrollView>
            {data.paths.map((item) => (
              <View key={item.firstStartStation + item.totalTime}>
                <View className="h-1 bg-gray-beb" />
                <Pressable
                  style={({ pressed }) => ({
                    backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
                    paddingHorizontal: 16,
                    paddingTop: 20,
                    paddingBottom: 8,
                  })}
                  onPress={() => {
                    setSelectedRoutePath(item);
                    newRouteNavigation.push('Detail', {
                      state: item,
                    });
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
              </View>
            ))}
            {!isLoading && <View className="h-1 bg-gray-beb" />}
          </ScrollView>
        )}
      </View>

      <TouchableOpacity
        className={cn('mx-16 mb-41 items-center rounded-5 bg-gray-ddd py-11', {
          'bg-black-717': selectedRoutePath !== null,
        })}
        onPress={() =>
          newRouteNavigation.push('Name', {
            state: selectedRoutePath!,
          })
        }
        disabled={selectedRoutePath === null}
      >
        <FontText text="다음" className="text-white text-17" fontWeight="600" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SelectNewRoute;
