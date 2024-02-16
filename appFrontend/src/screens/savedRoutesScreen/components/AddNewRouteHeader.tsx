import React from 'react';
import styled from '@emotion/native';
import { FontText, Space } from '@/global/ui';
import { Platform, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import BackBtn from '@assets/icons/backBtn.svg';
import CloseBtn from '@assets/icons/closeBtn.svg';

interface HeaderProps {
  onBackBtnPress: () => void;
  onCloseBtnPress: () => void;
}

const AddNewRouteHeader = ({ onBackBtnPress, onCloseBtnPress }: HeaderProps) => {
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) + 6 : (StatusBar.currentHeight as number) - 8;

  return (
    <>
      <Header
        style={{
          paddingTop: StatusBarHeight,
        }}
      >
        <BackBtn width="24px" onPress={onBackBtnPress} />
        <FontText value="새 경로 저장" textSize="18px" textWeight="Medium" lineHeight="23px" />
        <CloseBtn width="24px" onPress={onCloseBtnPress} />
      </Header>
      <Space height="8px" />
    </>
  );
};

const Header = styled.View`
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default AddNewRouteHeader;
