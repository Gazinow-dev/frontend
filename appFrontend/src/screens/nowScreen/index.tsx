import React, { useEffect, useState } from 'react';
import styled from '@emotion/native';
import { FontText, Space } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { FlatList, Platform, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { useGetAllIssuesQuery, useGetSavedRoutesQuery } from '@/global/apis/hook';
import { Path } from '@/global/apis/entity';
import IssueContainer from './components/IssueContainer';
import FilterByLane from './components/FilterByLane';
import { useQueryClient } from 'react-query';
import { getStatusBarHeight } from 'react-native-status-bar-height';

//FIXME: 1~9호선이 아닌 것들의 이름 고치기
//FIXME: 마지막 리스트 구분선 스타일
//TODO: + 버튼 구현
const NowScreen = () => {
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : (StatusBar.currentHeight as number);
  const queryClient = useQueryClient();
  const [activeButton, setActiveButton] = useState<string>('전체');
  const renderButtons = () => {
    return [' + ', '전체', ...savedStations].map((text) => (
      <ButtonStyle
        key={text}
        onPress={() => setActiveButton(text)}
        activeButton={activeButton === text}
      >
        <FontText
          value={text}
          textSize="16px"
          textWeight="Medium"
          lineHeight="21px"
          textColor={activeButton === text ? 'white' : '#969696'}
        />
      </ButtonStyle>
    ));
  };

  // 'N분 전' 계산
  const getTimeDifference = (startDate: string) => {
    const timeDifference = new Date().getTime() - new Date(startDate).getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    return { hoursDifference, minutesDifference };
  };

  const { data: savedRoutes } = useGetSavedRoutesQuery();
  // 내가 저장한 경로의 노선만 가져옴
  const savedStations: string[] = Array.from(
    new Set(
      savedRoutes?.flatMap((item: Path) =>
        item.subPaths.flatMap((subPath) => subPath.lanes.map((lane) => `${lane.stationCode}호선`)),
      ),
    ),
  ).sort();

  const { data: AllIssues } = useGetAllIssuesQuery();
  useEffect(() => {
    queryClient.invalidateQueries('getAllIssues');
  }, [activeButton]);

  return (
    <Container
      style={{
        paddingTop: StatusBarHeight,
      }}
    >
      <Header>
        <FontText value="NOW" textSize="24px" textWeight="SemiBold" lineHeight="34px" />
      </Header>
      <Category>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.textContainer}
        >
          <Space width="16px" />
          {renderButtons()}
          <Space width="16px" />
        </ScrollView>
      </Category>
      {activeButton === '전체' && (
        <FlatList
          data={AllIssues?.content}
          ListHeaderComponent={
            <IssueLineType>
              <FontText value="지금 인기" textSize="20px" textWeight="SemiBold" lineHeight="25px" />
            </IssueLineType>
          }
          renderItem={({ item, index }) => {
            const isLastItemOfType = AllIssues && index === AllIssues.content.length - 1;
            // const isLastItem = AllIssues.length === 0 && isLastItemOfType;
            const { hoursDifference, minutesDifference } = getTimeDifference(item.startDate);
            return (
              <IssueContainer
                key={item.id}
                id={item.id}
                title={item.title}
                location="중구 만리동" //FIXME: 백엔드
                time={`${hoursDifference}시간 ${minutesDifference}분전`}
                body={item.content}
                isLastItemOfType={isLastItemOfType}
                // isLastItem={isLastItem}
              />
            );
          }}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          ListFooterComponent={
            <FlatList
              data={savedStations}
              renderItem={({ item }) => (
                <FilterByLane
                  lane={item}
                  getTimeDifference={getTimeDifference}
                  isEntireList={true}
                />
              )}
            />
          }
          ListEmptyComponent={
            <FontText
              value="올라온 이슈가 없어요"
              textSize="18px"
              textWeight="Regular"
              lineHeight="500px"
              textColor={COLOR.GRAY_999}
              textAlign="center"
            />
          }
        />
      )}
      {activeButton !== '전체' && (
        <FilterByLane
          lane={activeButton}
          getTimeDifference={getTimeDifference}
          isEntireList={false}
        />
      )}
    </Container>
  );
};

const Container = styled.View`
  background-color: ${COLOR.WHITE};
  flex: 1;
`;
const Header = styled.View`
  padding: 11px 16px;
`;
const ButtonStyle = styled.TouchableOpacity<{ activeButton: boolean }>`
  border-width: 1px;
  border-color: ${({ activeButton }) => (activeButton ? 'transparent' : COLOR.GRAY_EB)};
  border-radius: 999px;
  padding-vertical: 8px;
  padding-horizontal: 16px;
  margin-right: 6px;
  background-color: ${({ activeButton }) => (activeButton ? '#171717' : 'white')};
`;
const Category = styled.View`
  padding: 12px 0;
  flex-direction: row;
  align-items: center;
`;
const IssueLineType = styled.View`
  padding: 24px 16px 12px;
`;

const styles = StyleSheet.create({
  navButton: {
    borderWidth: 1,
    borderColor: COLOR.GRAY_EB,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 6,
  },
  textContainer: {
    flexDirection: 'row',
  },
});

export default NowScreen;
