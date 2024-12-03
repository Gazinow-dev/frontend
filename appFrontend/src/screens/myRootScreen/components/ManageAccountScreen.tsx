import React, { useEffect, useState } from 'react';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { getEncryptedStorage, removeEncryptedStorage } from '@/global/utils';
import { FontText } from '@/global/ui';
import MyTabModal from '@/global/components/MyTabModal';
import { Pressable, SafeAreaView, TouchableOpacity, View } from 'react-native';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import { showToast } from '@/global/utils/toast';
import { useAppDispatch } from '@/store';
import { getAuthorizationState } from '@/store/modules';
import { useLogoutMutation } from '../apis/hooks';
import { COLOR } from '@/global/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RenderMenuProps {
  text: string;
  onPress: () => void;
}

const ManageAccountScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const navigation = useRootNavigation();
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [isSocialLoggedIn, setIsSocialLoggedIn] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkSocialLogin = async () => {
      try {
        const isSocialLoggedIn = await AsyncStorage.getItem('isSocialLoggedIn');
        setIsSocialLoggedIn(isSocialLoggedIn);
      } catch (error) {
        console.error('AsyncStorage 읽기 실패:', error);
      }
    };

    checkSocialLogin();
  }, []);

  const { logoutMutate } = useLogoutMutation({
    onSuccess: async () => {
      await removeEncryptedStorage('access_token');
      await removeEncryptedStorage('refresh_token');
      await AsyncStorage.removeItem('isSocialLoggedIn');
      dispatch(getAuthorizationState('fail auth'));
      navigation.reset({ routes: [{ name: 'MainBottomTab' }] });
      showToast('logout');
    },
  });

  const handleConfirm = async () => {
    const accessToken = await getEncryptedStorage('access_token');
    const refreshToken = await getEncryptedStorage('refresh_token');
    setPopupVisible(false);
    logoutMutate({ accessToken, refreshToken });
  };

  const renderMenu = ({ text, onPress }: RenderMenuProps) => (
    <>
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          height: 53,
        })}
        onPress={onPress}
      >
        <FontText text={text} />
      </Pressable>
      <View className="h-1 bg-gray-beb" />
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center gap-12 p-16">
        <TouchableOpacity onPress={() => myPageNavigation.goBack()} hitSlop={20}>
          <IconLeftArrowHead width={24} color="#3F3F46" />
        </TouchableOpacity>
        <FontText text="계정 관리" className="text-18 leading-23" fontWeight="500" />
      </View>
      <View className="h-1 bg-gray-beb" />
      {isSocialLoggedIn !== 'true' &&
        renderMenu({
          text: '비밀번호 변경',
          onPress: () => myPageNavigation.navigate('ChangePwScreen'),
        })}
      {renderMenu({ text: '로그아웃', onPress: () => setPopupVisible(true) })}
      {renderMenu({
        text: '회원 탈퇴',
        onPress: () => myPageNavigation.navigate('ConfirmQuitScreen'),
      })}
      <MyTabModal
        isVisible={popupVisible}
        onCancel={() => setPopupVisible(false)}
        onConfirm={handleConfirm}
        title="로그아웃 할까요?"
        confirmText="로그아웃"
        cancelText="취소"
      />
    </SafeAreaView>
  );
};
export default ManageAccountScreen;
