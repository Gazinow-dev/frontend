import React, { useState } from 'react';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { getEncryptedStorage, removeEncryptedStorage } from '@/global/utils';
import { FontText, TextButton } from '@/global/ui';
import MyTabModal from '@/global/components/MyTabModal';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import { showToast } from '@/global/utils/toast';
import { useAppDispatch } from '@/store';
import { getAuthorizationState } from '@/store/modules';
import { useLogoutMutation } from '../apis/hooks';

interface RenderMenuProps {
  text: string;
  onPress: () => void;
}

const ManageAccountScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const navigation = useRootNavigation();
  const [popupVisible, setPopupVisible] = useState(false);
  const dispatch = useAppDispatch();

  const { logoutMutate } = useLogoutMutation({
    onSuccess: () => {
      removeEncryptedStorage('access_token');
      removeEncryptedStorage('refresh_token');
      showToast('logout');
      dispatch(getAuthorizationState('fail auth'));
      navigation.goBack();
    },
  });

  const handleConfirm = async () => {
    const accessToken = await getEncryptedStorage('access_token');
    const refreshToken = await getEncryptedStorage('refresh_token');
    logoutMutate({ accessToken, refreshToken });
    setPopupVisible(false);
  };

  const renderMenu = ({ text, onPress }: RenderMenuProps) => (
    <>
      <TouchableOpacity className="flex-row items-center px-16 h-53" onPress={onPress}>
        <TextButton value={text} textSize="16px" textWeight="Regular" onPress={onPress} />
      </TouchableOpacity>
      <View className="h-1 bg-gray-eb" />
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity
        className="flex-row items-center py-16 pl-22 gap-21"
        onPress={() => myPageNavigation.goBack()}
      >
        <IconLeftArrowHead color="#3F3F46" />
        <FontText value="계정 관리" textSize="18px" lineHeight={23} textWeight="Medium" />
      </TouchableOpacity>
      <View className="h-1 bg-gray-eb" />
      {renderMenu({
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
