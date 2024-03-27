import { AxiosError } from 'axios';
import { authServiceAPI, publicServiceAPI } from '.';
import {
  AllIssues,
  RenderSavedRoutesType,
  SavedRoute,
  SearchHistoryStationNameTypes,
  SearchPathsTypes,
  SearchStationNameTypes,
  RawSubwayLineName,
  SubwayStrEnd,
  IssueContent,
} from './entity';
import { SignInFetchResponse } from '@/screens/signInScreen/apis/entity';
import { API_BASE_URL } from '@env';
import * as Sentry from '@sentry/react-native';

/**
 * 인증 토큰 재인증 axios
 */
export const tokenReissueFetch = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  try {
    const res = await authServiceAPI.post<{ data: SignInFetchResponse }>(
      '/api/v1/member/reissue',
      {
        accessToken,
        refreshToken,
      },
      {
        baseURL: API_BASE_URL,
      },
    );
    return res.data.data;
  } catch (err) {
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 지하철역 검색 조회 axios
 */
export const searchStationName = async (params: { stationName: string }) => {
  try {
    const res = await publicServiceAPI.get<SearchStationNameTypes>('/api/v1/search/station', {
      params,
    });
    return res.data.data;
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 지하철역 검색 히스토리 조회 axios
 */
export const searchHistoryFetch = async () => {
  try {
    const res = await authServiceAPI.get<{ data: SearchHistoryStationNameTypes[] }>(
      '/api/v1/recentSearch',
    );
    return res.data.data;
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 지하철역 검색 히스토리 저장 axios
 */
export const searchAddHistoryFetch = async (data: {
  stationName: string;
  stationLine: RawSubwayLineName;
}) => {
  try {
    const res = await authServiceAPI.post<{ data: SearchHistoryStationNameTypes }>(
      '/api/v1/recentSearch/add',
      data,
    );
    return res.data.data;
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 지하철 경로 검색 조회 axios
 */
export const searchPathsFetch = async (params: SubwayStrEnd) => {
  try {
    const res = await publicServiceAPI.get<{ data: SearchPathsTypes }>('/api/v1/find_road', {
      params,
    });
    return res.data.data;
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 지하철 경로 저장 axios
 */
export const searchPathSaveFetch = async (data: SavedRoute) => {
  try {
    const res = await authServiceAPI.post('/api/v1/my_find_road/add_route', data);
    return res.data.data;
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 저장된 지하철 경로 삭제 axios
 */
export const searchPathDeleteFetch = async (params: { id: number | null }) => {
  try {
    const res = await authServiceAPI.delete('/api/v1/my_find_road/delete_route', { params });
    return res.data.data;
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 회원 탈퇴 axios
 */
export const deleteAccountFetch = async () => {
  try {
    await authServiceAPI.delete('/api/v1/member/delete_member', { data: {} });
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 검색한 지하철 경로 조회 axios
 */
export const getSearchRoutesFetch = async () => {
  try {
    // TODO: 기획 최종 나오고 서버 api 개발 된다면 헤더에 토큰유무 필요에 맞는 인스턴스로 교체
    const res = await authServiceAPI.get(`/api/v1/recentSearch`);
    return res.data.data;
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 저장한 지하철 경로 조회 axios
 */
export const getSavedRoutesFetch = async () => {
  try {
    const res = await authServiceAPI.get<{ data: RenderSavedRoutesType[] }>(
      `/api/v1/my_find_road/get_roads`,
    );
    return res.data.data;
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 내 경로 저장 axios
 */
export const saveMyRoutesFetch = async (newRoute: object) => {
  try {
    const res = await authServiceAPI.post('/api/v1/my_find_road/add_route', newRoute);
    return res;
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 닉네임 변경 axios
 */
export const changeNicknameFetch = async (newNickname: string) => {
  try {
    await authServiceAPI.post(`/api/v1/member/change_nickname`, {
      nickName: newNickname,
    });
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 비밀번호 확인 axios
 */
export const checkPasswordFetch = async (passwordInput: string) => {
  try {
    const res = await publicServiceAPI.post(`/api/v1/member/check_password`, {
      checkPassword: passwordInput,
    });
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 비밀번호 변경 axios
 */
export const changePasswordFetch = async (data: object) => {
  try {
    const res = await authServiceAPI.post(`/api/v1/member/change_password`, data);
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 이슈 전체 조회 axios
 */
export const getAllIssuesFetch = async (params: { page: number }) => {
  try {
    const res = await publicServiceAPI.get<{ data: AllIssues }>(`/api/v1/issue/get_all`, {
      params,
    });
    return res.data.data;
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 이슈 노선별 조회 axios
 */
export const getIssuesByLaneFetch = async (params: { page: number; line: string }) => {
  try {
    const res = await publicServiceAPI.get<{ data: AllIssues }>('/api/v1/issue/get_line', {
      params,
    });
    return res.data.data;
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};

/**
 * 이슈 추천순 조회 axios
 */
export const getPopularIssuesFetch = async () => {
  try {
    const res = await publicServiceAPI.get<{ data: IssueContent[] }>(`/api/v1/issue/get_popular`);
    return res.data.data;
  } catch (err) {
    Sentry.captureException(err);
    const er = err as AxiosError;
    throw er;
  }
};
