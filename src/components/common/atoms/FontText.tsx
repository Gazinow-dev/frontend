import styled from '@emotion/native';
import type { TextProps } from 'react-native/types';

import { COLOR } from '@/constants';

interface NormalTextProps extends TextProps, TextStyleProps {
  value: string;
}

const FontText = (props: NormalTextProps) => {
  const { value } = props;

  return <Normal {...props}>{value}</Normal>;
};

export default FontText;

interface TextStyleProps {
  textSize: string;
  textWeight: 'Bold' | 'SemiBold' | 'Medium' | 'Regular';
  textColor?: keyof typeof COLOR;
  lineHeight: string;
}
const Normal = styled.Text<TextStyleProps>`
  font-size: ${({ textSize }) => textSize};
  font-family: Pretendard-${({ textWeight }) => textWeight};
  color: ${({ textColor = COLOR.BASIC_BLACK }) => textColor};
  line-height: ${({ lineHeight }) => lineHeight};
`;