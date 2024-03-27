import styled from '@emotion/native';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { Linking, SafeAreaView } from 'react-native';
import { COLOR } from '@/global/constants';
import { FontText, Space, TextButton } from '@/global/ui';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';

const NotiOnScreen = () => {
  const navigation = useRootNavigation();
  const myPageNavigation = useMyPageNavigation();

  navigation.setOptions({
    headerRight: () => (
      <TextButton
        value="완료    "
        textSize="16px"
        textColor={COLOR.GRAY_999}
        textWeight="Medium"
        lineHeight="21px"
        // onPress={() => submitNotificationSettings()}
      />
    ),
  });

  const goToDeviceSettings = () => {
    Linking.openSettings();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.WHITE }}>
      <Header>
        <TitleContainer>
          <IconLeftArrowHead
            color="#3F3F46"
            width="24px"
            onPress={() => myPageNavigation.goBack()}
          />
          <Space width="12px" />
          <FontText value="알림 설정" textSize="18px" lineHeight="23px" textWeight="Medium" />
        </TitleContainer>
        <TextButton
          value="완료    "
          textSize="16px"
          textColor={COLOR.GRAY_999}
          textWeight="Medium"
          lineHeight="21px"
          // onPress={() => submitNotificationSettings()}
        />
      </Header>
      <Container>
        <AlertContainer>
          <FontText
            value={`기기 알림을 켜주세요!`}
            textSize="24px"
            textWeight="Bold"
            lineHeight="32px"
          />
          <Space height="7px" />
          <FontText
            value={`정보 알림을 받기 위해선 기기 알림을 켜주세요`}
            textSize="16px"
            textWeight="Regular"
            lineHeight="21px"
            textColor={COLOR.GRAY_999}
          />
        </AlertContainer>
        <BottomBtn onPress={goToDeviceSettings}>
          <TextButton
            value="기기 알림 켜기"
            textSize="17px"
            textWeight="Regular"
            lineHeight="26px"
            textColor={COLOR.WHITE}
            onPress={goToDeviceSettings}
          />
        </BottomBtn>
      </Container>
    </SafeAreaView>
  );
};
export default NotiOnScreen;

const Header = styled.View`
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const TitleContainer = styled.View`
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
  margin-top: 229px;
  align-items: center;
`;
const BottomBtn = styled.Pressable`
  padding-vertical: 11px;
  margin-bottom: 83px;
  border-radius: 5px;
  align-items: center;
  background-color: ${COLOR.BASIC_BLACK};
`;
