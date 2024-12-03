import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useRootNavigation } from '@/navigation/RootNavigation';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import { removeEncryptedStorage } from '@/global/utils';
import { debounce } from 'lodash';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import { showToast } from '@/global/utils/toast';
import { useCheckPasswordMutation, useDeleteAccountMutation } from '../apis/hooks';
import * as Sentry from '@sentry/react-native';
import cn from 'classname';

const ConfirmPwScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const navigation = useRootNavigation();
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [isPwRight, setIsPwRight] = useState<boolean>(false);

  const { deleteAccountMutate } = useDeleteAccountMutation({
    onSuccess: () => {
      Sentry.captureMessage('유저가 탈퇴했어요');
      removeEncryptedStorage('access_token');
      removeEncryptedStorage('refresh_token');
      navigation.reset({ routes: [{ name: 'MainBottomTab' }] });
      showToast('quit');
    },
    onError: () => {
      Alert.alert('회원 탈퇴 오류', '탈퇴에 실패했습니다\n다시 시도해주세요');
    },
  });

  const checkPasswordDebounce = useCallback(
    debounce((curPassword: string) => {
      checkPasswordMutate(curPassword);
    }, 300),
    [],
  );

  const handleCurPasswordChange = (curPassword: string) => {
    setPasswordInput(curPassword);
    checkPasswordDebounce(curPassword);
  };

  const { checkPasswordMutate } = useCheckPasswordMutation({
    onSuccess: () => {
      setIsPwRight(true);
    },
    onError: () => {
      setIsPwRight(false);
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 px-16">
          <TouchableOpacity
            className="flex-row items-center h-56 w-30"
            onPress={() => myPageNavigation.goBack()}
            hitSlop={20}
          >
            <IconLeftArrowHead width={24} color="#3F3F46" />
          </TouchableOpacity>

          <View className="flex-1">
            <View className="pt-43 pb-29">
              <FontText text="비밀번호 입력" className="text-24" fontWeight="600" />
              <View className="h-20" />
              <FontText text="탈퇴를 위해 비밀번호를 입력해주세요." />
            </View>

            <FontText
              text="Password"
              className="text-14 leadinig-21 text-gray-183"
              fontWeight="500"
            />

            <Input
              className="px-16 py-12 my-7 rounded-5 bg-gray-f2"
              placeholder="비밀번호를 입력해주세요"
              value={passwordInput}
              onChangeText={(text) => handleCurPasswordChange(text)}
              inputMode="text"
              placeholderTextColor={COLOR.GRAY_999}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className={cn('py-11 mb-41 rounded-5 items-center', {
              'bg-black-717': isPwRight,
              'bg-gray-ddd': !isPwRight,
            })}
            onPress={() => deleteAccountMutate()}
            disabled={!isPwRight}
          >
            <FontText text="탈퇴하기" className="text-white text-17" fontWeight="600" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default ConfirmPwScreen;
