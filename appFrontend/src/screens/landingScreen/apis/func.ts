import { authServiceAPI } from '@/global/apis';
import { AxiosError } from 'axios';
import { SignInFetchResponse, SocialLoginFormTypes } from './entity';

/**
 * firebaseToken 전송 axios
 */
export const sendFirebaseTokenFetch = async (data: SocialLoginFormTypes) => {
  try {
    const res = await authServiceAPI.post<{ data: SignInFetchResponse }>(
      '/api/v1/member/fcm-token',
      data,
    );
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};
