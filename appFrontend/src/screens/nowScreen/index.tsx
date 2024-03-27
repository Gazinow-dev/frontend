import React, { useEffect, useState } from 'react';
import styled from '@emotion/native';
import { COLOR } from '@/global/constants';
import { useQueryClient } from 'react-query';
import { IssueContainer, LaneButtons } from './components';
import { FreshSubwayLineName, IssueContent, NowScreenCapsules } from '@/global/apis/entity';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import {
  useGetAllIssuesQuery,
  useGetPopularIssuesQuery,
  useGetIssuesByLaneQuery,
} from '@/global/apis/hooks';
import { FontText, Space } from '@/global/ui';
import { subwayReturnLineName } from '@/global/utils/subwayLine';
import LoadingAnimations from '@/global/components/animations/LoadingAnimations';
import { AxiosError } from 'axios';

const NowScreen = () => {
  const queryClient = useQueryClient();
  const [activeButton, setActiveButton] = useState<NowScreenCapsules>('전체');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActiveBtnChanged, setIsActiveBtnChanged] = useState<boolean>(true);
  const [isRefresh, setRefresh] = useState<boolean>(false);
  const [issuesPage, setIssuesPage] = useState(0);
  const [issuesList, setIssuesList] = useState<IssueContent[]>([]);

  useEffect(() => {
    // queryClient.invalidateQueries('getPopularIssues');
    queryClient.invalidateQueries(['getAllIssues', 'getIssuesByLane']);
    setIsActiveBtnChanged(true);
    setIssuesList([]);
    setIssuesPage(0);
  }, [activeButton]);
  const someArr = [];
  someArr.push('hihi');

  const getIssuesCallback = {
    onSuccess: () => {
      setTimeout(() => {
        setRefresh(false);
        setIsLoading(false);
        setIsActiveBtnChanged(false);
      }, 200);
    },
    onError: (error: AxiosError) => {
      if (error.message.includes('Network Error')) {
        Alert.alert('', '네트워크 연결을 확인해 주세요.');
      }
      setRefresh(false);
      setIsLoading(false);
      setIsActiveBtnChanged(false);
    },
  };

  const { popularIssues, popularIssuesRefetch } = useGetPopularIssuesQuery(getIssuesCallback);
  const { allIssues, allIssuesRefetch } = useGetAllIssuesQuery(issuesPage, getIssuesCallback);
  const { laneIssues, laneIssuesRefetch } = useGetIssuesByLaneQuery(
    issuesPage,
    subwayReturnLineName(activeButton as FreshSubwayLineName)!,
    getIssuesCallback,
  );

  useEffect(() => {
    if (allIssues) {
      setIssuesList((prevList) => [...prevList, ...allIssues.content]);
    }
    if (laneIssues) {
      setIssuesList(laneIssues.content);
    }
  }, [allIssues, laneIssues, activeButton]);

  const refreshIssues = () => {
    setRefresh(true);
    setIsLoading(true);
    popularIssuesRefetch();
    allIssuesRefetch();
    laneIssuesRefetch();
  };

  return (
    <Container>
      {/* <PopularIssues activeButton={activeButton} setActiveButton={setActiveButton} /> */}
    </Container>
  );
};

const Container = styled.SafeAreaView`
  background-color: ${COLOR.WHITE};
  flex: 1;
  justify-content: center;
`;
const Header = styled.View`
  padding: 32px 16px 11px;
`;
const IssueLineType = styled.View`
  padding: 24px 16px 12px;
`;

export default NowScreen;
