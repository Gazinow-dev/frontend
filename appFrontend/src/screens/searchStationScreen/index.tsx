import { useAddRecentSearch, useGetSearchHistory, useSearchStationName } from '@/global/apis/hooks';
import { COLOR } from '@/global/constants';
import { FontText, Space } from '@/global/ui';
import { subwayReturnLineName } from '@/global/utils/subwayLine';
import { useAppDispatch, useAppSelect } from '@/store';
import { getSeletedStation } from '@/store/modules/stationSearchModule';
import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { Input } from '@/global/ui';
import IconLocationPin from '@assets/icons/location_pin.svg';
import { useHomeNavigation } from '@/navigation/HomeNavigation';
import IconClock from '@assets/icons/clock.svg';
import IconLeftArrow from '@assets/icons/left_arrow_sharp.svg';
import IconXCircleFill from '@assets/icons/x_circle_fill.svg';
import { RawSubwayLineName } from '@/global/apis/entity';
import NoResultIcon from '@/assets/icons/no_result_icon.svg';
import NoResultText from '@/assets/icons/no_result_text.svg';
import cn from 'classname';

const SearchStationScreen = () => {
  const navigation = useHomeNavigation();
  const dispatch = useAppDispatch();
  const { selectedStation, stationType } = useAppSelect((state) => state.subwaySearch);
  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);

  const { historyData } = useGetSearchHistory();

  const [searchTextValue, setSearchTextValue] = useState<string>('');

  const changeSearchText = (text: string) => {
    setSearchTextValue(text);
  };

  const deleteInputText = () => {
    setSearchTextValue('');
  };

  const saveSelectedStation = (stationLine: RawSubwayLineName, stationName: string) => {
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
      navigation.goBack();
    } else if (
      (key === 'departure' && selectedStation.arrival.stationName) ||
      (key === 'arrival' && selectedStation.departure.stationName)
    ) {
      navigation.navigate('SubwayPathResult');
    } else navigation.goBack();
  };

  const { searchResultData } = useSearchStationName(searchTextValue);
  const { addRecentMutate } = useAddRecentSearch({
    onSuccess: ({ stationLine, stationName }) => {
      saveSelectedStation(stationLine, stationName);
    },
  });

  const stationBtnHandler = ({ stationName, stationLine }: (typeof searchResultData)[0]) => {
    if (!stationLine) return;
    if (isVerifiedUser === 'success auth')
      addRecentMutate({ stationName, stationLine: subwayReturnLineName(stationLine) });
    else saveSelectedStation(subwayReturnLineName(stationLine), stationName);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLOR.WHITE,
      }}
    >
      <View className="py-4 pl-[18.25px] pr-16 mx-16 mt-16 flex-row items-center rounded-28 border border-[#d4d4d4]">
        <TouchableOpacity hitSlop={20} onPress={() => navigation.goBack()}>
          <IconLeftArrow />
        </TouchableOpacity>
        <Input
          value={searchTextValue}
          placeholder={`${stationType}을 검색해보세요`}
          placeholderTextColor={COLOR.GRAY_BE}
          inputMode="search"
          onChangeText={changeSearchText}
          autoFocus
          className="ml-16 mr-[31.2px] flex-1 h-36"
        />
        <TouchableOpacity hitSlop={20} onPress={deleteInputText}>
          <IconXCircleFill />
        </TouchableOpacity>
      </View>

      {/* 입력어가 있고 && 검색 결과가 없으면 없음 표시 */}
      {!!searchTextValue && searchResultData.length < 1 && (
        <View className="items-center justify-center flex-1">
          <NoResultIcon />
          <Space height={17} />
          <NoResultText />
        </View>
      )}

      {/* 최근 검색 목록 */}
      {isVerifiedUser === 'success auth' && !searchTextValue && (
        <View className="flex-1">
          <View className="pl-16 mt-18">
            <FontText text="최근검색" className="text-14 leading-24 text-gray-575" />
          </View>

          <ScrollView className="mt-18" keyboardShouldPersistTaps="handled">
            {historyData?.map(({ stationName, stationLine }, index) => (
              <Pressable
                style={({ pressed }) => ({
                  backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
                  flexDirection: 'row',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  gap: 7,
                  borderColor: COLOR.GRAY_EB,
                })}
                key={index}
                onPress={() =>
                  stationBtnHandler({
                    stationName,
                    stationLine,
                  })
                }
              >
                <IconClock />
                <View className="gap-[2.95px]">
                  <FontText
                    text={stationName.split('(')[0]}
                    className="text-black leading-21"
                    fontWeight="500"
                  />
                  <FontText text={stationLine!} className="text-14 leading-21 text-gray-999" />
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {!!searchTextValue && searchResultData.length > 0 && (
        <View className="flex-1">
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
                <View className="gap-[2.95px]">
                  <FontText
                    text={stationName.split('(')[0]}
                    className="text-black leading-21"
                    fontWeight="500"
                  />
                  <FontText text={stationLine!} className="text-14 leading-21 text-gray-99" />
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchStationScreen;
