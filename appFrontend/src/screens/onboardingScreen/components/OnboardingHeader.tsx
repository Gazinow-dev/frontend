import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useOnboardingNavigation } from '@/navigation/OnboardingNavigation';
import { IconChevronLeft, IconCross } from '@/assets/icons';

const OnboardingHeader = () => {
  const onboardingNavigation = useOnboardingNavigation();

  return (
    <View className="flex-row items-center justify-between py-16">
      <TouchableOpacity hitSlop={20} onPress={() => onboardingNavigation.goBack()}>
        <IconChevronLeft />
      </TouchableOpacity>

      <TouchableOpacity hitSlop={20} onPress={() => onboardingNavigation.popToTop()}>
        <IconCross />
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingHeader;
