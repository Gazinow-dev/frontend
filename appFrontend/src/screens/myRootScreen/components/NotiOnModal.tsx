import styled from '@emotion/native';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { Linking, Modal } from 'react-native';
import { COLOR } from '@/global/constants';
import { FontText, Space, TextButton } from '@/global/ui';
import BackBtn from '@assets/icons/backBtn.svg';

interface ModalProps {
  onCancel: () => void;
}

const NotiOnModal = ({ onCancel }: ModalProps) => {
  const navigation = useRootNavigation();
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
    <Modal visible onRequestClose={onCancel}>
      <Header>
        <TitleContainer>
          <BackBtn width="24px" onPress={onCancel} />
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
    </Modal>
  );
};
export default NotiOnModal;

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
