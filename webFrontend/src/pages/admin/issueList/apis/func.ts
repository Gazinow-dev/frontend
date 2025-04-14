import GaziAPI from "@global/apis";
import { AxiosError } from "axios";
import { AllIssues } from "./entity";

/**
 * 이슈 전체 조회 axios
 */
export const getAllIssuesFetch = async (params: { page: number }) => {
  try {
    const res = await GaziAPI.get<{ data: AllIssues }>(
      `/api/v1/issue/get_all`,
      {
        params,
      }
    );
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};
