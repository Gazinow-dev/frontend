import { publicServiceAPI } from '@/global/apis';
import { AxiosError } from 'axios';
import * as Sentry from '@sentry/react-native';
import { SignUpResponse } from './entity';

/**
 * 이메일 인증 요청 axios
 */
export const emailConfirmFetch = async (email: string) => {
  try {
    const res = await publicServiceAPI.post<{ data: string }>('/api/v1/member/email-confirm', {
      email,
    });
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    Sentry.captureException({
      target: '이메일 인증 요청',
      input: { email, request: error.request },
      output: { status: error.response?.status, error: error.message, response: error.response },
    });
    throw error;
  }
};

/**
 * 닉네임 중복 확인 axios
 */
export const checkNicknameFetch = async (nickname: string) => {
  try {
    const res = await publicServiceAPI.post<{ message: string; state: 200 | 409 }>(
      '/api/v1/member/check-nickname',
      {
        nickname,
      },
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 회원가입 axios
 */
export const signUpFetch = async (data: {
  email: string;
  password: string;
  nickName: string;
  firebaseToken: string;
}) => {
  try {
    const res = await publicServiceAPI.post<{
      data: SignUpResponse;
    }>('/api/v1/member/signup', data);
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};
