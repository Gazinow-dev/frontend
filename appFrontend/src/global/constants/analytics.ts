export const AUTH = {
  LOGIN: '[1]로그인 완료',
  LOGOUT: '[1]로그아웃',
} as const;

export const REGISTER = {
  START: '[2]회원가입_1_진입',
  AUTH_SEND: '[2]회원가입_2_인증번호 발송완료',
  AUTH_FINISH: '[2]회원가입_2_인증번호 최종완료',
  PASSWORD: '[2]회원가입_3_비밀번호 입력완료',
  TERMS: '[2]회원가입_4_약관동의완료',
  FINISH: '[2]회원가입_5_닉네임_최종완료',
} as const;

export const MAP = {
  MENU_CLICK: '[3-0]맵_메뉴클릭',
  BANNER_CLICK: '[3-0]맵_배너클릭',

  SEARCH_DEPARTURE_CLICK: '[3-1]맵_검색_출발역_클릭',
  SEARCH_DEPARTURE_CHOICE: '[3-1]맵_검색_출발역_선택완료',
  SEARCH_ARRIVAL_CLICK: '[3-1]맵_검색_도착역_클릭',
  SEARCH_ARRIVAL_CHOICE: '[3-1]맵_검색_도착역_선택완료',

  SEARCH_ISSUE_CHECK: '[3-1]맵_검색_이슈체크',
  SEARCH_BOOKMARK_1_NAME: '[3-1]맵_검색_북마크_1_경로이름',
  SEARCH_BOOKMARK_2_FINISH: '[3-1]맵_검색_북마크_2_완료',
  SEARCH_BOOKMARK_3_SETTING: '[3-1]맵_검색_북마크_3_추가설정',

  BOOKMARK_1: '[3-2]맵_저장경로_1_편집클릭',
  BOOKMARK_2: '[3-2]맵_저장경로_2_경로추가하기',
  BOOKMARK_3_DEPARTURE_CLICK: '[3-2]맵_저장경로_3_출발역_클릭',
  BOOKMARK_3_DEPARTURE_CHOICE: '[3-2]맵_저장경로_3_출발역_선택완료',
  BOOKMARK_3_ARRIVAL_CLICK: '[3-2]맵_저장경로_3_도착역_클릭',
  BOOKMARK_3_ARRIVAL_CHOICE: '[3-2]맵_저장경로_3_도착역_선택완료',
  BOOKMARK_3_CHOICE: '[3-2]맵_저장경로_3_선택완료',
  BOOKMARK_4_NAME: '[3-2]맵_저장경로_4_경로이름',
  BOOKMARK_5_FINISH: '[3-2]맵_저장경로_5_완료',
  BOOKMARK_6_SETTING: '[3-2]맵_저장경로_6_추가설정',
  BOOKMARK_DELETE: '[3-2]맵_저장경로_삭제',
  BOOKMARK_ISSUE_CHECK: '[3-2]맵_저장경로_이슈체크',
} as const;

export const NOW = {
  NOW_MENU_CLICK: '[4]나우_메뉴클릭',
  NOW_HOTISSUE_CLICK: '[4]나우_지금인기이슈_리스트클릭',
  NOW_HOTISSUE_OPEN: '[4]나우_지금인기이슈_펼쳐보기',
  NOW_TOTALISSUE_LINE: '[4]나우_전체이슈_노선탭클릭',
  NOW_TOTALISSUE_CLICK: '[4]나우_전체이슈_리스트클릭',
  NOW_COMMENTS: '[4]나우_댓글등록완료',
} as const;

export const MY = {
  WITHDRAW: '[5]마이_회원탈퇴',
  NOTI_PUSH_ON: '[5]마이_알림_푸시_켜기',
  NOTI_PUSH_OFF: '[5]마이_알림_푸시_끄기',
  NOTI_BOOKMARK_ON: '[5]마이_알림_저장경로_켜기',
  NOTI_BOOKMARK_OFF: '[5]마이_알림_저장경로_끄기',
} as const;
