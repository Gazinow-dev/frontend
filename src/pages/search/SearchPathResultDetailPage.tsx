import { css } from '@emotion/native';
import { useState } from 'react';
import { FlatList, View } from 'react-native';

import { FontText } from '@/components/common/atoms';
import { IconButton } from '@/components/common/molecules';
import { SearchPathDetailItem } from '@/components/search/organism';
import { useRootNavigation } from '@/navigation/RootNavigation';

const dummy = [
  {
    line: '4',
    time: '21분',
    departure: {
      name: '신용산역',
      arrow: '진접 방향',
      fast: '6-4',
      path: [
        {
          line: '2',
          name: '이수역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
        {
          line: '2',
          name: '사당역',
        },
      ],
    },
    arrive: {
      name: '사당역',
      door: '왼쪽',
      trans: '도보 10분', // null 또는 환승시간으로 환승되는 역인지 구분
    },
  },
  {
    line: '2',
    time: '21분',
    departure: {
      name: '신용산역',
      arrow: '진접 방향',
      fast: '6-4',
      path: [
        {
          line: '2',
          name: '이수역',
        },
      ],
    },
    arrive: {
      name: '사당역',
      door: '왼쪽',
      trans: null, // null 또는 환승시간으로 환승되는 역인지 구분
    },
  },
];

const SearchPathResultDetailPage = ({ route }) => {
  const navigation = useRootNavigation();
  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);
  console.log("이전 페이지에서 상세 조회한 경로의 index: ", route.params.pathId)

  return (
    <View
      style={css`
        background-color: white;
        flex: 1;
        padding: 0 16px;
      `}
    >
      {/* header */}
      <View
        style={{
          paddingVertical: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <IconButton
          isFontIcon={true}
          iconType="Feather"
          iconName="chevron-left"
          iconColor="#3F3F46"
          iconWidth="24"
          onPress={() => navigation.goBack()}
        />
        <IconButton
          iconType="FontAwesome"
          isFontIcon={true}
          iconName={isBookmarking ? 'bookmark' : 'bookmark-o'}
          iconWidth="24"
          iconColor={isBookmarking ? '#346BF7' : '#999'}
          onPress={() => setIsBookmarking((prev) => !prev)}
        />
      </View>
      <View
        style={css`
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <View>
          <FontText
            value="평균 소요시간"
            textSize="12px"
            textWeight="Medium"
            lineHeight="14px"
            textColor="#999"
          />
          <View
            style={css`
              flex-direction: row;
              margin-top: 4px;
            `}
          >
            <FontText value="42분" textSize="24px" textWeight="Bold" lineHeight="32px" />
            <View
              style={css`
                width: 8px;
              `}
            />
            <View>
              <View
                style={css`
                  flex: 1;
                `}
              />
              <FontText
                value="환승 1회"
                textSize="14px"
                textWeight="Regular"
                lineHeight="21px"
                textColor="#999"
              />
            </View>
          </View>
        </View>
      </View>
      <View
        style={css`
          margin-bottom: 20px;
          margin-top: 22px;
          height: 1px;
          background-color: #ebebeb;
        `}
      />
      <FlatList
        data={dummy}
        keyExtractor={(item) => item.departure.name}
        renderItem={({ item }) => <SearchPathDetailItem detailData={item} />}
      />
    </View>
  );
};

export default SearchPathResultDetailPage;
