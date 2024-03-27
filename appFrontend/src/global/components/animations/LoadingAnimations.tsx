import React from 'react';
import LottieView from 'lottie-react-native';
import LoadingLottie from './lottie_loading_normal.json';
import { COLOR } from '@/global/constants';

interface LoadingAnimationsProps {
  color?: 'white' | 'gray';
  width?: number;
  height?: number;
}

const LoadingAnimations = ({ color, width, height }: LoadingAnimationsProps) => {
  let lottieColor: number[] = [0, 0, 0];
  switch (color) {
    case 'white':
      lottieColor = COLOR.RGB_WHITE;
      break;
    case 'gray':
      lottieColor = COLOR.RGB_GRAY_999;
      break;
    default:
      break;
  }

  if (
    LoadingLottie.layers &&
    LoadingLottie.layers[0] &&
    LoadingLottie.layers[0].shapes[2] &&
    LoadingLottie.layers[0].shapes[2].c
  ) {
    LoadingLottie.layers[0].shapes[2].c.k = lottieColor;
  }

  return <LottieView source={LoadingLottie} style={{ width, height }} autoPlay loop />;
};

export default LoadingAnimations;
