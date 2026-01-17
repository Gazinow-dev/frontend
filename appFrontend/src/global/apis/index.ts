import { API_BASE_URL } from '@env';
import axios, { AxiosError } from 'axios';

import { getEncryptedStorage, setEncryptedStorage } from '@/global/utils';
import EncryptedStorage from 'react-native-encrypted-storage';
import { store } from '@/store';
import { getAuthorizationState } from '@/store/modules';
import { navigationRef } from '@/App';

const navigateReset = (name: 'MainBottomTab') => {
  if (navigationRef.isReady()) {
    navigationRef.reset({ routes: [{ name }] });
  }
};

/**
 * 유저 토큰이 불필요한 api instance
 */
export const publicServiceAPI = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * header token 포함하는 instance
 * 닉네임 수정
 * 비밀번호 변경
 * 회원 탈퇴
 * 로그아웃
 * 토큰 재발급
 * 도움돼요 추가,삭제
 * 지하철역 최근검색 조회, 저장
 * 내 저장경로 조회,저장,삭제
 */
export const authServiceAPI = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

authServiceAPI.interceptors.request.use(async (requestConfig) => {
  const token = await getEncryptedStorage('access_token');
  requestConfig.headers.Authorization = `Bearer ${token}`;

  return requestConfig;
});

authServiceAPI.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (
      !error.response ||
      error.response.status !== 401 ||
      error.response.config.url === '/api/v1/member/reissue' ||
      store.getState().auth.isVerifiedUser === 'fail auth'
    ) {
      throw error;
    }

    const accessToken = await getEncryptedStorage('access_token');
    const refreshToken = await getEncryptedStorage('refresh_token');

    if (!refreshToken) {
      store.dispatch(getAuthorizationState('fail auth'));
      navigateReset('MainBottomTab');
      return error;
    }

    const response = await axios.post(
      'api/v1/member/reissue',
      {
        accessToken,
        refreshToken,
      },
      {
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (response.status === 200) {
      await setEncryptedStorage('access_token', response.data.data.accessToken);
      await setEncryptedStorage('refresh_token', response.data.data.refreshToken);
      // api 재요청
      // return authServiceAPI(error.config || {});
    } else {
      // refresh token is not valid
      await EncryptedStorage.clear();
      store.dispatch(getAuthorizationState('fail auth'));
      navigateReset('MainBottomTab');
      return error;
    }
  },
);
