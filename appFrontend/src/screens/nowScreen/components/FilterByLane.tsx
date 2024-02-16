import React, { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import styled from '@emotion/native';
import { FontText } from '@/global/ui';
import IssueContainer from './IssueContainer';
import { AllIssues } from '@/global/apis/entity';
import { axiosInstance } from '@/global/apis/axiosInstance';
import { COLOR } from '@/global/constants';

interface FilterByLaneProps {
  lane: string;
  getTimeDifference: (startDate: string) => { hoursDifference: number; minutesDifference: number };
  isEntireList: boolean;
}

const FilterByLane = ({ lane, getTimeDifference, isEntireList }: FilterByLaneProps) => {
  // const { data: issues } = useGetIssuesByLaneQuery(lane);

  const [issues, setIssues] = useState<AllIssues | null>();

  useEffect(() => {
    axiosInstance
      .get<{ data: AllIssues }>('/api/v1/issue/get_line', {
        params: { line: lane },
      })
      .then((res) => {
        setIssues(res.data.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        Alert.alert('네트워크 오류', '인터넷 연결을 확인해주세요');
      });
  }, [lane]);

  const flatList = () => (
    <FlatList
      ListHeaderComponent={
        <IssueLineType>
          <FontText value={`${lane} NOW`} textSize="20px" textWeight="SemiBold" lineHeight="25px" />
        </IssueLineType>
      }
      data={issues?.content}
      renderItem={({ item, index }) => {
        const isLastItemOfType = issues?.content && index === issues.content.length - 1;
        const isLastItem = issues?.content && index === issues.content.length - 1;
        const { hoursDifference, minutesDifference } = getTimeDifference(item.startDate);
        return (
          <IssueContainer
            key={item.id}
            id={item.id}
            title={item.title}
            location="중구 만리동" // FIXME: 백엔드
            time={`${hoursDifference}시간 ${minutesDifference}분전`}
            body={item.content}
            isLastItemOfType={isLastItemOfType}
            isLastItem={isLastItem}
          />
        );
      }}
      keyExtractor={(item, index) => `${item.id}_${index}`}
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
  );

  // 호출한 탭에 따라서 구분
  if (isEntireList) {
    if (issues?.empty) {
      return null;
    }
    return flatList();
  } else {
    return flatList();
  }
};

const IssueLineType = styled.View`
  padding: 24px 16px 12px;
`;

export default FilterByLane;
