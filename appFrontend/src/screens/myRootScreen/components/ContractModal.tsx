import styled from '@emotion/native';
import { Modal } from 'react-native';
import { FontText, IconButton, Space } from '@/global/ui';

interface ModalProps {
  onCancel: () => void;
}

const ContractModal = ({ onCancel }: ModalProps) => (
  <Modal visible onRequestClose={onCancel}>
    <Header>
      <IconButton
        isFontIcon={false}
        imagePath="backBtn"
        iconHeight="24px"
        iconWidth="24px"
        onPress={onCancel}
      />
    </Header>
    <Container>
      <FontText value={`약관`} textSize="24px" textWeight="Bold" lineHeight="32px" />
      <Space height="20px" />
      <FontText value={`약관........약관`} textSize="16px" textWeight="Regular" lineHeight="21px" />
    </Container>
  </Modal>
);
export default ContractModal;

const Header = styled.View`
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Container = styled.View`
  background-color: white;
  padding: 0 16px;
  flex: 1;
`;