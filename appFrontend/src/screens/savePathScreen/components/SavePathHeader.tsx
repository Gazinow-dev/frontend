import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FontText } from '@/global/ui';
import { useHomeNavigation } from '@/navigation/HomeNavigation';
import { useSavePathNavigation } from '@/navigation/SavePathNavigation';
import { IconChevronLeft, IconCross } from '@/assets/icons';

const SavePathHeader = () => {
  const savePathNavigation = useSavePathNavigation();
  const homeNavigation = useHomeNavigation();

  return (
    <View className="h-56 flex-row items-center justify-between px-16">
      <TouchableOpacity hitSlop={20} onPress={() => savePathNavigation.goBack()}>
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
        <IconCross />
      </TouchableOpacity>
    </View>
  );
};

export default SavePathHeader;
