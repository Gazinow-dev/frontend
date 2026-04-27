import cn from 'classname';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { StationDataTypes } from '@/store/modules';
import { Path } from '@/global/apis/entity';
import { useGetSearchPaths } from '@/global/apis/hooks';
import { SubwaySimplePath } from '@/global/components';
import LoadingCircle from '@/global/components/animations/LoadingCircle';
import { COLOR } from '@/global/constants';
import { FontText } from '@/global/ui';
import { useSavePathNavigation } from '@/navigation/SavePathNavigation';
import { trackMapBookmark3Choice } from '@/analytics/map.events';
import { useAppSelect } from '@/store';
import SwapStation from './components/SwapStation';

interface SelectedStationTypes {
  departure: StationDataTypes;
  arrival: StationDataTypes;
}

const PathSelectScreen = () => {
  const savePathNavigation = useSavePathNavigation();
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
          <View className="mt-200 items-center">
            <LoadingCircle size={40} />
          </View>
        )}
        {!data && !isLoading && (
          <View className="flex-1 items-center justify-center bg-white">
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
                    paddingBottom: 24,
                  })}
                  onPress={() => {
                    setSelectedRoutePath(item);
                    savePathNavigation.push('PathDetail', {
                      state: item,
                    });
                  }}
                >
                  <View className="mb-8 flex-row items-center justify-between">
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
                        <View className="h-11 w-11 rounded-full bg-light-blue" />
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
          savePathNavigation.push('PathName', {
            state: selectedRoutePath!,
          })
        }
        disabled={selectedRoutePath === null}
      >
        <FontText text="다음" className="text-17 text-white" fontWeight="600" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PathSelectScreen;
