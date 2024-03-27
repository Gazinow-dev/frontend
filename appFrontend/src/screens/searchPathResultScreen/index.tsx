import styled from '@emotion/native';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';

import { FontText, Space } from '@/global/ui';
import { COLOR } from '@/global/constants';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { SubwaySimplePath } from '@/global/components';
import { useGetSearchPaths } from '@/global/apis/hooks';
import { useAppDispatch, useAppSelect } from '@/store';
import { StationDataTypes, getIssueId } from '@/store/modules';
import React, { useEffect } from 'react';
import { useHomeNavigation } from '@/navigation/HomeNavigation';
import SwapStation from './components/SwapStation';
import IconRightArrowHead from '@assets/icons/right_arrow_head.svg';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import IssueKeywordIcon from '@/global/components/subwaySimplePath/IssueKeywordIcon';
import { subwayLineColor } from '@/global/utils';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { Path } from '@/global/apis/entity';

dayjs.locale('ko');

export interface SelectedStationTypes {
  departure: StationDataTypes;
  arrival: StationDataTypes;
}

const SearchPathResultScreen = () => {
  const homeNavigation = useHomeNavigation();
  const rootNavigation = useRootNavigation();
  const selectedStationRedux = useAppSelect(({ subwaySearch }) => subwaySearch.selectedStation);
  const dispatch = useAppDispatch();

  const { data } = useGetSearchPaths({
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
    const hasIssue = item.subPaths.some(
      (sub) => !!sub.lanes[0] && !!sub.lanes[0].issueSummary.length,
    );
    const minute = hasIssue ? '분 이상' : '분';
    return item.totalTime > 60
      ? Math.floor(item.totalTime / 60) + '시간 ' + (item.totalTime % 60) + minute
      : item.totalTime + minute;
  };

  const low = {
    fast: 40,
    slow: 10,
  };

  useEffect(() => {
    console.log(low.fast);
    let a = [low.slow];
  }, [low]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.WHITE }}>
      <View style={{ backgroundColor: COLOR.GRAY_F2, flex: 1 }}>
        <View
          style={{
            backgroundColor: COLOR.WHITE,
            flexDirection: 'row',
            paddingTop: 16,
            paddingRight: 16,
            paddingBottom: 15,
            paddingLeft: 22,
            marginBottom: 16,
          }}
        >
          <View style={{ marginTop: 4, marginRight: 16 }}>
            <TouchableOpacity onPress={() => homeNavigation.goBack()}>
              <IconLeftArrowHead color="#3F3F46" />
            </TouchableOpacity>
          </View>
          <SwapStation selectedStation={selectedStationRedux} />
        </View>

        <View
          style={{
            backgroundColor: COLOR.WHITE,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderBottomColor: COLOR.GRAY_EB,
            borderBottomWidth: 1,
          }}
        >
          <FontText
            value={'오늘 ' + dayjs().format('A HH시 mm분') + ' 기준'}
            textSize="16px"
            textWeight="Regular"
            textColor="#49454F"
          />
        </View>

        <ScrollView style={{ backgroundColor: COLOR.WHITE }}>
          {data &&
            data.paths.map((item, idx) => (
              <View
                key={
                  item.firstStartStation +
                  item.totalTime +
                  item.subPaths.length +
                  item.subwayTransitCount +
                  idx
                }
                style={{
                  paddingHorizontal: 18,
                  paddingBottom: 24,
                  paddingTop: 20,
                  borderBottomColor: data.paths.length - 1 !== idx ? COLOR.GRAY_EB : 'none',
                  borderBottomWidth: data.paths.length - 1 !== idx ? 1 : 0,
                }}
              >
                <View style={{ marginBottom: 16 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <FontText
                      value="평균 소요시간"
                      textSize="11px"
                      textWeight="SemiBold"
                      textColor="#999"
                    />
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                      onPress={() =>
                        homeNavigation.push('SubwayPathDetail', {
                          state: item,
                        })
                      }
                    >
                      <FontText
                        value="세부정보"
                        textSize="13px"
                        textWeight="Regular"
                        textColor="#999"
                      />
                      <Space width="4px" />
                      <IconRightArrowHead color={COLOR.GRAY_999} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ height: 4 }} />
                  <FontText
                    value={pathTime(item)}
                    textSize="20px"
                    textWeight="SemiBold"
                    textColor={COLOR.BASIC_BLACK}
                  />
                </View>

                {/* 지하철 경로 UI */}
                <SubwaySimplePath
                  pathData={item.subPaths}
                  arriveStationName={item.lastEndStation}
                  betweenPathMargin={24}
                />

                <View>
                  {item.subPaths.map((linePath) => {
                    return (
                      <React.Fragment
                        key={linePath.distance + linePath.door + linePath.sectionTime}
                      >
                        {linePath.lanes[0] &&
                          linePath.lanes[0].issueSummary.map(({ keyword, title, id }, idx) => {
                            if (idx > 2) return;
                            return (
                              <TouchableOpacity
                                key={id}
                                style={{
                                  borderWidth: 1,
                                  borderColor: 'rgba(0, 0, 0, 0.06)',
                                  borderRadius: 999,
                                  paddingLeft: 17,
                                  paddingRight: 12.5,
                                  paddingTop: 9,
                                  paddingBottom: 6,
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flex: 1,
                                  marginBottom: 8,
                                }}
                                onPress={
                                  () => {
                                    dispatch(getIssueId(id));
                                    rootNavigation.navigate('IssueStack', {
                                      screen: 'IssueDetail',
                                    });
                                  }
                                  // homeNavigation.navigate('SubwayPathDetail', { state: item })
                                }
                              >
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                  <IssueKeywordIcon
                                    width={24}
                                    height={24}
                                    keyword={keyword}
                                    color={subwayLineColor(linePath.lanes[0].stationCode)}
                                  />
                                  <FontText
                                    value={title}
                                    textSize="13px"
                                    textWeight="SemiBold"
                                    textColor={COLOR.BASIC_BLACK}
                                    numberOfLines={1}
                                    style={{ marginLeft: 10 }}
                                  />
                                </View>
                                <View style={{ marginBottom: 4, marginLeft: 40 }}>
                                  <IconRightArrowHead width={8} height={8} color={COLOR.GRAY_999} />
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SearchPathResultScreen;

const LeftIconBox = styled.View`
  margin-top: 13px;
  margin-right: 16px;
`;
const MoreIcon = styled.Image`
  width: 4.5px;
  height: 8px;
`;
