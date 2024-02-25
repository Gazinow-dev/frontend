import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { useAppDispatch } from '@/store';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { tokenReissueFetch } from '@/global/apis/func';
import { saveUserInfo } from '@/store/modules';
import { getEncryptedStorage, removeEncryptedStorage, setEncryptedStorage } from '@/global/utils';
import SplashScreenLib from 'react-native-splash-screen';

const SplashScreen = () => {
  const rootNavigation = useRootNavigation();
  const dispatch = useAppDispatch();
  const { mutate } = useMutation(tokenReissueFetch, {
    onSuccess: async (data) => {
      dispatch(saveUserInfo({ nickname: data.nickName, email: data.email }));
      await setEncryptedStorage('access_token', data.accessToken);
      await setEncryptedStorage('refresh_token', data.refreshToken);
      rootNavigation.reset({ routes: [{ name: 'MainBottomTab' }] });

      setTimeout(() => {
        SplashScreenLib.hide();
      }, 2000);
    },
    onError: () => {
      removeEncryptedStorage('access_token');
      removeEncryptedStorage('refresh_token');
      rootNavigation.reset({ routes: [{ name: 'AuthStack' }] });

      setTimeout(() => {
        SplashScreenLib.hide();
      }, 2000);
    },
  });

  const firstAuthorization = async () => {
    const accessToken = await getEncryptedStorage('access_token');
    const refreshToken = await getEncryptedStorage('refresh_token');
    if (!accessToken) {
      rootNavigation.reset({ routes: [{ name: 'AuthStack' }] });
      setTimeout(() => {
        SplashScreenLib.hide();
      }, 2000);
      return;
    } else {
      mutate({
        accessToken,
        refreshToken,
      });
    }
  };

  useEffect(() => {
    firstAuthorization();
  }, []);

  return null;
};

export default SplashScreen;
