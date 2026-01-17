import React, { useState } from 'react';
import { FontText } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import IconPlusBtn from '@assets/icons/plus_circle.svg';
import IconChevronLeft from '@assets/icons/icon_chevron-left.svg';
import { useGetSavedRoutesQuery } from '@/global/apis/hooks';
import MyTabModal from '@/global/components/MyTabModal';
import { useMutation, useQueryClient } from 'react-query';
import { LoadingScreen, NetworkErrorScreen, SubwaySimplePath } from '@/global/components';
import { showToast } from '@/global/utils/toast';
import { trackMapBookmark2, trackMapBookmarkDelete } from '@/analytics/map.events';
import { myPathDeleteFetch } from '@/global/apis/func';
import { MyRoutesType } from '@/global/apis/entity';
import { SafeAreaView } from 'react-native-safe-area-context';

const SavedRoutesScreen = () => {
  const navigation = useRootNavigation();

  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [routeToDelete, setRouteToDelete] = useState<MyRoutesType | null>(null);
  const queryClient = useQueryClient();

  const { mutate } = useMutation(myPathDeleteFetch, {
    onSuccess: async () => {
      if (!routeToDelete) return;
      const trackData = {
        station_departure: routeToDelete.subPaths[0].stations[0].stationName,
        station_arrival: routeToDelete.subPaths.at(-1)?.stations.at(-1)?.stationName!,
        line_departure: routeToDelete.subPaths[0].name,
        line_arrival: routeToDelete.subPaths.at(-1)?.name!,
      };
      trackMapBookmarkDelete(trackData);
      await queryClient.invalidateQueries('getRoads');
      showToast('deleteRoute');
    },
  });

  const { myRoutes, getSavedRoutesRefetch, isLoadingSavedRoutes, isSavedRoutesError } =
    useGetSavedRoutesQuery();

  const showDeletePopup = (route: MyRoutesType) => {
    setRouteToDelete(route);
    setPopupVisible(true);
  };

  const hideModal = () => setPopupVisible(false);

  const handleConfirm = () => {
    if (!routeToDelete) return;
    mutate({ id: routeToDelete.id });
    hideModal();
  };

  const handleSetNoti = (item: MyRoutesType) =>
    navigation.navigate('MyPageNavigation', {
      screen: 'NotiSettingsDetailScreen',
      params: { myRoutes: item },
    });

  if (isLoadingSavedRoutes) {
    return <LoadingScreen />;
  }
  if (isSavedRoutesError || !myRoutes) {
    return <NetworkErrorScreen retryFn={getSavedRoutesRefetch} />;
  }
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
          <IconChevronLeft />
        </TouchableOpacity>
        <FontText text="저장경로 편집" className="text-18 leading-23" fontWeight="500" />
      </View>
      <ScrollView>
        <View className="mx-16 rounded-15 bg-white">
          {myRoutes?.map((item) => (
            <View className="border-b-1 border-gray-beb px-16 pb-8 pt-20" key={item.id}>
              <View className="mb-24 flex-row items-center justify-between">
                <FontText text={item.roadName} className="text-18 leading-23" fontWeight="600" />
                <View className="flex-row gap-20">
                  <TouchableOpacity onPress={() => handleSetNoti(item)} hitSlop={20}>
                    <FontText text="알림설정" className="text-13 leading-19 text-gray-999" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => showDeletePopup(item)} hitSlop={20}>
                    <FontText text="삭제" className="text-13 leading-19 text-gray-999" />
                  </TouchableOpacity>
                </View>
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
            onPress={() => {
              trackMapBookmark2();
              navigation.navigate('NewRouteNavigation', { screen: 'Swap' });
            }}
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
