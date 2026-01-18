import React from 'react';
import LottieView from 'lottie-react-native';
import LoadingCircleLottie from './loadingCircle.json';
import { COLOR } from '@/global/constants';

interface LoadingCircleProps {
  color?: 'white' | 'gray';
  size?: number;
}

const LoadingCircle = ({ color = 'gray', size = 50 }: LoadingCircleProps) => {
  const lottieColor = color === 'gray' ? COLOR.RGB_GRAY_999 : COLOR.RGB_WHITE;

  if (
    LoadingCircleLottie.layers &&
    LoadingCircleLottie.layers[0] &&
    LoadingCircleLottie.layers[0].shapes[2] &&
    LoadingCircleLottie.layers[0].shapes[2].c
  ) {
    LoadingCircleLottie.layers[0].shapes[2].c.k = lottieColor;
  }

  return (
    <LottieView source={LoadingCircleLottie} style={{ width: size, height: size }} autoPlay loop />
  );
};

export default LoadingCircle;
