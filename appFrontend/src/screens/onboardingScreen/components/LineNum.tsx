import cn from 'classname';
import { Dimensions, View } from 'react-native';
import { DisplayLineName, OriginLineName } from '@/global/apis/entity';
import { originToLineCircle } from '@/global/utils/subwayLine';
import { FontText } from '@/global/ui';
import {
  displayToLineCircle,
  displayToOrigin,
  lineCapsuleToColor,
  originToLineCapsule,
} from '@/global/utils';

interface Props {
  originName?: OriginLineName;
  displayName?: DisplayLineName;
}

const LineNum = ({ originName, displayName }: Props) => {
  const backgroundColor =
    (originName && lineCapsuleToColor(originToLineCapsule(originName))) ||
    (displayName && lineCapsuleToColor(originToLineCapsule(displayToOrigin(displayName))));

  const text =
    (originName && originToLineCircle(originName)) ||
    (displayName && displayToLineCircle(displayName));

  const isLongText =
    (originName && originToLineCircle(originName).length > 1) ||
    (displayName && displayToLineCircle(displayName).length > 1);

  return (
    <View
      style={{
        width: Dimensions.get('window').fontScale * 24,
        height: Dimensions.get('window').fontScale * 24,
        borderRadius: 9999,
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FontText
        text={text ?? ''}
        fontWeight={isLongText ? '700' : '600'}
        className={cn('text-13 text-white', {
          'text-[9.273px] leading-10 tracking-[-0.4px]': isLongText,
        })}
      />
    </View>
  );
};

export default LineNum;
