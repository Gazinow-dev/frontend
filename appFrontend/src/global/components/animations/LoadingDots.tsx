import React from 'react';
import LottieView from 'lottie-react-native';
import LoadingDotsLottie from './loadingDots.json';

interface Props {
  width?: number;
  height?: number;
}

const LoadingDots = ({ width, height }: Props) => {
  return <LottieView source={LoadingDotsLottie} style={{ width, height }} autoPlay loop />;
};

export default LoadingDots;
