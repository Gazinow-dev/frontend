import { AxiosError } from 'axios';
import { authServiceAPI, publicServiceAPI } from '.';
import {
  AllIssues,
  MyRoutesType,
  SearchHistoryStationNameTypes,
  SearchPathsTypes,
  SearchStationNameTypes,
  RawSubwayLineName,
  SubwayStrEnd,
  IssueGet,
  SaveMyRoutesType,
  NotiHistories,
} from './entity';
import { SignInFetchResponse } from '@/screens/signInScreen/apis/entity';
import * as Sentry from '@sentry/react-native';

/**
 * 인증 토큰 재인증 axios
 */
export const tokenReissueFetch = async (body: {
  accessToken: string;
  refreshToken: string;
  firebaseToken?: string;
}) => {
  try {
    const res = await publicServiceAPI.post<{ data: SignInFetchResponse }>(
      '/api/v1/member/reissue',
      body,
    );
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
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
    const error = err as AxiosError;
    Sentry.captureException({
      target: '지하철역 검색',
      input: { params, request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
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
    const error = err as AxiosError;
    Sentry.captureException({
      target: '지하철역 히스토리 조회',
      input: { request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
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
    const error = err as AxiosError;
    Sentry.captureException({
      target: '지하철역 히스토리 저장',
      input: { data, request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
  }
};

/**
 * 지하철 경로 검색 조회 axios
 */
export const searchPathsFetch = async ({
  params,
  isVerifiedUser,
}: {
  params: SubwayStrEnd;
  isVerifiedUser: 'success auth' | 'fail auth' | 'yet';
}) => {
  try {
    if (isVerifiedUser === 'success auth') {
      const res = await authServiceAPI.get<{ data: SearchPathsTypes }>('/api/v1/find_road', {
        params,
      });
      return res.data.data;
    } else {
      const res = await publicServiceAPI.get<{ data: SearchPathsTypes }>('/api/v1/find_road', {
        params,
      });
      return res.data.data;
    }
  } catch (err) {
    const error = err as AxiosError;
    Sentry.captureException({
      target: '지하철 경로 검색 조회',
      input: { params, isVerifiedUser, request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
  }
};

/**
 * 지하철 경로 저장 axios
 */
export const searchPathSaveFetch = async (data: SaveMyRoutesType) => {
  try {
    const res = await authServiceAPI.post('/api/v1/my_find_road/add_route', data);
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    Sentry.captureException({
      target: '지하철 경로 저장',
      input: { data, request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
  }
};

/**
 * 저장된 지하철 경로 삭제 axios
 */
export const myPathDeleteFetch = async (params: { id: number }) => {
  try {
    const res = await authServiceAPI.delete('/api/v1/my_find_road/delete_route', { params });
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    Sentry.captureException({
      target: '저장된 지하철 경로 삭제',
      input: { params, request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
  }
};

/**
 * 지하철 경로 히스토리 조회 axios
 */
export const getSearchRoutesFetch = async () => {
  try {
    const res = await authServiceAPI.get(`/api/v1/recentSearch`);
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 저장된 지하철 경로 조회 axios
 */
export const getSavedRoutesFetch = async () => {
  try {
    const res = await authServiceAPI.get<{ data: MyRoutesType[] }>(
      `/api/v1/my_find_road/get_roads`,
    );
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    Sentry.captureException({
      target: '저장된 지하철 경로 조회',
      input: { request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
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
    const error = err as AxiosError;
    Sentry.captureException({
      target: '전체 이슈 조회',
      input: { request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
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
    const error = err as AxiosError;
    Sentry.captureException({
      target: '노선별 이슈 조회',
      input: { request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
  }
};

/**
 * now탭 인기 이슈 조회 axios
 */
export const getPopularIssuesFetch = async () => {
  try {
    const res = await publicServiceAPI.get<{ data: IssueGet[] }>(`/api/v1/issue/get_popular`);
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    Sentry.captureException({
      target: 'now탭 인기 이슈 조회',
      input: { request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
  }
};

/**
 * 홈화면 캐러셀 인기 이슈 조회 axios
 */
export const getPopularIssuesAtMainFetch = async () => {
  try {
    const res = await publicServiceAPI.get<{ data: IssueGet[] }>(`/api/v1/issue/main-carousel`);
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    Sentry.captureException({
      target: '홈화면 캐러셀 인기 이슈 조회',
      input: { request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
  }
};

/**
 * 알림 히스토리 조회 axios
 */
export const getNotiHistoryFetch = async (page: number) => {
  try {
    const res = await authServiceAPI.get<{ data: NotiHistories }>(`/api/v1/notification`, {
      params: { page },
    });
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    Sentry.captureException({
      target: '알림 히스토리 조회',
      input: { request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
  }
};

/**
 * 알림 읽음 처리 axios
 */
export const updateNotiReadStatus = async (notificationId: number) => {
  try {
    const res = await authServiceAPI.patch(`/api/v1/notification/${notificationId}/read`);
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    Sentry.captureException({
      target: '알림 읽음 처리',
      input: { request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
  }
};

/**
 * 안 읽은 알림 수 조회 axios
 */
export const getUnreadNotiCount = async () => {
  try {
    const res = await authServiceAPI.get<{ data: { unreadNotificationCount: number } }>(
      `/api/v1/notification/count`,
    );
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    Sentry.captureException({
      target: '안 읽은 알림 수 조회',
      input: { request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
  }
};
