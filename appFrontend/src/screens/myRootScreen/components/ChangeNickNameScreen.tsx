import { useCallback, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import IconXCircle from '@assets/icons/x-circle-standard.svg';
import IconCheck from '@assets/icons/check_green.svg';
import IconXCircleFill from '@assets/icons/x_circle_fill.svg';
import IconCrossX from '@assets/icons/cross_x.svg';
import { useAppDispatch } from '@/store';
import { saveUserInfo } from '@/store/modules';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import { showToast } from '@/global/utils/toast';
import { useChangeNicknameMutation, useCheckNicknameMutation } from '../apis/hooks';
import { debounce } from 'lodash';

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
    onError: (error: any) => {
      setIsNicknameValid(false);
      setErrorMessage(getErrorMessage(error.response?.status));
      console.error(error);
    },
  });

  const { checkNicknameMutate } = useCheckNicknameMutation({
    onSuccess: () => {
      setIsNicknameValid(true);
    },
    onError: (error: any) => {
      setIsNicknameValid(false);
      setErrorMessage(getErrorMessage(error.response?.status));
      console.error(error);
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
      default:
        return '닉네임 변경에 실패하였습니다. 다시 시도해주세요.';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-16">
        <TouchableOpacity
          className="flex-row items-center gap-12 py-16 pl-4"
          onPress={() => myPageNavigation.goBack()}
        >
          <IconCrossX width="24px" />
          <FontText value="닉네임 수정" textSize="18px" lineHeight={23} textWeight="Medium" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeNicknameMutate(newNickname)}
          disabled={!isNicknameValid}
          hitSlop={20}
        >
          <FontText
            value="완료"
            textSize="16px"
            textColor={isNicknameValid ? COLOR.BASIC_BLACK : COLOR.GRAY_999}
            textWeight="SemiBold"
            lineHeight={21}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-16 bg-gray-f9">
        <View className="flex-row items-center px-16 py-8 mt-34 mb-8 rounded-5 border-1 border-[#d4d4d4] bg-white">
          <Input
            className="flex-1 h-36"
            value={newNickname}
            placeholder={`새 닉네임을 입력하세요`}
            placeholderTextColor={COLOR.GRAY_999}
            inputMode="search"
            onChangeText={(text) => handleNicknameChange(text)}
            autoFocus
          />
          <TouchableOpacity onPress={handleDelete} hitSlop={20}>
            <IconXCircleFill width={19.5} />
          </TouchableOpacity>
        </View>

        {isNicknameValid !== null && newNickname !== '' && (
          <View className="flex-row gap-5 pl-9">
            {isNicknameValid ? (
              <IconCheck stroke={COLOR.LIGHT_GREEN} />
            ) : (
              <IconXCircle width={14} />
            )}
            <FontText
              value={isNicknameValid ? '사용 가능한 닉네임입니다' : errorMessage}
              textSize="14px"
              textWeight="Medium"
              lineHeight={16}
              textColor={isNicknameValid ? COLOR.LIGHT_GREEN : COLOR.LIGHT_RED}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default ChangeNickNameScreen;
