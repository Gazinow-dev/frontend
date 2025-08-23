import GaziAPI from "@global/apis";
import apiUrls from "@global/apis/url";
import { AxiosError } from "axios";
import * as Sentry from "@sentry/react";

/**
 * 도움돼요 추가
 */
export const postLike = async (issueId: number) => {
  try {
    const res = await GaziAPI.post(`${apiUrls.like}?issueId=${issueId}`);
    return res.data.data;
  } catch (err) {
    Sentry.captureException(err);
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 도움돼요 삭제
 */
export const deletePostLike = async (issueId: number) => {
  try {
    const res = await GaziAPI.delete(`${apiUrls.like}?issueId=${issueId}`);
    return res.data.data;
  } catch (err) {
    Sentry.captureException(err);
    const error = err as AxiosError;
    throw error;
  }
};
