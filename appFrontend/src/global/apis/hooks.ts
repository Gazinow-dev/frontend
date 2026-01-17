import {
  getNotiHistoryFetch,
  getPopularIssuesAtMainFetch,
  getPopularIssuesFetch,
  getSavedRoutesFetch,
  getSearchRoutesFetch,
  searchStationName,
} from './func';
import { useMutation, useQuery, useInfiniteQuery } from 'react-query';
import {
  searchAddHistoryFetch,
  searchHistoryFetch,
  searchPathSaveFetch,
  searchPathsFetch,
  getAllIssuesFetch,
  getIssuesByLaneFetch,
} from '@/global/apis/func';
import { RawSubwayLineName, MyRoutesType, SubwayStrEnd } from './entity';
import { subwayFreshLineName } from '@/global/utils';
import { useAppSelect } from '@/store';
import { useMemo } from 'react';

/**
 * 지하철역 검색 훅
 */
export const useSearchStationName = (nameValue: string) => {
  const lastChar =
    nameValue.slice(-1) === 'ㅇ' || nameValue.slice(-1) === '여' || nameValue.slice(-1) === '역';
  const stationName = lastChar && nameValue !== '서울역' ? nameValue.slice(0, -1) : nameValue;

  const { data } = useQuery(
    ['search-subway-name', nameValue],
    () => searchStationName({ stationName }),
    {
      enabled: !!stationName,
    },
  );

  const freshData = data ? subwayFreshLineName(data) : [];

  const deduplicatedStationData = useMemo(() => {
    if (!freshData) return [];
    const uniqueStations = new Set();
    return freshData.filter((item) => {
      const key = `${item.stationName.split('(')[0]}-${item.stationLine}`;
      const isDuplicate = uniqueStations.has(key);
      uniqueStations.add(key);
      return !isDuplicate;
    });
  }, [freshData]);
  return {
    searchResultData: deduplicatedStationData.sort((a, b) =>
      a.stationName.localeCompare(b.stationName),
    ),
  };
};

/**
 * 지하철역 검색 이력 조회 훅
 */
export const useGetSearchHistory = () => {
  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);
  const { data } = useQuery(['searchHistory'], searchHistoryFetch, {
    enabled: isVerifiedUser === 'success auth',
  });
  const freshData = data?.map((item) => ({ name: item.stationName, line: item.stationLine }));

  const deduplicatedStationData = useMemo(() => {
    if (!freshData) return [];
    const uniqueStations = new Set();
    return freshData.filter((item) => {
      const key = `${item.name.split('(')[0]}-${item.line}`;
      const isDuplicate = uniqueStations.has(key);
      uniqueStations.add(key);
      return !isDuplicate;
    });
  }, [freshData]);
  return {
    historyData: deduplicatedStationData ? subwayFreshLineName(deduplicatedStationData) : [],
  };
};

/**
 * 지하철 경로 조회 훅
 */
export const useGetSearchPaths = ({
  params,
  enabled,
}: {
  params: SubwayStrEnd;
  enabled: boolean;
}) => {
  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);
  const { data, isLoading } = useQuery(
    ['search_paths', params],
    () => searchPathsFetch({ params, isVerifiedUser }),
    {
      enabled,
    },
  );
  return { data, isLoading };
};

/**
 * 지하철 경로 저장 훅
 */
export const useSavedSubwayRoute = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: number) => void;
  onError: (error: { response: { data: { message: string } } }) => void;
}) => {
  const { data, isLoading, mutate } = useMutation(searchPathSaveFetch, {
    onSuccess,
    onError,
  });

  return { data, isLoading, mutate };
};

/**
 * 최근 검색한 지하철역 기록 훅
 */
export const useAddRecentSearch = ({
  onSuccess,
}: {
  onSuccess: (data: { id: number; stationName: string; stationLine: RawSubwayLineName }) => void;
}) => {
  const { data, mutate } = useMutation(searchAddHistoryFetch, {
    onSuccess,
  });
  const freshData = data
    ? { line: data.stationLine, name: data.stationName }
    : { line: null, name: '' };
  return { data: subwayFreshLineName([freshData]), addRecentMutate: mutate };
};

/**
 * 검색한 지하철 경로 조회 훅
 */
export const useGetSearchRoutesQuery = () => {
  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);
  const { data } = useQuery(['recentSearch'], getSearchRoutesFetch, {
    enabled: isVerifiedUser === 'success auth',
  });
  return { data };
};

/**
 * 저장한 지하철 경로 조회 훅
 */
export const useGetSavedRoutesQuery = () => {
  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);
  const { data, refetch, isLoading, isError } = useQuery(['getRoads'], getSavedRoutesFetch, {
    enabled: isVerifiedUser === 'success auth',
  });
  return {
    myRoutes: data,
    getSavedRoutesRefetch: refetch,
    isLoadingSavedRoutes: isLoading,
    isSavedRoutesError: isError,
  };
};

/**
 * 이슈 전체 조회 훅
 */
export const useGetAllIssuesQuery = () => {
  const { data, refetch, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery(
    ['getAllIssues'],
    ({ pageParam = 0 }) => getAllIssuesFetch({ page: pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.content && lastPage?.content.length < 15) return undefined;
        return allPages.length;
      },
    },
  );
  return {
    allIssues: data,
    allIssuesRefetch: refetch,
    fetchAllIssuesNextPage: fetchNextPage,
    allIssuesHasNextPage: hasNextPage,
    isAllIssuesLoading: isLoading,
  };
};

/**
 * 이슈 노선별 조회 훅
 */
export const useGetIssuesByLaneQuery = (line: string) => {
  const { data, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['getIssuesByLane', line],
    ({ pageParam = 0 }) => getIssuesByLaneFetch({ page: pageParam, line }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.content && lastPage?.content.length < 15) return undefined;
        return allPages.length;
      },
      enabled: line !== '수도권 전체',
    },
  );
  return {
    laneIssues: data,
    laneIssuesRefetch: refetch,
    fetchLaneIssuesNextPage: fetchNextPage,
    laneIssuesHasNextPage: hasNextPage,
  };
};

/**
 * now탭 인기 이슈 조회 훅
 */
export const useGetPopularIssuesQuery = () => {
  const { data, refetch, isLoading } = useQuery(['getPopularIssues'], getPopularIssuesFetch);
  return {
    popularIssues: data,
    popularIssuesRefetch: refetch,
    isPopularIssuesLoading: isLoading,
  };
};

/**
 * 홈화면 캐러셀 인기 이슈 조회 훅
 */
export const useGetPopularIssuesAtMain = () => {
  const { data, refetch } = useQuery(['getPopularIssuesAtMain'], getPopularIssuesAtMainFetch);
  return {
    popularIssues: data,
    popularIssuesRefetch: refetch,
  };
};

/**
 * 이슈 노선별 조회 훅
 */
export const useGetNotiHistoriesQuery = () => {
  const { data, refetch, fetchNextPage, hasNextPage, isLoading, isError } = useInfiniteQuery(
    'getNotiHistoryFetch',
    ({ pageParam = 0 }) => getNotiHistoryFetch(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.content && lastPage?.content.length < 15) return undefined;
        return allPages.length;
      },
    },
  );
  return { data, refetch, fetchNextPage, hasNextPage, isLoading, isError };
};
