import { ImageSourcePropType } from 'react-native';

export interface IconPathTypes {
  exchange_gray: ImageSourcePropType;
  location_pin_gray: ImageSourcePropType;
  left_arrow_nonbar: ImageSourcePropType;
  right_arrow_nonbar: ImageSourcePropType;
  walk_human_gray: ImageSourcePropType;
  issueMap: ImageSourcePropType;
}

export const iconPath: IconPathTypes = {
  exchange_gray: require('@/assets/icons/exchange_gray.png'),
  location_pin_gray: require('@/assets/icons/location_pin_gray.png'),
  left_arrow_nonbar: require('@/assets/icons/left_arrow_nonbar.png'),
  right_arrow_nonbar: require('@/assets/icons/right_arrow_nonbar.png'),
  walk_human_gray: require('@/assets/icons/walk_human_gray.png'),
  issueMap: require('@/assets/icons/issueMap.png'),
};
