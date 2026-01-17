import React from 'react';
import { FontText } from '@/global/ui';
import { TouchableOpacity, View } from 'react-native';
import IconChevronLeft from '@assets/icons/icon_chevron-left.svg';
import IconCrossX from '@assets/icons/cross_x.svg';
import { useNewRouteNavigation } from '@/navigation/NewRouteNavigation';
import { useHomeNavigation } from '@/navigation/HomeNavigation';

const AddNewRouteHeader = () => {
  const newRouteNavigation = useNewRouteNavigation();
  const homeNavigation = useHomeNavigation();

  return (
    <View className="h-56 flex-row items-center justify-between px-16">
      <TouchableOpacity hitSlop={20} onPress={() => newRouteNavigation.goBack()}>
        <IconChevronLeft />
      </TouchableOpacity>

      <FontText text="새 경로 저장" className="text-18" fontWeight="500" />

      <TouchableOpacity
        hitSlop={20}
        onPress={() => {
          homeNavigation.popToTop();
          homeNavigation.popToTop();
        }}
      >
        <IconCrossX />
      </TouchableOpacity>
    </View>
  );
};

export default AddNewRouteHeader;
