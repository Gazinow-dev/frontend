import { authServiceAPI } from '@/global/apis';
import { AxiosError } from 'axios';
import {
  LogoutFetchData,
  NotiSettingsType,
  PathNotiSettingsResType,
  SetNotiOnOffType,
} from './entity';
import * as Sentry from '@sentry/react-native';

/**
 * 로그아웃 요청 axios
 */
export const logoutFetch = async ({ accessToken, refreshToken }: LogoutFetchData) => {
  try {
    await authServiceAPI.post('/api/v1/member/logout', { accessToken, refreshToken });
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 회원 탈퇴 axios
 */
export const deleteAccountFetch = async () => {
  try {
    await authServiceAPI.delete('/api/v1/member/delete_member', { data: {} });
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 비밀번호 확인 axios
 */
export const checkPasswordFetch = async (passwordInput: string) => {
  try {
    await authServiceAPI.post(`/api/v1/member/check_password`, {
      checkPassword: passwordInput,
    });
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 비밀번호 변경 axios
 */
export const changePasswordFetch = async (data: {
  curPassword: string;
  changePassword: string;
  confirmPassword: string;
}) => {
  try {
    const res = await authServiceAPI.post(`/api/v1/member/change_password`, data);
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 닉네임 변경 axios
 */
export const changeNicknameFetch = async (nickname: string) => {
  try {
    await authServiceAPI.post(`/api/v1/member/change_nickname`, { nickname });
  } catch (err) {
    const error = err as AxiosError;
    Sentry.captureException({
      target: '닉네임 변경',
      input: { nickname, request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
  }
};

/**
 * 닉네임 중복 검사 axios
 */
export const checkNicknameFetch = async (nickName: string) => {
  try {
    await authServiceAPI.post(`/api/v1/member/check-nickname`, { nickName });
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 푸시 알림 on/off 설정 axios
 */
export const setPushNotiOnFetch = async ({ email, alertAgree }: SetNotiOnOffType) => {
  try {
    await authServiceAPI.post('/api/v1/member/notifications/push', { email, alertAgree });
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 푸시 알림 on/off 조회 axios
 */
export const getPushNotiOnStatusFetch = async (email: string) => {
  try {
    const res = await authServiceAPI.get<{ data: { alertAgree: boolean } }>(
      `/api/v1/member/notifications/push/status?email=${email}`,
    );
    return res.data.data.alertAgree;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 경로 상세 설정 알림 on/off 설정 axios
 */
export const setDetailPushNotiOnFetch = async ({ email, alertAgree }: SetNotiOnOffType) => {
  try {
    await authServiceAPI.post('/api/v1/member/notifications/my-saved-route', { email, alertAgree });
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 경로 상세 설정 알림 on/off 조회 axios
 */
export const getDetailPushNotiOnStatusFetch = async (email: string) => {
  try {
    const res = await authServiceAPI.get<{ data: { alertAgree: boolean } }>(
      `/api/v1/member/notifications/my-saved-route/status?email=${email}`,
    );
    return res.data.data.alertAgree;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 알림 비활성화 axios
 */
export const disablePathNotiFetch = async (id: number) => {
  try {
    await authServiceAPI.post(`/api/v1/notification/disable?id=${id}`);
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 알림 설정 등록 axios
 */
export const addPathNotiSettingsFetch = async (notiSettings: NotiSettingsType) => {
  try {
    await authServiceAPI.post(`/api/v1/notification/enable`, notiSettings);
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 알림 설정 수정 axios
 */
export const updatePathNotiSettingsFetch = async (notiSettings: NotiSettingsType) => {
  try {
    await authServiceAPI.post(`/api/v1/notification/update`, notiSettings);
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 경로별 알림 설정 불러오기 axios
 */
export const getPathNotiFetch = async (myPathId: number) => {
  try {
    const res = await authServiceAPI.get<{ data: PathNotiSettingsResType }>(
      `/api/v1/notification/settings?myPathId=${myPathId}`,
    );
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};
