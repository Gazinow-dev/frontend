import { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { IconValid, IconCross, IconInvalid, IconCrossCircle } from '@/assets/icons';
import { useAppDispatch } from '@/store';
import { saveUserInfo } from '@/store/modules';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import { showToast } from '@/global/utils/toast';
import { useChangeNicknameMutation, useCheckNicknameMutation } from '../apis/hooks';
import { debounce } from 'lodash';
import cn from 'classname';
import { AxiosError } from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChangeNickNameScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const { email } = useSelector((state: RootState) => state.auth);
  const [newNickname, setNewNickname] = useState<string>('');
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const dispatch = useAppDispatch();

  const { changeNicknameMutate } = useChangeNicknameMutation({
    onSuccess: () => {
      myPageNavigation.goBack();
      dispatch(saveUserInfo({ email: email, nickname: newNickname }));
      showToast('nickNameChanged');
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 422) showToast('postFailureByForbiddenWord');
      setIsNicknameValid(false);
      setErrorMessage(getErrorMessage(error.response?.status));
    },
  });

  const { checkNicknameMutate } = useCheckNicknameMutation({
    onSuccess: () => {
      setIsNicknameValid(true);
    },
    onError: (error: AxiosError) => {
      setIsNicknameValid(false);
      setErrorMessage(getErrorMessage(error.response?.status));
    },
  });

  const checkNicknameDebounce = useCallback(
    debounce((nickname: string) => {
      checkNicknameMutate(nickname);
    }, 500),
    [],
  );

  const handleNicknameChange = (nickname: string) => {
    if (nickname.length > 7 && nickname.length < 1) return;
    setNewNickname(nickname);
    checkNicknameDebounce(nickname);
  };

  const handleDelete = () => {
    setNewNickname('');
    setIsNicknameValid(null);
  };

  const getErrorMessage = (status: number | undefined) => {
    switch (status) {
      case 409:
        return '중복된 닉네임입니다.';
      case 404:
        return '회원이 존재하지 않습니다. 다시 로그인해주세요.';
      case 400:
        return '7글자 이하의 한글, 알파벳, 숫자를 입력해주세요.\n한글 자모음 단독, 공백 입력 불가';
      case 422:
        return '사용할 수 없는 단어가 포함되어 있습니다.';
      default:
        return '닉네임 변경에 실패하였습니다. 다시 시도해주세요.';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-16">
        <TouchableOpacity hitSlop={20} onPress={() => myPageNavigation.goBack()}>
          <IconCross className="mr-12" />
        </TouchableOpacity>
        <FontText text="닉네임 수정" className="text-18 leading-23" fontWeight="500" />
        <View className="flex-1" />
        <TouchableOpacity
          onPress={() => changeNicknameMutate(newNickname)}
          disabled={!isNicknameValid}
          hitSlop={20}
        >
          <FontText
            text="완료"
            className={cn('leading-21', {
              'text-gray-999': !isNicknameValid,
            })}
            fontWeight="600"
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 bg-gray-9f9 px-16">
        <View className="mb-8 mt-34 flex-row items-center rounded-5 border-1 border-[#d4d4d4] bg-white px-16 py-8">
          <Input
            className="h-36 flex-1"
            value={newNickname}
            placeholder={`새 닉네임을 입력하세요`}
            placeholderTextColor={COLOR.GRAY_999}
            inputMode="search"
            onChangeText={(text) => handleNicknameChange(text)}
            autoFocus
          />
          <TouchableOpacity onPress={handleDelete} hitSlop={20}>
            <IconCrossCircle width={19.5} />
          </TouchableOpacity>
        </View>

        {isNicknameValid !== null && newNickname !== '' && (
          <View className="flex-row pl-9">
            {isNicknameValid ? (
              <IconValid color={COLOR.LIGHT_GREEN} className="mr-4" />
            ) : (
              <IconInvalid className="mr-4" />
            )}
            <FontText
              text={isNicknameValid ? '사용 가능한 닉네임입니다' : errorMessage}
              className={cn('text-14 leading-16', {
                'text-light-green': isNicknameValid,
                'text-light-red': !isNicknameValid,
              })}
              fontWeight="500"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default ChangeNickNameScreen;
