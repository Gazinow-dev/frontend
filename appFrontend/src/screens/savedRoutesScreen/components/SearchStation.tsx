import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useAppDispatch, useAppSelect } from '@/store';
import { getSeletedStation } from '@/store/modules/stationSearchModule';
import { useAddRecentSearch, useGetSearchHistory, useSearchStationName } from '@/global/apis/hooks';
import { useState } from 'react';
import IconXCircleFill from '@assets/icons/x_circle_fill.svg';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { subwayReturnLineName } from '@/global/utils/subwayLine';
import IconLocationPin from '@assets/icons/location_pin.svg';
import AddNewRouteHeader from './AddNewRouteHeader';
import { useNewRouteNavigation } from '@/navigation/NewRouteNavigation';
import IconClock from '@assets/icons/clock.svg';
import NoResultIcon from '@/assets/icons/no_result_icon.svg';
import NoResultText from '@/assets/icons/no_result_text.svg';

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
    addRecentMutate({ stationName, stationLine: subwayReturnLineName(stationLine) });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AddNewRouteHeader />

      <View className="flex-row items-center rounded-28 border-1 border-[#d4d4d4] px-18 py-4 mt-20 mx-16">
        <Input
          className="flex-1 h-36"
          value={searchTextValue}
          placeholder={`${stationType}을 검색해보세요`}
          placeholderTextColor={COLOR.GRAY_BE}
          inputMode="search"
          onChangeText={changeSearchText}
          autoFocus
        />
        <TouchableOpacity hitSlop={20} onPress={() => setSearchTextValue('')}>
          <IconXCircleFill width={19.5} />
        </TouchableOpacity>
      </View>

      {!searchTextValue ? (
        <View className="flex-1 pt-18">
          <FontText
            className="pl-16"
            value="최근검색"
            textSize="14px"
            textWeight="Regular"
            textColor="#757575"
          />

          <ScrollView className="mt-18" keyboardShouldPersistTaps="handled">
            {historyData?.map(({ stationName, stationLine }, index) => (
              <>
                <TouchableOpacity
                  className="flex-row py-12 pl-16 gap-7"
                  key={index}
                  onPress={() =>
                    stationBtnHandler({
                      stationName,
                      stationLine,
                    })
                  }
                >
                  <IconClock />
                  <View className="gap-3">
                    <FontText
                      value={stationName}
                      textSize="16px"
                      textWeight="Medium"
                      textColor="#000"
                    />
                    <FontText
                      value={stationLine!}
                      textSize="14px"
                      textWeight="Regular"
                      textColor={COLOR.GRAY_999}
                    />
                  </View>
                </TouchableOpacity>
                <View className="h-1 bg-gray-eb" />
              </>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View className="flex-1">
          {/* 입력어가 있고 && 검색 결과가 없으면 없음 표시 */}
          {searchResultData.length < 1 && (
            <View className="items-center justify-center flex-1 gap-17">
              <NoResultIcon />
              <NoResultText />
            </View>
          )}
          {/* 입력어가 있고 && 검색 결과가 있으면 결과 표시 */}
          {searchResultData.length > 0 && (
            <ScrollView className="mt-28">
              {searchResultData.map(({ stationName, stationLine }, idx) => (
                <>
                  <TouchableOpacity
                    className="flex-row py-12 pl-16 gap-7"
                    key={idx}
                    onPress={() => stationBtnHandler({ stationLine, stationName })}
                  >
                    <IconLocationPin />
                    <View className="gap-3">
                      <FontText
                        value={stationName}
                        textSize="16px"
                        textWeight="Medium"
                        lineHeight={21}
                        textColor="#000"
                      />
                      <FontText
                        value={stationLine!}
                        textSize="14px"
                        textWeight="Regular"
                        lineHeight={21}
                        textColor={COLOR.GRAY_999}
                      />
                    </View>
                  </TouchableOpacity>
                  <View className="h-1 bg-gray-eb" />
                </>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchStation;
