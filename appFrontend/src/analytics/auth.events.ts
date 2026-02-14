import { AUTH } from '@/global/constants';
import { SocialLoginTypes } from '@/screens/landingScreen/components/SocialLogin';
import * as Amplitude from '@amplitude/analytics-react-native';

export type AuthType = 'email' | SocialLoginTypes;

type Login = { type: AuthType; userId: number; email: string };

export const trackLogin = ({ type, userId, email }: Login) => {
  if (!userId) return;

  Amplitude.setUserId(`user_${userId}`);

  const identify = new Amplitude.Identify();
  identify.set('email', email);
  Amplitude.identify(identify);

  Amplitude.track(AUTH.LOGIN, { type });
};

export const trackLogout = () => {
  Amplitude.track(AUTH.LOGOUT);

  setTimeout(() => {
    Amplitude.reset();
  }, 500);
};
