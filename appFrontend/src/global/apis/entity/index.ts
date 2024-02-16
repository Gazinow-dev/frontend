/**
 * 지하철 호선 이름
 */
export type SubwayLine =
  | '1호선'
  | '2호선'
  | '3호선'
  | '4호선'
  | '5호선'
  | '6호선'
  | '7호선'
  | '8호선'
  | '9호선'
  | '공항철도'
  | '경의중앙선'
  | '경춘선'
  | '수인분당선'
  | '신분당선'
  | '경강선'
  | '서해선'
  | '인천선'
  | '인천2호선'
  | '용인경전철'
  | '의정부경전철'
  | '우이신설경전철'
  | '김포도시철도'
  // API 요청 시 호선 이름 원상복귀 위한 type
  | '인천1' // 인천선의 프레쉬한 이름
  | '인천2' // 인천2호선의 프레쉬한 이름
  | '애버라인' // 애버라인의 프레쉬한 이름
  | '우이신설' // 우이신설의 프레쉬한 이름
  | '김포골드' // 김포골드의 프레쉬한 이름
  | null;

/**
 * 지하철 검색 이력 타입
 */
export interface SearchHistoryStationNameTypes {
  id: number;
  stationName: string;
  stationLine: SubwayLine;
}

/**
 * 지하철 검색 타입
 */
export interface SearchStationNameTypes {
  data: {
    name: string;
    line: SubwayLine;
  }[];
}

/**
 * 지하철 경로 데이터 api 응답
 */
export interface SearchPathsTypes {
  paths: Path[];
}

/**
 * 지하철 경로 데이터
 */
export interface Path {
  totalTime: number;
  subwayTransitCount: number;
  firstStartStation: string;
  lastEndStation: string;
  subPaths: SubPath[];
  myPath: boolean;
  myPathId: [number] | null;
}

/**
 * 지하철호선 코드
 *
 * @param oneToNine 1호선부터 9호선
 * @param n21 인천 1호선
 * @param n22 인천 2호선
 * @param n101 수도권 공항철도
 * @param n104 경의선
 * @param n107 용인 경전철(수도권 에버라인)
 * @param n108 경춘선
 * @param n109 신분당선
 * @param n110 수도권 의정부경전철
 * @param n112 경강선
 * @param n113 수도권 우이신설경전철
 * @param n114 서해선
 * @param n115 김포도시철도
 * @param n116 수인분당선
 * @param n117 신림선
 */
export type StationCode =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 21
  | 22
  | 101
  | 104
  | 107
  | 108
  | 109
  | 110
  | 112
  | 113
  | 114
  | 115
  | 116
  | 117;

/**
 * 지하철 경로 호선 데이터
 */
export interface Lane {
  name: string;
  stationCode: StationCode;
  startName: string;
  endName: string;
}

/**
 * 지하철 경로 정보 데이터
 */
export interface SubPath {
  trafficType: number;
  distance: number;
  sectionTime: number;
  stationCount: number;
  way: string; // 지하철 운행 방향
  door: string; // 빠른환승
  lanes: Lane[];
  stations: {
    index: number;
    stationName: string;
  }[];
}

export interface SubwayStrEnd {
  strStationName: string;
  strStationLine: SubwayLine;
  endStationName: string;
  endStationLine: SubwayLine;
}

export interface SavedRoute extends Path {
  roadName: string;
}

export interface RenderSavedRoutesType extends Path {
  issues: string; //FIXME: 백엔드에 물어볼 것
  roadName: string;
  id: number;
}

export interface IssueContent {
  id: number;
  title: string;
  content: string;
  date: string;
  line: string;
  startDate: string;
  expireDate: string;
  type: string;
}

export interface CombinedData {
  id?: number;
  title?: string;
  content?: string;
  date?: string;
  line?: string;
  startDate?: string;
  expireDate?: string;
  type: string;
}

export interface AllIssues {
  content: IssueContent[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
