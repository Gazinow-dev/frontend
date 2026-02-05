import { Pagination } from '@/global/apis/entity';

/**
 * 로그아웃
 */
export interface LogoutFetchData {
  accessToken: string;
  refreshToken: string;
}

/**
 * 알림 수신 동의 토글 on/off req값
 */
export interface SetNotiOnOffType {
  email: string;
  alertAgree: boolean;
}

/**
 * 알림 활성화
 */
export interface NotiSettingsType {
  myPathId: number;
  dayTimeRanges: {
    day: string;
    fromTime: string;
    toTime: string;
  }[];
}

/**
 * 경로별 알림 설정 불러오기 res값
 */
export interface PathNotiSettingsResType {
  enabled: boolean;
  myFindRoadPathId: number;
  notificationTimes: {
    dayOfWeek: '월' | '화' | '수' | '목' | '금' | '토' | '일';
    fromTime: string;
    toTime: string;
  }[];
}

/**
 * 앱 업데이트 공지 타입
 */
export type NoticeType = {
  noticeId: number;
  noticeTitle: string;
  noticeContent: string;
  createdAt: Date;
  modifiedAt: string;
};

/**
 * 페이징된 앱 업데이트 공지 목록 타입
 */
export type AllNoticesType = Pagination<NoticeType>;
