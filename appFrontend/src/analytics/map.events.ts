import { RawSubwayLineName } from '@/global/apis/entity';
import { MAP } from '@/global/constants';
import * as Amplitude from '@amplitude/analytics-react-native';

type Station = {
  station: string;
  line: string | null;
};

type DepArr = {
  station_departure: string;
  station_arrival: string;
  line_departure: RawSubwayLineName;
  line_arrival: RawSubwayLineName;
};

type DepArrName = { name: string } & DepArr;

type AlertInfo = {
  alarm: 'on' | 'off';
  starttime?: string;
  finishtime?: string;
  day?: string;
};

export type DepArrNameAlert = DepArrName & AlertInfo;

// 3-0
/**
 * 홈(지도)탭 누른 경우 (처음 설치나 가입 후 떨어진게 아닌, 실제 유저가 누른 경우)
 */
export const trackHomeTabClick = () => {
  Amplitude.track(MAP.MENU_CLICK);
};

/**
 * 상단에 좌우슬라이드 배너 누른 경우
 */
export const trackMapBannerClick = (title: string) => {
  Amplitude.track(MAP.BANNER_CLICK, { title });
};

// 3-1
/**
 * 출발역 inputbox 터치한 경우
 * 최초 출발,도착 모두 선택완료한 후 > 페이지 넘어가서 거기서 다시 누른 경우도 포함 (도착역도 동일)
 */
export const trackMapSearchDepartureClick = () => {
  Amplitude.track(MAP.SEARCH_DEPARTURE_CLICK);
};

/**
 * 출발역 클릭하고 > 지하철명 입력한다음 > 검색된 지하철중에서 최종 선택해서 해당 역이 바인딩 된 경우
 */
export const trackMapSearchDepartureChoice = (data: Station) => {
  Amplitude.track(MAP.SEARCH_DEPARTURE_CHOICE, data);
};

/**
 * 도착역 inputbox 터치한 경우
 */
export const trackMapSearchArrivalClick = () => {
  Amplitude.track(MAP.SEARCH_ARRIVAL_CLICK);
};

/**
 * 도착역 최종 선택해서 바인딩된 경우
 */
export const trackMapSearchArrivalChoice = (data: Station) => {
  Amplitude.track(MAP.SEARCH_ARRIVAL_CHOICE, data);
};

/**
 * 홈에서 출발역 도착역 선택 후에 이슈있는거 눌러서 확인한 경우
 * (역표시된거 하단에 "6/28(토) 집회 및 행진안내" 여기 영역누른 경우)
 */
export const trackMapSearchIssueCheck = (data: DepArr) => {
  Amplitude.track(MAP.SEARCH_ISSUE_CHECK, data);
};

/**
 * 검색 완료 후 우측상단에 "북마크"눌러서 > 경로이름 입력하는 팝업 띄워진 경우
 */
export const trackMapSearchBookmarkName = (data: DepArr) => {
  Amplitude.track(MAP.SEARCH_BOOKMARK_1_NAME, data);
};

/**
 * 최종 등록되고 > 추가설정 페이지로 넘어간 경우
 */
export const trackMapSearchBookmarkFinish = (data: DepArrName) => {
  Amplitude.track(MAP.SEARCH_BOOKMARK_2_FINISH, data);
};

/**
 * 추가설정(알람 온오프, 스타트타임 등)까지 완료 한경우
 */
export const trackMapSearchBookmarkSetting = (data: DepArrNameAlert) => {
  Amplitude.track(MAP.SEARCH_BOOKMARK_3_SETTING, data);
};

// 3-2
/**
 * "메인에서 ""내가 저장한 경로"" 우측에 ""저장경로 편집"" 버튼 누른 경우
 * 마이페이지 ""알림설정""에서 ""내 경로 저장하고 알림받기""누른 경우도 포함"
 */
export const trackMapBookmark1 = () => {
  Amplitude.track(MAP.BOOKMARK_1);
};

/**
 * 저장경로 편집 페이지에서 "경로 추가하기"버튼 누른 경우
 */
export const trackMapBookmark2 = () => {
  Amplitude.track(MAP.BOOKMARK_2);
};

/**
 * 출발역 inputbox 터치한 경우
 * 해당 페이지에서 다시 출발역 누른경우도 포함
 */
export const trackMapBookmark3DepartureClick = () => {
  Amplitude.track(MAP.BOOKMARK_3_DEPARTURE_CLICK);
};

/**
 * 출발역 클릭하고 > 지하철명 입력한다음 > 검색된 지하철중에서 최종 선택해서 해당 역이 바인딩 된 경우
 */
export const trackMapBookmark3DepartureChoice = (data: Station) => {
  Amplitude.track(MAP.BOOKMARK_3_DEPARTURE_CHOICE, data);
};

/**
 * 도착역 inputbox 터치한 경우
 * 해당 페이지에서 다시 출발역 누른경우도 포함
 */
export const trackMapBookmark3ArrivalClick = () => {
  Amplitude.track(MAP.BOOKMARK_3_ARRIVAL_CLICK);
};

/**
 * 도착역 최종 선택해서 바인딩된 경우
 */
export const trackMapBookmark3ArrivalChoice = (data: Station) => {
  Amplitude.track(MAP.BOOKMARK_3_ARRIVAL_CHOICE, data);
};

/**
 * 출발,도착역 입력하고 나온 경로에서 우측 라디오버튼 누른 경우
 */
export const trackMapBookmark3Choice = (data: DepArr) => {
  Amplitude.track(MAP.BOOKMARK_3_CHOICE, data);
};

/**
 * 경로이름 입력하는 페이지 진입한 경우
 */
export const trackMapBookmark4Name = (data: DepArr) => {
  Amplitude.track(MAP.BOOKMARK_4_NAME, data);
};

/**
 * 최종 등록되고 > 추가설정 페이지로 넘어간 경우
 */
export const trackMapBookmark5Finish = (data: DepArrName) => {
  Amplitude.track(MAP.BOOKMARK_5_FINISH, data);
};

/**
 * 추가설정(알람 온오프, 스타트타임 등)까지 완료 한경우
 */
export const trackMapBookmark6Setting = (data: DepArrNameAlert) => {
  Amplitude.track(MAP.BOOKMARK_6_SETTING, data);
};

/**
 * 저장한 경로 삭제 완료한 경우
 * 1)저장경로 편집에서 삭제했거나
 * 2)해당 경로 누르고 > 북마크 해제해서 삭제했거나
 * 어디서 했든 저장경로 삭제한 경우
 */
export const trackMapBookmarkDelete = (data: DepArr) => {
  Amplitude.track(MAP.BOOKMARK_DELETE, data);
};

/**
 * 내 저장경로 목록에서 이슈배너 눌러서 확인한 경우
 */
export const trackMapBookmarkIssueCheck = (data: DepArr) => {
  Amplitude.track(MAP.BOOKMARK_ISSUE_CHECK, data);
};
