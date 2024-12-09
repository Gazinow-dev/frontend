import React, { useState } from 'react';
import { FontText } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { Pressable, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import IconPlusBtn from '@assets/icons/plus_circle.svg';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import { useDeleteSavedSubwayRoute, useGetSavedRoutesQuery } from '@/global/apis/hooks';
import MyTabModal from '@/global/components/MyTabModal';
import { useQueryClient } from 'react-query';
import { SubwaySimplePath } from '@/global/components';
import { showToast } from '@/global/utils/toast';

const SavedRoutesScreen = () => {
  const navigation = useRootNavigation();

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
    <SafeAreaView className="flex-1 bg-gray-9f9">
      <MyTabModal
        isVisible={popupVisible}
        onCancel={hideModal}
        onConfirm={handleConfirm}
        title="경로를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
      />
      <View className="flex-row items-center gap-12 p-16">
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={20}>
          <IconLeftArrowHead width={24} color="#3F3F46" />
        </TouchableOpacity>
        <FontText text="저장경로 편집" className="text-18 leading-23" fontWeight="500" />
      </View>
      <ScrollView>
        <View className="mx-16 bg-white rounded-15">
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
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? COLOR.GRAY_E5 : COLOR.WHITE,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 20,
              borderRadius: 15,
              borderTopLeftRadius: myRoutes?.length === 0 ? 15 : 0,
              borderTopRightRadius: myRoutes?.length === 0 ? 15 : 0,
            })}
            onPress={() => navigation.navigate('NewRouteNavigation', { screen: 'Swap' })}
          >
            <IconPlusBtn />
            <FontText
              text="경로 추가하기"
              className="ml-6 text-14 leading-21 text-gray-999"
              fontWeight="500"
            />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SavedRoutesScreen;
