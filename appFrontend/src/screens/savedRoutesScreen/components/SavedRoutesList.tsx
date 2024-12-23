import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FontText } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useDeleteSavedSubwayRoute, useGetSavedRoutesQuery } from '@/global/apis/hooks';
import MyTabModal from '@/global/components/MyTabModal';
import { useQueryClient } from 'react-query';
import { SubwaySimplePath } from '@/global/components';
import { showToast } from '@/global/utils/toast';

const SavedRoutesList = () => {
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [routeToDelete, setRouteToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { deleteMutate } = useDeleteSavedSubwayRoute({
    onSuccess: async () => {
      await queryClient.invalidateQueries('getRoads');
      showToast('deleteRoute');
    },
  });

  const { myRoutes } = useGetSavedRoutesQuery();

  const showDeletePopup = (id: number) => {
    setRouteToDelete(id);
    setPopupVisible(true);
  };

  const hideModal = () => setPopupVisible(false);

  const handleConfirm = () => {
    deleteMutate({ id: routeToDelete });
    hideModal();
  };

  return (
    <>
      {myRoutes?.map((item) => (
        <View className="px-16 pt-20 pb-8 border-b-1 border-gray-beb" key={item.id}>
          <View className="flex-row items-center justify-between mb-24">
            <FontText text={item.roadName} className="text-18 leading-23" fontWeight="600" />
            <TouchableOpacity onPress={() => showDeletePopup(item.id)} hitSlop={20}>
              <FontText text="삭제" className="text-13 text-gray-999 leading-19" />
            </TouchableOpacity>
          </View>
          <SubwaySimplePath
            pathData={item.subPaths}
            arriveStationName={item.lastEndStation}
            betweenPathMargin={24}
            isHideIsuue
          />
        </View>
      ))}
      <MyTabModal
        isVisible={popupVisible}
        onCancel={hideModal}
        onConfirm={handleConfirm}
        title="경로를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
      />
    </>
  );
};

export default SavedRoutesList;
