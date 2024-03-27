import {
  changeNicknameFetch,
  changePasswordFetch,
  checkPasswordFetch,
  deleteAccountFetch,
  getPopularIssuesFetch,
  getSavedRoutesFetch,
  getSearchRoutesFetch,
  saveMyRoutesFetch,
  searchStationName,
} from './func';
import { useMutation, useQuery } from 'react-query';
import {
  searchAddHistoryFetch,
  searchHistoryFetch,
  searchPathDeleteFetch,
  searchPathSaveFetch,
  searchPathsFetch,
  getAllIssuesFetch,
  getIssuesByLaneFetch,
} from '@/global/apis/func';
import { AllIssues, IssueContent, RawSubwayLineName, SubwayStrEnd } from './entity';
import { AxiosError } from 'axios';
import { subwayFreshLineName } from '@/global/utils';
import { useAppSelect } from '@/store';

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

  return {
    searchResultData: freshData.sort((a, b) => a.stationName.localeCompare(b.stationName)),
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
  return { historyData: freshData ? subwayFreshLineName(freshData) : [] };
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
  const { data } = useQuery(['search_paths', params], () => searchPathsFetch(params), {
    enabled,
  });
  return { data };
};

/**
 * 지하철 경로 저장 훅
 */
export const useSavedSubwayRoute = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: AxiosError) => void;
}) => {
  const { data, mutate } = useMutation(searchPathSaveFetch, {
    onSuccess,
    onError,
  });

  return { data, mutate };
};

/**
 * 저장한 지하철 경로 삭제 훅
 */
export const useDeleteSavedSubwayRoute = ({ onSuccess }: { onSuccess: () => void }) => {
  const { data, mutate } = useMutation(searchPathDeleteFetch, {
    onSuccess,
  });

  return { data, deleteMutate: mutate };
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
 * 회원 탈퇴 훅
 */
export const useDeleteAccountMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  const { mutate: deleteAccountMutate } = useMutation(deleteAccountFetch, { onSuccess, onError });
  return { deleteAccountMutate };
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
  const { data } = useQuery(['getRoads'], getSavedRoutesFetch, {
    enabled: isVerifiedUser === 'success auth',
  });
  return { data };
};

/**
 * 내 경로 저장 훅
 */
export const useSaveMyRoutesQuery = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError?: (error: any) => void;
}) => {
  const { data, mutate } = useMutation(saveMyRoutesFetch, {
    onSuccess,
    onError,
  });
  return { data, mutate };
};

/**
 * 닉네임 변경 훅
 */
export const useChangeNicknameQuery = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError?: (error: any) => void;
}) => {
  const { data, mutate } = useMutation(changeNicknameFetch, {
    onSuccess,
    onError,
  });
  return { data, mutate };
};

/**
 * 비밀번호 확인 훅
 */
export const useCheckPasswordQuery = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError?: (error: any) => void;
}) => {
  const { mutate: checkPasswordMutate } = useMutation(checkPasswordFetch, {
    onSuccess,
    onError,
  });
  return { checkPasswordMutate };
};

/**
 * 비밀번호 변경 훅
 */
export const useChangePasswordQuery = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError?: (error: any) => void;
}) => {
  const { mutate: changePasswordMutate } = useMutation(changePasswordFetch, {
    onSuccess,
    onError,
  });
  return { changePasswordMutate };
};

/**
 * 이슈 전체 조회 훅
 */
export const useGetAllIssuesQuery = (
  page: number,
  {
    onSuccess,
    onError,
  }: {
    onSuccess: (data: AllIssues) => void;
    onError: (error: AxiosError) => void;
  },
) => {
  const { data, refetch } = useQuery(['getAllIssues', page], () => getAllIssuesFetch({ page }), {
    onSuccess,
    onError,
  });
  return { allIssues: data, allIssuesRefetch: refetch };
};

/**
 * 이슈 노선별 조회 훅
 */
export const useGetIssuesByLaneQuery = (
  page: number,
  line: string,
  {
    onSuccess,
    onError,
  }: {
    onSuccess: (data: AllIssues) => void;
    onError: (error: AxiosError) => void;
  },
) => {
  const { data, refetch } = useQuery(
    ['getIssuesByLane', page, line],
    () => getIssuesByLaneFetch({ page, line }),
    { onSuccess, onError },
  );
  return { laneIssues: data, laneIssuesRefetch: refetch };
};

/**
 * 이슈 추천순 조회 훅
 */
export const useGetPopularIssuesQuery = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: IssueContent[]) => void;
  onError: (error: AxiosError) => void;
}) => {
  const { data, refetch } = useQuery(['getPopularIssues'], getPopularIssuesFetch, {
    onSuccess,
    onError,
  });
  return { popularIssues: data, popularIssuesRefetch: refetch };
};
