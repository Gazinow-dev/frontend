import styled from '@emotion/native';
import { useState } from 'react';
import { Pressable, SafeAreaView, View } from 'react-native';
import { FontText, Input, Space, TextButton } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useChangeNicknameQuery } from '@/global/apis/hooks';
import IconXCircle from '@assets/icons/x-circle-standard.svg';
import IconXCircleFill from '@assets/icons/x_circle_fill.svg';
import IconCrossX from '@assets/icons/cross_x.svg';
import { useAppDispatch } from '@/store';
import { saveUserInfo } from '@/store/modules';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';

const ChangeNickNameScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const { email } = useSelector((state: RootState) => state.auth);
  const [newNickname, setNewNickname] = useState<string>('');
  const [isNicknameValid, setIsNicknameValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const dispatch = useAppDispatch();

  const { mutate } = useChangeNicknameQuery({
    onSuccess: () => {
      myPageNavigation.goBack();
      dispatch(saveUserInfo({ email: email, nickname: newNickname }));
      //TODO: 성공 토스트 띄우기
    },
    onError: (error: any) => {
      setIsNicknameValid(false);
      setErrorMessage(getErrorMessage(error.response?.status));
      console.error(error);
    },
  });

  const getErrorMessage = (status: number | undefined) => {
    switch (status) {
      case 409:
        return '중복된 닉네임입니다.';
      case 404:
        return '회원이 존재하지 않습니다. 다시 로그인해주세요.';
      case 400:
        return '7글자 이하의 한글, 알파벳, 숫자를 입력해주세요.\n한글 자모음 단독으로 입력 불가';
      default:
        return '닉네임 변경에 실패하였습니다. 다시 시도해주세요.';
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.WHITE }}>
      <Header>
        <Pressable hitSlop={20} onPress={() => myPageNavigation.goBack()}>
          <IconCrossX width="24px" />
        </Pressable>
        <Space width="12px" />
        <FontText value="닉네임 수정" textSize="18px" lineHeight="23px" textWeight="Medium" />
        <View style={{ flex: 1 }} />
        <Pressable hitSlop={20} onPress={() => mutate(newNickname)} disabled={newNickname === ''}>
          <TextButton
            value="완료"
            textSize="16px"
            textColor={newNickname === '' ? COLOR.GRAY_999 : COLOR.BASIC_BLACK}
            textWeight="Medium"
            lineHeight="21px"
            onPress={() => mutate(newNickname)}
            disabled={newNickname === ''}
          />
        </Pressable>
      </Header>
      <Container>
        <InputContainer>
          <SearchInput
            value={newNickname}
            placeholder={`새 닉네임을 입력하세요`}
            placeholderTextColor={COLOR.GRAY_999}
            inputMode="search"
            onChangeText={(text) => {
              if (text.length > 7) return;
              setNewNickname(text);
            }}
            autoFocus
          />
          <IconXCircleFill width={19.5} onPress={() => setNewNickname('')} />
        </InputContainer>

        {!isNicknameValid && (
          <MessageContainer>
            <IconXCircle width={14} />
            <Space width="5px" />
            <FontText
              value={errorMessage}
              textSize="14px"
              textWeight="Medium"
              lineHeight="16px"
              textColor="#EB5147"
            />
          </MessageContainer>
        )}
      </Container>
    </SafeAreaView>
  );
};
export default ChangeNickNameScreen;

const Header = styled.View`
  padding: 0 22px;
  height: 56px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Container = styled.View`
  flex: 1;
  background-color: ${COLOR.GRAY_F9};
`;
const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #d4d4d4;
  padding: 8px 16px 8px 18.25px;
  margin: 34px 16px 0;
  background-color: ${COLOR.WHITE};
`;
const MessageContainer = styled.View`
  margin: 8px 25px;
  flex-direction: row;
`;
const SearchInput = styled(Input)`
  height: 36px;
  flex: 1;
`;
