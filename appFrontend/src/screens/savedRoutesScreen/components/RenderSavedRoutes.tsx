import React, { useState } from 'react';
import { View } from 'react-native';
import { FontText, Space, TextButton } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useDeleteSavedSubwayRoute, useGetSavedRoutesQuery } from '@/global/apis/hook';
import MyTabModal from '@/global/components/MyTabModal';
import { useQueryClient } from 'react-query';
import { SubwaySimplePath } from '@/global/components';
import { RenderSavedRoutesType } from '@/global/apis/entity';
import styled from '@emotion/native';

const RenderSavedRoutes = () => {
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [routeToDelete, setRouteToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { deleteMutate } = useDeleteSavedSubwayRoute({
    onSuccess: async () => {
      await queryClient.invalidateQueries('getRoads');
    },
  });

  const { data: savedRoutes } = useGetSavedRoutesQuery();

  const showDeletePopup = (id: number) => {
    setRouteToDelete(id);
    setPopupVisible(true);
  };

  const hideModal = () => setPopupVisible(false);

  const handleConfirm = () => {
    deleteMutate({ id: routeToDelete });
    hideModal();
  };

  const renderSavedRoutes = () =>
    savedRoutes?.map((item: RenderSavedRoutesType) => (
        <RouteContainer key={item.id}>
          <TitleContainer>
            <FontText
              value={item.roadName}
              textSize="18px"
              textWeight="SemiBold"
              lineHeight="23px"
              textColor={COLOR.BASIC_BLACK}
            />
            <TextButton
              value="삭제"
              textSize="13px"
              textColor={COLOR.GRAY_999}
              textWeight="Regular"
              onPress={() => showDeletePopup(item.id)}
              lineHeight="19px"
            />
          </TitleContainer>
          <SubwaySimplePath
            pathData={item.subPaths}
            arriveStationName={item.lastEndStation}
            betweenPathMargin={24}
          />
        <Space height="8px" />
        <Space height="1px" backgroundColor={COLOR.GRAY_EB} />
        </RouteContainer>
    ));

  return (
    <View>
      {renderSavedRoutes()}
      <MyTabModal
        isVisible={popupVisible}
        onCancel={hideModal}
        onConfirm={handleConfirm}
        title="경로를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
      />
    </View>
  );
};

export default RenderSavedRoutes;

const RouteContainer = styled.View`
  padding: 20px 16px 0;
`;
const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;
