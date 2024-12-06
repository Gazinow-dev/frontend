import { Pressable, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { FontText } from '@/global/ui';
import { COLOR } from '@/global/constants';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { SubwaySimplePath } from '@/global/components';
import { useGetSearchPaths } from '@/global/apis/hooks';
import { useAppSelect } from '@/store';
import { StationDataTypes } from '@/store/modules';
import React from 'react';
import { useHomeNavigation } from '@/navigation/HomeNavigation';
import SwapStation from './components/SwapStation';
import IconRightArrowHead from '@assets/icons/right_arrow_head.svg';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import { Path } from '@/global/apis/entity';
import LoadingCircle from '@/global/components/animations/LoadingCircle';
import { IssuesBanner } from '../homeScreen/components';

dayjs.locale('ko');

export interface SelectedStationTypes {
  departure: StationDataTypes;
  arrival: StationDataTypes;
}

const SearchPathResultScreen = () => {
  const homeNavigation = useHomeNavigation();
  const selectedStationRedux = useAppSelect(({ subwaySearch }) => subwaySearch.selectedStation);

  const { data, isLoading } = useGetSearchPaths({
    params: {
      strStationName: selectedStationRedux.departure.stationName,
      strStationLine: selectedStationRedux.departure.stationLine,
      endStationName: selectedStationRedux.arrival.stationName,
      endStationLine: selectedStationRedux.arrival.stationLine,
    },
    enabled:
      !!selectedStationRedux.departure.stationName &&
      !!selectedStationRedux.departure.stationLine &&
      !!selectedStationRedux.arrival.stationName &&
      !!selectedStationRedux.arrival.stationLine,
  });

  const pathTime = (item: Path) => {
    const hasIssue = item.subPaths.some((sub) => !!sub.issueSummary);
    const minute = hasIssue ? '분 이상' : '분';
    return item.totalTime > 60
      ? Math.floor(item.totalTime / 60) + '시간 ' + (item.totalTime % 60) + minute
      : item.totalTime + minute;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row p-16 pb-15 pl-22 border-b-16 border-gray-f2">
        <TouchableOpacity className="mt-4 mr-16" onPress={() => homeNavigation.goBack()}>
          <IconLeftArrowHead color="#3F3F46" />
        </TouchableOpacity>
        <SwapStation selectedStation={selectedStationRedux} />
      </View>

      <View className="px-16 bg-white py-14 border-b-1 border-gray-beb">
        <FontText
          text={'오늘 ' + dayjs().format('A HH시 mm분') + ' 기준'}
          className="text-brown-54f"
        />
      </View>
      <ScrollView style={!isLoading && { backgroundColor: COLOR.GRAY_F2 }}>
        {isLoading && (
          <View className="items-center mt-100">
            <LoadingCircle width={40} height={40} />
          </View>
        )}
        {data &&
          data.paths.map((item, idx) => (
            <Pressable
              key={item.firstStartStation + item.subPaths.length + idx}
              style={({ pressed }) => ({
                backgroundColor: pressed ? COLOR.GRAY_E5 : 'white',
                paddingHorizontal: 18,
                paddingBottom: 24,
                paddingTop: 20,
                borderBottomColor: COLOR.GRAY_EB,
                borderBottomWidth: 1,
              })}
              onPress={() => homeNavigation.push('SubwayPathDetail', { state: item })}
            >
              <View className="flex-row items-center justify-between">
                <FontText text="평균 소요시간" className="text-11 text-gray-999" fontWeight="600" />
                <View className="flex-row items-center">
                  <FontText text="세부정보" className="mr-4 text-13 text-gray-999" />
                  <IconRightArrowHead color={COLOR.GRAY_999} />
                </View>
              </View>
              <FontText text={pathTime(item)} className="mt-4 mb-16 text-20" fontWeight="600" />

              {/* 지하철 경로 UI */}
              <SubwaySimplePath
                pathData={item.subPaths}
                arriveStationName={item.lastEndStation}
                betweenPathMargin={24}
              />
              <IssuesBanner subPaths={item.subPaths} />
            </Pressable>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchPathResultScreen;
