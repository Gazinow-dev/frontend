import { LaneButtons, LineNum } from '@screens/onboardingScreen/components';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useQuery } from 'react-query';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { getSeletedStation } from '@/store/modules/stationSearchModule';
import { DisplayLineName, LineCapsules, OriginLineName } from '@/global/apis/entity';
import { searchStationsInLine } from '@/global/apis/func';
import { useAddRecentSearch, useSearchStationName } from '@/global/apis/hooks';
import { COLOR } from '@/global/constants';
import { FontText, Input } from '@/global/ui';
import { displayToOrigin, lineCapsuleToOrigin } from '@/global/utils';
import {
  trackMapBookmark3ArrivalChoice,
  trackMapBookmark3DepartureChoice,
} from '@/analytics/map.events';
import { IconNoResult, IconSearch } from '@/assets/icons';
import { useAppDispatch, useAppSelect } from '@/store';

interface Props {
  closeModal: () => void;
}

const OnboardingSearchModal = ({ closeModal }: Props) => {
  const dispatch = useAppDispatch();
  const { selectedStation, stationType } = useAppSelect((state) => state.subwaySearch);

  // N호선 캡슐로 N호선의 모든 역 불러오기
  const [activeButton, setActiveButton] = useState<LineCapsules>('전체');
  const { data: searchStationsInLineData } = useQuery(
    ['searchStationsInLine', activeButton],
    () => searchStationsInLine({ line: lineCapsuleToOrigin(activeButton) ?? '전체' }),
    { enabled: !!activeButton },
  );

  // 역명 직접 검색
  const [searchTextValue, setSearchTextValue] = useState<string>('');
  const changeSearchText = (text: string) => {
    setSearchTextValue(text);
  };
  const { searchResultData, isLoading: isLoadingSearch } = useSearchStationName(searchTextValue);

  // 클릭된 역을 최근검색 역에 저장(서버) -> 성공 시 전역변수에도 저장하고 모달 닫기
  const { addRecentMutate } = useAddRecentSearch({
    onSuccess: ({ stationLine, stationName }) => {
      const key = stationType === '출발역' ? 'departure' : 'arrival';
      dispatch(
        getSeletedStation({
          ...selectedStation,
          [key]: { stationLine, stationName },
        }),
      );
      closeModal();
    },
  });

  // 역 클릭 핸들러
  const stationBtnHandler = ({
    stationName,
    stationLine,
    lineNameType,
  }: {
    stationName: string;
    stationLine: OriginLineName | DisplayLineName | '전체';
    lineNameType: 'display' | 'origin';
  }) => {
    if (!stationLine) return;

    if (stationType === '출발역') {
      trackMapBookmark3DepartureChoice({ station: stationName, line: stationLine });
    } else {
      trackMapBookmark3ArrivalChoice({ station: stationName, line: stationLine });
    }

    if (lineNameType === 'origin') {
      addRecentMutate({ stationName, stationLine: stationLine as OriginLineName });
    } else {
      addRecentMutate({
        stationName,
        stationLine: displayToOrigin(stationLine as DisplayLineName),
      });
    }
  };

  const StatusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) + 30 : 30;
  const animRef = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    const animation = Animated.timing(animRef, {
      toValue: StatusBarHeight,
      duration: 600,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Modal visible onRequestClose={closeModal}>
      <View className="flex-1 bg-black/60">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="justify-end flex-1"
        >
          <Animated.View
            className="relative flex-1 bg-white top-60"
            style={{
              borderTopStartRadius: 14,
              borderTopEndRadius: 14,
              paddingBottom: StatusBarHeight,
              transform: [{ translateY: animRef }],
            }}
          >
            <TouchableOpacity hitSlop={20} className="flex items-center mt-12" onPress={closeModal}>
              <View className="h-4 w-34 rounded-2 bg-gray-ddd" />
            </TouchableOpacity>

            <FontText
              text={`${stationType}을 선택해주세요`}
              className="m-16 mb-14 text-20 leading-25"
              fontWeight="600"
            />

            <View className="flex-row items-center px-10 mx-16 space-x-12 my-14 rounded-8 bg-gray-9f9 py-9">
              <IconSearch />
              <Input
                className="leading-21"
                value={searchTextValue}
                placeholder="역명 검색"
                placeholderTextColor={COLOR.GRAY_BE}
                inputMode="search"
                onChangeText={changeSearchText}
                hitSlop={{ top: 20, bottom: 20, right: 500, left: 50 }}
              />
            </View>

            {!searchTextValue ? (
              <View className="flex-1">
                <LaneButtons activeButton={activeButton} setActiveButton={setActiveButton} />
                <ScrollView keyboardShouldPersistTaps="handled">
                  {searchStationsInLineData?.map(({ name, line }, idx) => (
                    <Pressable
                      style={({ pressed }) => ({
                        backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 12,
                        paddingLeft: 16,
                        gap: 8,
                      })}
                      onPress={() =>
                        stationBtnHandler({
                          stationName: name,
                          stationLine:
                            activeButton === '전체' ? line[0] : lineCapsuleToOrigin(activeButton),
                          lineNameType: 'origin',
                        })
                      }
                      key={`${name}_${idx}`}
                    >
                      {line?.map((l) => (
                        <LineNum key={l} originName={l ?? '수도권 1호선'} />
                      ))}
                      <FontText
                        text={name.split('(')[0]}
                        className="text-black text-14 leading-21"
                        fontWeight="500"
                      />
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <View className="flex-1">
                {/* 입력어가 있고 && 검색 결과가 없으면 없음 표시 */}
                {searchResultData.length < 1 && !isLoadingSearch && (
                  <View className="items-center justify-center flex-1 gap-17">
                    <IconNoResult />
                    <FontText
                      text="검색 결과가 없습니다!"
                      className="text-18 leading-23 text-gray-ddd"
                    />
                  </View>
                )}
                {/* 입력어가 있고 && 검색 결과가 있으면 결과 표시 */}
                {searchResultData.length > 0 && (
                  <ScrollView keyboardShouldPersistTaps="always">
                    {searchResultData.map(({ stationName, stationLine }, idx) => (
                      <Pressable
                        style={({ pressed }) => ({
                          backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingVertical: 12,
                          paddingLeft: 16,
                          gap: 8,
                        })}
                        key={idx}
                        onPress={() =>
                          stationBtnHandler({ stationLine, stationName, lineNameType: 'display' })
                        }
                      >
                        <LineNum displayName={stationLine ?? '1호선'} />
                        <FontText
                          text={stationName.split('(')[0]}
                          className="text-black text-14 leading-21"
                          fontWeight="500"
                        />
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default OnboardingSearchModal;
