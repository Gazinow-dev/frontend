import { Pressable, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
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
        <ScrollView>
          {data?.paths.map((item) => (
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
                      'w-24 h-24 rounded-full border-1 items-center justify-center border-gray-ebe',
                      {
                        'border-[#346BF7]': selectedRoutePath === item,
                      },
                    )}
                    onPress={() => {
                      setSelectedRoutePath(item);
                    }}
                    hitSlop={20}
                  >
                    {selectedRoutePath === item && (
                      <View className="w-11 h-11 rounded-full bg-[#346BF7]" />
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
      </View>

      <TouchableOpacity
        className={cn('py-11 mx-16 mb-41 rounded-5 items-center bg-gray-ddd', {
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
