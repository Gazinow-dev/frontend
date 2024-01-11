import axios, { AxiosError } from 'axios';
import { axiosInstance } from '../axiosInstance';
import type { LoginFormTypes, LoginFetchResponse } from '@/types/apis';
import { API_BASE_URL } from '@env';

export const loginFetch = async (data: LoginFormTypes) => {
  try {
    const res = await axiosInstance.post<{ data: LoginFetchResponse }>(
      '/api/v1/member/login',
      data,
    );
    return res.data.data;
  } catch (err) {
    const er = err as AxiosError;
    throw er;
  }
};

export const tokenReissueFetch = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  try {
    const res = await axios.post<{ data: LoginFetchResponse }>(
      '/api/v1/member/reissue',
      {
        accessToken,
        refreshToken,
      },
      {
        baseURL: API_BASE_URL,
      },
    );
    console.log(res);
    return {
      newAccessToken: res.data.data.accessToken,
      newRefreshToken: res.data.data.refreshToken,
    };
  } catch (err) {
    const er = err as AxiosError;
    console.log(er.request);
    throw er;
  }
};
