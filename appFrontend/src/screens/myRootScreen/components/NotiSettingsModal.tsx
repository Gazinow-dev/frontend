import styled from '@emotion/native';
import { FontText, Space, TextButton } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useState } from 'react';
import { Modal, Switch } from 'react-native';
import BackBtn from '@assets/icons/backBtn.svg';

interface ModalProps {
  onCancel: () => void;
}

//TODO: 토글 디자인, 기능 구현

const NotiSettingsModal = ({ onCancel }: ModalProps) => {
  const [pushNotification, setPushNotification] = useState(false);
  const [savedPathNotification, setSavedPathNotification] = useState(true);
  const [newsNotification, setNewsNotification] = useState(true);

  const handlePushNotificationToggle = () => {
    setPushNotification(!pushNotification);
  };

  const submitNotificationSettings = () => {};

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
          onPress={() => submitNotificationSettings()}
        />
      </Header>
      <Container>
        <MenuContainer>
          <TextButton
            value="푸시 알림 받기"
            textSize="16px"
            textWeight="Regular"
            lineHeight="21px"
          />
          <Switch value={pushNotification} onValueChange={handlePushNotificationToggle} />
        </MenuContainer>
        {pushNotification && (
          <>
            <Space height="20px" backgroundColor={COLOR.GRAY_F9} />
            <MenuContainer>
              <TextButton
                value="내가 저장한 경로 알림"
                textSize="16px"
                textWeight="Regular"
                lineHeight="21px"
              />
              <Switch
                value={savedPathNotification}
                onValueChange={() => setSavedPathNotification(!savedPathNotification)}
              />
            </MenuContainer>
            <MenuContainer>
              <TextButton
                value="새소식 알림"
                textSize="16px"
                textWeight="Regular"
                lineHeight="21px"
              />
              <Switch
                value={newsNotification}
                onValueChange={() => setNewsNotification(!newsNotification)}
              />
            </MenuContainer>
          </>
        )}
      </Container>
    </Modal>
  );
};
export default NotiSettingsModal;

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
  background-color: white;
  flex: 1;
`;
const MenuContainer = styled.Pressable`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 16px;
  height: 53px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${COLOR.GRAY_EB};
`;
