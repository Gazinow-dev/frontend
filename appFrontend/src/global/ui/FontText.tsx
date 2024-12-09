import { Text } from 'react-native';
import type { TextProps } from 'react-native/types';
import cn from 'classname';

interface FontTextProps extends TextProps {
  text: string;
  fontWeight?: '400' | '500' | '600' | '700';
}

const FontText = ({ text, fontWeight = '400', className, ...props }: FontTextProps) => {
  return (
    <Text
      allowFontScaling
      className={cn('text-16 tracking-[-0.2px] text-black-717', className, {
        'font-[Pretendard-Regular]': fontWeight === '400',
        'font-[Pretendard-Medium]': fontWeight === '500',
        'font-[Pretendard-SemiBold]': fontWeight === '600',
        'font-[Pretendard-Bold]': fontWeight === '700',
      })}
      {...props}
    >
      {text}
    </Text>
  );
};

export default FontText;
