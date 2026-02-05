import { View } from 'react-native';

interface Props {
  width?: number;
  height?: number;
  backgroundColor?: string;
}

const Space = ({ width, height, backgroundColor }: Props) => {
  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor: backgroundColor,
      }}
    />
  );
};

export default Space;
