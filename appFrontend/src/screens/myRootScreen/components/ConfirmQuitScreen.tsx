import styled from '@emotion/native';
import { useState } from 'react';
import { FontText, Space, TextButton } from '@/global/ui';
import { COLOR } from '@/global/constants';
import MyTabModal from '@/global/components/MyTabModal';
import { Pressable, SafeAreaView } from 'react-native';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';

const ConfirmQuitScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  const { nickname } = useSelector((state: RootState) => state.auth);
  const [popupVisible, setPopupVisible] = useState(false);

  const handleConfirm = () => {
    setPopupVisible(false);
    myPageNavigation.navigate('ConfirmPwScreen');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.WHITE }}>
      <Header>
        <Pressable hitSlop={20} onPress={() => myPageNavigation.goBack()}>
          <IconLeftArrowHead color="#3F3F46" />
        </Pressable>
      </Header>
      <Container>
        <AlertContainer>
          <FontText
            value={`${nickname}님,\n정말 탈퇴하시겠어요?`}
            textSize="24px"
            textWeight="Bold"
            lineHeight="32px"
          />
          <Space height="20px" />
          <FontText
            value={`탈퇴 시 계정의 모든 정보는 삭제되고\n재가입 시에도 복구하기 어려워요.`}
            textSize="16px"
            textWeight="Regular"
            lineHeight="21px"
          />
        </AlertContainer>
        <BottomBtn onPress={() => myPageNavigation.goBack()}>
          <TextButton
            value="이전으로 돌아가기"
            textSize="17px"
            textWeight="Regular"
            lineHeight="26px"
            textColor={COLOR.WHITE}
            onPress={() => myPageNavigation.goBack()}
          />
        </BottomBtn>
        <Pressable hitSlop={20} onPress={() => setPopupVisible(true)}>
          <QuitBtn>
            <UnderLine>
              <TextButton
                value="탈퇴하기"
                textSize="13px"
                textWeight="Regular"
                lineHeight="18px"
                textColor={COLOR.GRAY_999}
                onPress={() => setPopupVisible(true)}
              />
            </UnderLine>
          </QuitBtn>
        </Pressable>
        <MyTabModal
          isVisible={popupVisible}
          onCancel={() => setPopupVisible(false)}
          onConfirm={handleConfirm}
          title="정말 탈퇴할까요?"
          confirmText="탈퇴할래요"
          cancelText="아니요"
        />
      </Container>
    </SafeAreaView>
  );
};
export default ConfirmQuitScreen;

const Header = styled.View`
  padding: 0 0 0 22px;
  height: 56px;
  flex-direction: row;
  align-items: center;
`;
const Container = styled.View`
  background-color: white;
  padding: 0 16px;
  flex: 1;
`;
const AlertContainer = styled.Pressable`
  flex: 1;
  margin-top: 29px;
`;
const BottomBtn = styled.Pressable`
  padding-vertical: 11px;
  margin-bottom: 24px;
  border-radius: 5px;
  align-items: center;
  background-color: ${COLOR.BASIC_BLACK};
`;
const QuitBtn = styled.Pressable`
  align-items: center;
  margin-bottom: 79px;
`;
const UnderLine = styled.Pressable`
  border-bottom-width: 1px;
  border-bottom-color: ${COLOR.GRAY_999};
`;
