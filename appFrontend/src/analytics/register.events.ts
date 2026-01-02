import { REGISTER } from '@/global/constants';
import * as Amplitude from '@amplitude/analytics-react-native';
import { AuthType } from './auth.events';

/**
 * 회원가입 페이지 진입한 경우
 */
export const trackRegisterStart = () => {
  Amplitude.track(REGISTER.START);
};

/**
 * 인증번호 발송 눌러서 > 메일로 받은 인증번호를 입력해주세요 팝업 띄워진 경우
 */
export const trackRegisterAuthSend = () => {
  Amplitude.track(REGISTER.AUTH_SEND);
};

/**
 * 인증번호 입력하고 입력완료 버튼 눌러서 > 팝업 닫히고 비밀번호 생긴 상태
 */
export const trackRegisterAuthFinish = () => {
  Amplitude.track(REGISTER.AUTH_FINISH);
};

/**
 * 비밀번호 입력하고 회원가입 버튼 눌러서 > 약관동의 팝업 띄워진 경우
 */
export const trackRegisterPassword = () => {
  Amplitude.track(REGISTER.PASSWORD);
};

/**
 * 약관 동의하고 완료 버튼 눌러서 > 닉네임 페이지 진입한 경우
 */
export const trackRegisterTerms = () => {
  Amplitude.track(REGISTER.TERMS);
};

/**
 * 닉네임 입력하고 확인 버튼 눌러서 > 최종 가입 완료된 경우
 */
export const trackRegisterFinish = (type: AuthType) => {
  Amplitude.track(REGISTER.FINISH, { type });
};
