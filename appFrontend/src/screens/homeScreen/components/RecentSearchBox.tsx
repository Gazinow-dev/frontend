import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextButton, FontText, Space } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useGetSearchRoutesQuery } from '@/global/apis/hook';
import MoreBtn from '@/assets/icons/moreBtn.svg';

const RecentSearchBox = () => {
  const routeDetail = () => {
    //
  };

  const { data: recentSearchData } = useGetSearchRoutesQuery();

  if (recentSearchData?.length > 0) {
    return (
      <View>
        <View style={styles.titleContainer}>
          <View style={styles.textContainer}>
            <FontText
              value={`${recentSearchData[0].stationName} -> ${recentSearchData[0].destination}`}
              textSize="18px"
              textWeight="Bold"
              lineHeight="23px"
              textColor={COLOR.BASIC_BLACK}
            />
            <FontText
              value={`${recentSearchData[0].duration} 소요`}
              textSize="12px"
              textWeight="Medium"
              lineHeight="14px"
              textColor={COLOR.GRAY_999}
            />
          </View>
          <View style={styles.textContainer}>
            <TextButton
              value="세부정보"
              textSize="13px"
              textWeight="Regular"
              lineHeight="19px"
              textColor={COLOR.GRAY_999}
              onPress={routeDetail}
            />
            <Space width="4px" />
            <MoreBtn onPress={routeDetail} />
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <FontText
        style={styles.messageStyle}
        value="최근 검색한 경로가 없어요."
        textSize="16px"
        textWeight="Medium"
        lineHeight="500px"
        textColor={COLOR.GRAY_999}
      />
    );
  }
};
const styles = StyleSheet.create({
  messageStyle: {
    textAlign: 'center',
  },
  titleContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grayEllipse: {
    backgroundColor: '#f0f0f0',
    borderRadius: 40,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  containerSubwayRoute: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default RecentSearchBox;
