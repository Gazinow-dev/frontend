import React, { useState } from 'react';
import styled from '@emotion/native';
import RenderSavedRoutes from './components/RenderSavedRoutes';
import { FontText, Space } from '@/global/ui';
import { COLOR } from '@/global/constants';
import AddNewRouteModal from './components/AddNewRouteModal';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { Platform, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import PlusBtn from '@assets/icons/plus-circle.svg';
import BackBtn from '@assets/icons/backBtn.svg';

const SavedRoutesScreen = () => {
  const StatusBarHeight =
    Platform.OS === 'ios'
      ? getStatusBarHeight(true) - 10
      : (StatusBar.currentHeight as number) - 24;
  const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState<boolean>(false);
  const navigation = useRootNavigation();

  return (
    <Container
      style={{
        paddingTop: StatusBarHeight,
      }}
    >
      <Header>
        <BackBtn width='24px' onPress={() => navigation.goBack()}  />
        <Space width="12px" />
        <FontText value="저장경로 편집" textSize="18px" textWeight="Medium" lineHeight="23px" />
      </Header>
      <Space height="4px" />
      <RouteContainer>
        <RenderSavedRoutes />
        <AddContainer onPress={() => setIsAddRouteModalOpen(true)}>
          <PlusBtn />
          <FontText
            value="  경로 추가하기"
            textSize="14px"
            textWeight="Medium"
            lineHeight="21px"
            textColor={COLOR.GRAY_999}
          />
        </AddContainer>
      </RouteContainer>
      <AddNewRouteModal
        isVisible={isAddRouteModalOpen}
        onCancel={() => setIsAddRouteModalOpen(false)}
      />
    </Container>
  );
};
const Container = styled.ScrollView`
  padding: 0 16px 20px;
  background-color: ${COLOR.GRAY_F9};
`;
const Header = styled.View`
  padding: 16px 0;
  flex-direction: row;
  align-items: center;
`;
const RouteContainer = styled.View`
  background-color: ${COLOR.WHITE};
  border-radius: 15px;
`;
const AddContainer = styled.Pressable`
  padding: 20px 0px 24px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export default SavedRoutesScreen;
