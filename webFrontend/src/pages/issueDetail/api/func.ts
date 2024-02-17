import GaziAPI from "@global/apis";
import apiUrls from "@global/apis/url";
import { AxiosError } from "axios";
import { IssueGet } from "./entity";

/**
 * 상세 이슈 조회
 */
export const getIssueDetail = async (params: { id: string }) => {
  try {
    const res = await GaziAPI.get<{ data: IssueGet }>(apiUrls.issue_get, {
      params,
    });
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};
