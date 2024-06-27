import { Text } from 'react-native';
import type { TextProps } from 'react-native/types';

interface NormalTextProps extends TextProps {
  value: string;
  textSize: string;
  textWeight: 'Bold' | 'SemiBold' | 'Medium' | 'Regular';
  textColor?: string;
  lineHeight?: number;
  textAlign?: 'center';
}

const FontText = ({
  textWeight,
  lineHeight,
  textAlign,
  textSize,
  textColor = '#171717',
  ...props
}: NormalTextProps) => {
  const { value } = props;

  return (
    <Text
      {...props}
      allowFontScaling
      style={{
        fontFamily: `Pretendard-${textWeight}`,
        lineHeight,
        textAlign,
        fontSize: Number(textSize.split('px')[0]),
        color: textColor,
      }}
    >
      {value}
    </Text>
  );
};

export default FontText;
