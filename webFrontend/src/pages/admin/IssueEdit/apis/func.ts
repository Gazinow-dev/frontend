import GaziAPI from "@global/apis";
import apiUrls from "@global/apis/url";
import { AxiosError } from "axios";
import { EditIssueBody, GetStationsByLineType } from "./entity";
import { RawSubwayLineName } from "@global/apis/entity";

/**
 * 노선별 지하철역 조회
 */
export const getStationsByLine = async ({
  line,
}: {
  line: RawSubwayLineName;
}) => {
  try {
    const res = await GaziAPI.get<GetStationsByLineType[]>(
      `${apiUrls.get_stations_by_line}?line=${line}`
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

/**
 * 이슈 상세 수정
 */
export const editIssue = async ({ data }: { data: EditIssueBody }) => {
  try {
    const res = await GaziAPI.patch(apiUrls.editIssue, data);
    return res;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};
