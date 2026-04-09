import cn from 'classname';
import { Dimensions, View } from 'react-native';
import { LineCode } from '@/global/apis/entity';
import { FontText } from '@/global/ui';
import { breakStationName, lineCodeToColor, lineCodeToLineCircle } from '@/global/utils';

interface Props {
  stationCode: LineCode;
  direct: boolean;
  stationName: string;
}

const PathLineNumName = ({ stationCode, direct, stationName }: Props) => {
  return (
    <View
      style={{
        position: 'relative',
        alignItems: 'center',
        marginBottom: Dimensions.get('window').fontScale * 22,
      }}
    >
      <View className="w-42" />
      <View
        style={{
          width: Dimensions.get('window').fontScale * 24,
          height: Dimensions.get('window').fontScale * 24,
          borderRadius: 9999,
          backgroundColor: lineCodeToColor(stationCode),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {stationCode > 9 && <View className="h-1" />}
        <FontText
          text={lineCodeToLineCircle(stationCode)}
          fontWeight={stationCode <= 9 ? '600' : '700'}
          className={cn('text-14 text-white', {
            'text-[8.2px] leading-9 tracking-[-0.4px]': stationCode > 9,
            'text-[9.273px] leading-10 tracking-[-0.4px]':
              lineCodeToLineCircle(stationCode).length === 2,
          })}
        />
      </View>

      <View
        className="absolute flex w-54 flex-col justify-center"
        style={{ top: Dimensions.get('window').fontScale * 30 }}
      >
        <FontText
          text={breakStationName(stationName.split('(')[0])}
          className="text-center text-xs"
          fontWeight="600"
          style={{ color: lineCodeToColor(stationCode) }}
        />
        {direct && <FontText text="급행" className="text-center text-xs text-light-red" />}
      </View>
    </View>
  );
};

export default PathLineNumName;
