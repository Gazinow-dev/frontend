import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useAppDispatch, useAppSelect } from '@/store';
import { getSeletedStation } from '@/store/modules/stationSearchModule';
import { useAddRecentSearch, useGetSearchHistory, useSearchStationName } from '@/global/apis/hooks';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { subwayReturnLineName } from '@/global/utils/subwayLine';
import AddNewRouteHeader from './AddNewRouteHeader';
import { useNewRouteNavigation } from '@/navigation/NewRouteNavigation';
import { IconClock, IconLocationPin, IconNoResult, IconCrossCircle } from '@/assets/icons';
import {
  trackMapBookmark3ArrivalChoice,
  trackMapBookmark3DepartureChoice,
} from '@/analytics/map.events';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchStation = () => {
  const newRouteNavigation = useNewRouteNavigation();
  const dispatch = useAppDispatch();
  const { selectedStation, stationType } = useAppSelect((state) => state.subwaySearch);

  const { historyData } = useGetSearchHistory();

  const [searchTextValue, setSearchTextValue] = useState<string>('');

  const changeSearchText = (text: string) => {
    setSearchTextValue(text);
  };

  const { searchResultData } = useSearchStationName(searchTextValue);
  const { addRecentMutate } = useAddRecentSearch({
    onSuccess: ({ stationLine, stationName }) => {
      const key = stationType === '출발역' ? 'departure' : 'arrival';
      dispatch(
        getSeletedStation({
          ...selectedStation,
          [key]: {
            stationLine,
            stationName,
          },
        }),
      );
      const isDuplicate =
        selectedStation.arrival.stationName === stationName ||
        selectedStation.departure.stationName === stationName;
      if (isDuplicate) {
        newRouteNavigation.goBack();
      } else if (
        (key === 'departure' && selectedStation.arrival.stationName) ||
        (key === 'arrival' && selectedStation.departure.stationName)
      ) {
        newRouteNavigation.push('Result');
      } else newRouteNavigation.goBack();
    },
  });

  const stationBtnHandler = ({ stationName, stationLine }: (typeof searchResultData)[0]) => {
    if (!stationLine) return;

    if (stationType === '출발역') {
      trackMapBookmark3DepartureChoice({ station: stationName, line: stationLine });
    } else {
      trackMapBookmark3ArrivalChoice({ station: stationName, line: stationLine });
    }

    addRecentMutate({ stationName, stationLine: subwayReturnLineName(stationLine) });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <AddNewRouteHeader />

        <View className="mx-16 mt-20 flex-row items-center rounded-28 border-1 border-[#d4d4d4] px-18 py-4">
          <Input
            className="h-36 flex-1"
            value={searchTextValue}
            placeholder={`${stationType}을 검색해보세요`}
            placeholderTextColor={COLOR.GRAY_BE}
            inputMode="search"
            onChangeText={changeSearchText}
            autoFocus
          />
          <TouchableOpacity hitSlop={20} onPress={() => setSearchTextValue('')}>
            <IconCrossCircle />
          </TouchableOpacity>
        </View>

        {!searchTextValue ? (
          <View className="flex-1 pt-18">
            <View style={{ paddingLeft: 16 }}>
              <FontText text="최근검색" className="text-14 text-[#757575]" />
            </View>

            <ScrollView className="mt-18" keyboardShouldPersistTaps="handled">
              {historyData?.map(({ stationName, stationLine }, idx) => (
                <Pressable
                  style={({ pressed }) => ({
                    backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
                    flexDirection: 'row',
                    paddingVertical: 12,
                    paddingLeft: 16,
                    borderBottomWidth: 1,
                    borderColor: COLOR.GRAY_EB,
                    gap: 7,
                  })}
                  onPress={() => stationBtnHandler({ stationName, stationLine })}
                  key={`${stationName}_${idx}`}
                >
                  <IconClock />
                  <View>
                    <FontText
                      text={stationName.split('(')[0]}
                      className="text-black"
                      fontWeight="500"
                    />
                    <View className="h-3" />
                    <FontText text={stationLine!} className="text-14 text-gray-999" />
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View className="flex-1">
            {/* 입력어가 있고 && 검색 결과가 없으면 없음 표시 */}
            {searchResultData.length < 1 && (
              <View className="flex-1 items-center justify-center gap-17">
                <IconNoResult />
                <FontText
                  text="검색 결과가 없습니다!"
                  className="text-18 leading-23 text-gray-ddd"
                />
              </View>
            )}
            {/* 입력어가 있고 && 검색 결과가 있으면 결과 표시 */}
            {searchResultData.length > 0 && (
              <ScrollView className="mt-28" keyboardShouldPersistTaps="handled">
                {searchResultData.map(({ stationName, stationLine }, idx) => (
                  <Pressable
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
                      flexDirection: 'row',
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderColor: COLOR.GRAY_EB,
                      gap: 7,
                    })}
                    key={idx}
                    onPress={() => stationBtnHandler({ stationLine, stationName })}
                  >
                    <IconLocationPin />
                    <View>
                      <FontText
                        text={stationName.split('(')[0]}
                        className="leading-21 text-black"
                        fontWeight="500"
                      />
                      <View className="h-3" />
                      <FontText text={stationLine!} className="text-14 leading-21 text-gray-999" />
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SearchStation;
