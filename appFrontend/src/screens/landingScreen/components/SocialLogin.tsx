import { View, Platform, TouchableOpacity } from 'react-native';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useAppDispatch } from '@/store';
import { getAuthorizationState, saveUserInfo } from '@/store/modules';
import { setEncryptedStorage } from '@/global/utils';
import messaging from '@react-native-firebase/messaging';
import { showToast } from '@/global/utils/toast';
import { sendFirebaseTokenFetch } from '../apis/func';
import { useMutation } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontText } from '@/global/ui';
import { API_BASE_URL } from '@env';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import LoginNaver from '@assets/icons/login_naver.svg';
import LoginApple from '@assets/icons/login_apple.svg';
import LoginGoogle from '@assets/icons/login_google.svg';

import { trackLogin } from '@/analytics/auth.events';
import { trackRegisterFinish } from '@/analytics/register.events';

export type SocialLoginTypes = 'naver' | 'google' | 'apple';

const SocialLogin = () => {
  const navigation = useRootNavigation();
  const dispatch = useAppDispatch();

  const { mutate: sendFirebaseTokenMutate } = useMutation(sendFirebaseTokenFetch, {
    onSuccess: (data, provider) => {
      if (!provider.loginType) return;
      trackLogin({ type: provider.loginType, userId: data.memberId, email: provider.email });
      navigation.reset({ routes: [{ name: 'MainBottomTab' }] });
      showToast('socialLoginSuccess');
      AsyncStorage.setItem('isSocialLoggedIn', 'true');
    },
    onError: () => showToast('socialLoginFailed'),
  });

  // url 파싱 (access token, 이메일, 닉네임 값)
  const parseUrlParams = (url: string): Record<string, string> => {
    const params: Record<string, string> = {};
    const queryString = url.split('?')[1];

    if (queryString) {
      const pairs = queryString.split('&');
      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    }

    return params;
  };

  const onSocialLoginPress = async (socialLoginType: SocialLoginTypes) => {
    const loginUrl = `${API_BASE_URL}/api/v1/oauth/login?socialLoginType=${socialLoginType}`;
    const redirectUrl = 'gazinow://main';

    try {
      const result = await InAppBrowser.openAuth(loginUrl, redirectUrl, {
        ephemeralWebSession: true,
      });

      if (result.type === 'success' && result.url.startsWith(redirectUrl)) {
        const urlParams = parseUrlParams(result.url);

        dispatch(saveUserInfo({ nickname: urlParams.nickName, email: urlParams.email }));
        dispatch(getAuthorizationState('success auth'));

        await setEncryptedStorage('access_token', urlParams.accessToken);
        await setEncryptedStorage('refresh_token', urlParams.refreshToken);

        if (urlParams.socialLoginIsNewMember === 'true') {
          trackRegisterFinish(socialLoginType);
        }

        const firebaseToken = await messaging().getToken();
        sendFirebaseTokenMutate({
          email: urlParams.email,
          firebaseToken,
          loginType: socialLoginType,
        });
      }
    } catch (error) {
      showToast('socialLoginFailed');
    }
  };

  return (
    <View className="mb-20 space-y-12 mx-30">
      <TouchableOpacity
        className="flex-row items-center justify-between rounded-30 bg-[#03C75A] px-19 py-6"
        onPress={() => onSocialLoginPress('naver')}
      >
        <LoginNaver />
        <FontText className="text-white text-14" text="네이버로 계속하기" fontWeight="500" />
        <View className="w-34" />
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center justify-between py-6 bg-white rounded-30 px-19"
        onPress={() => onSocialLoginPress('google')}
      >
        <LoginGoogle />
        <FontText className="text-14" text="구글로 계속하기" fontWeight="500" />
        <View className="w-34" />
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <TouchableOpacity
          className="flex-row items-center justify-between py-6 bg-black rounded-30 px-19"
          onPress={() => onSocialLoginPress('apple')}
        >
          <LoginApple />
          <FontText className="text-white text-14" text="Apple로 계속하기" fontWeight="500" />
          <View className="w-34" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SocialLogin;
