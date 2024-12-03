import { Dimensions, View } from 'react-native';
import cn from 'classname';
import { FontText } from '@/global/ui';
import { subwayLineColor, pathSubwayLineName, subwayNameCutting } from '@/global/utils';
import { StationCode } from '@/global/apis/entity';

interface PathLineNumNameProps {
  stationCode: StationCode;
  direct: boolean;
  stationName: string;
}

const PathLineNumName = ({ stationCode, direct, stationName }: PathLineNumNameProps) => {
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
          width: Dimensions.get('window').fontScale * 18,
          height: Dimensions.get('window').fontScale * 18,
          borderRadius: 9999,
          backgroundColor: subwayLineColor(stationCode),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FontText
          text={pathSubwayLineName(stationCode)}
          fontWeight={stationCode <= 9 ? '600' : '700'}
          className={cn('text-6 leading-15 text-white', {
            'text-13': stationCode <= 9,
            'leading-6 tracking-[-0.3px] mt-1': stationCode > 9,
          })}
        />
      </View>

      <View
        className="absolute flex flex-col justify-center w-54"
        style={{
          top: Dimensions.get('window').fontScale * 22,
        }}
      >
        <FontText
          text={subwayNameCutting(stationName.split('(')[0])}
          className="text-xs text-center"
          fontWeight="600"
          style={{ color: subwayLineColor(stationCode) }}
        />
        {direct && <FontText text="급행" className="text-xs text-center text-light-red" />}
      </View>
    </View>
  );
};

export default PathLineNumName;
