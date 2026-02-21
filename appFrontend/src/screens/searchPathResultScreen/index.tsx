import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { FontText } from '@/global/ui';
import { COLOR } from '@/global/constants';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { SubwaySimplePath } from '@/global/components';
import { useGetSearchPaths } from '@/global/apis/hooks';
import { useAppSelect } from '@/store';
import { StationDataTypes } from '@/store/modules';
import { useHomeNavigation } from '@/navigation/HomeNavigation';
import SwapStation from './components/SwapStation';
import { IconChevronLeft, IconChevronRight3 } from '@assets/icons';
import { Path } from '@/global/apis/entity';
import LoadingCircle from '@/global/components/animations/LoadingCircle';
import { IssuesBanner } from '../homeScreen/components';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row p-16 border-b-16 border-gray-f2 pb-15 pl-22">
        <TouchableOpacity className="mt-4 mr-16" onPress={() => homeNavigation.goBack()}>
          <IconChevronLeft />
        </TouchableOpacity>
        <SwapStation selectedStation={selectedStationRedux} />
      </View>
      {isLoading && (
        <View className="items-center justify-center flex-1">
          <LoadingCircle size={40} />
        </View>
      )}
      {!data && !isLoading && (
        <View className="items-center justify-center flex-1 bg-white">
          <FontText text="검색 결과가 없어요" className="text-gray-999" />
        </View>
      )}
      {data && (
        <>
          <View className="px-16 bg-white border-b-1 border-gray-beb py-14">
            <FontText
              text={'오늘 ' + dayjs().format('A HH시 mm분') + ' 기준'}
              className="text-purple-54f"
            />
          </View>
          <ScrollView style={!isLoading && { backgroundColor: COLOR.GRAY_F2 }}>
            {data.paths.map((item, idx) => (
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
                  <FontText
                    text="평균 소요시간"
                    className="text-11 text-gray-999"
                    fontWeight="600"
                  />
                  <View className="flex-row items-center">
                    <FontText text="세부정보" className="mr-4 text-13 text-gray-999" />
                    <IconChevronRight3 color={COLOR.GRAY_999} />
                  </View>
                </View>
                <FontText text={pathTime(item)} className="mt-4 mb-16 text-20" fontWeight="600" />

                <SubwaySimplePath
                  pathData={item.subPaths}
                  arriveStationName={item.lastEndStation}
                  betweenPathMargin={24}
                />
                <IssuesBanner subPaths={item.subPaths} />
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default SearchPathResultScreen;
