/**
 * 이슈 키워드
 */
export const ISSUE_KEYWORDS = [
  "자연재해",
  "연착",
  "혼잡",
  "행사",
  "사고",
  "공사",
  "시위",
] as const;

/**
 * 이슈 키워드
 */
export type IssueKeywords = (typeof ISSUE_KEYWORDS)[number];

/**
 * 오디세이 기준 지하철 호선 이름
 */
export const STATION_LINE = [
  "경의중앙선",
  "수도권 1호선",
  "수도권 2호선",
  "수도권 3호선",
  "수도권 4호선",
  "수도권 5호선",
  "수도권 6호선",
  "수도권 7호선",
  "수도권 8호선",
  "수도권 9호선",
  "수도권 경강선",
  "수도권 경춘선",
  "수도권 공항철도",
  "수도권 김포골드라인",
  "수도권 서해선(대곡-원시)",
  "수도권 수인.분당선",
  "수도권 신림선",
  "수도권 신분당선",
  "수도권 에버라인",
  "수도권 우이신설경전철",
  "수도권 의정부경전철",
  "인천 1호선",
  "인천 2호선",
] as const;

/**
 * 오디세이 기준 지하철 호선 이름
 */
export type RawSubwayLineName = (typeof STATION_LINE)[number] | null;

/**
 * 상세 이슈 조회 응답
 */
export interface IssueGet {
  id: number;
  title: string;
  content: string;
  agoTime: string;
  lines: RawSubwayLineName[];
  like: boolean;
  likeCount: number;
  keyword: IssueKeywords;
  commentCount: number;
  commentRestricted: boolean;
  /**
   * @format timestamp
   */
  startDate: string;
  /**
   * @format timestamp
   */
  expireDate: string;
  stationDtos: [
    {
      line: RawSubwayLineName;
      stationName: string;
    }
  ];
}

/**
 * 리프레시 토큰 재발급 응답
 */
export interface MemberReissue {
  accessToken: string;
  refreshToken: string;
}

/**
 * 로그인 응답
 */
export interface Login {
  memberId: number;
  nickName: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}
