import { MY } from '@/global/constants';
import * as Amplitude from '@amplitude/analytics-react-native';

/**
 * 마이탭 클릭
 */
export const trackMyTabClick = () => {
  Amplitude.track(MY.MENU_CLICK);
};

/**
 * 회원탈퇴 완료한 경우
 */
export const trackMyWithdraw = () => {
  Amplitude.track(MY.WITHDRAW);

  setTimeout(() => {
    Amplitude.reset();
  }, 500);
};

/**
 * "푸시 알림 받기" on으로 변경한 경우
 */
export const trackMyNotiPushOn = () => {
  Amplitude.track(MY.NOTI_PUSH_ON);
};

/**
 * "푸시 알림 받기" off으로 변경한 경우
 */
export const trackMyNotiPushOff = () => {
  Amplitude.track(MY.NOTI_PUSH_OFF);
};

/**
 * "내일 이슈 미리 알림" on으로 변경한 경우
 */
export const trackMyNotiTomorrowOn = () => {
  Amplitude.track(MY.NOTI_TOMORROW_ON);
};

/**
 * "내일 이슈 미리 알림" off으로 변경한 경우
 */
export const trackMyNotiTomorrowOff = () => {
  Amplitude.track(MY.NOTI_TOMORROW_OFF);
};

/**
 * "경로별 상세 설정" on으로 변경한 경우
 */
export const trackMyNotiLineOn = () => {
  Amplitude.track(MY.NOTI_LINE_ON);
};

/**
 * "경로별 상세 설정" off으로 변경한 경우
 */
export const trackMyNotiLineOff = () => {
  Amplitude.track(MY.NOTI_LINE_OFF);
};
