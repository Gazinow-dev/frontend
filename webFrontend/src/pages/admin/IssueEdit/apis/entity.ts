import { RawSubwayLineName } from "@global/apis/entity";

/**
 * 이슈 수정 req body
 */
export type EditIssueBody = {
  id: number;
  title: string;
  content: string;
  startDate: string;
  expireDate: string;
  keyword: string;
  issueUpdateStationList: [
    {
      line: string;
      startStationCode: number;
      endStationCode: number;
      direction?: string;
    }
  ];
};

/**
 * 지하철 노선별 지하철역 조회
 */
export type GetStationsByLineType = {
  id: number;
  issueStationCode: number;
  lat: number;
  line: string;
  lng: number;
  name: string;
  stationCode: number;
};

/**
 * 이슈 있는 노선과 지하철역 정보
 */
export type IssueLineAndStations = {
  line: RawSubwayLineName;
  startStation: number;
  endStation: number;
};
