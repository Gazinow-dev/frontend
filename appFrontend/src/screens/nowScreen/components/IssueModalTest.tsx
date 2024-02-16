import React from 'react';
import { FontText } from '@/global/ui';
import { Modal } from 'react-native';

interface IssueDetailProps {
  id: number;
  onRequestClose: () => void;
}

const IssueModalTest = ({ id, onRequestClose }: IssueDetailProps) => {
  return (
    <Modal onRequestClose={onRequestClose}>
      <FontText value={id} textSize="16px" textWeight="SemiBold" lineHeight="21px" />
    </Modal>
  );
};

export default IssueModalTest;
