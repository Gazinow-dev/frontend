import { IssueKeywords } from '@/global/apis/entity';
import IconAccident from '@assets/icons/path_accident.svg';
import IconCrowded from '@assets/icons/path_crowded.svg';
import IconDelayed from '@assets/icons/path_delayed.svg';
import IconEvent from '@assets/icons/path_event.svg';
import IconNaturalDisaster from '@assets/icons/path_natural_disaster.svg';
import IconProtest from '@assets/icons/path_protest.svg';
import IconConstruction from '@assets/icons/path_construction.svg';
import { View } from 'react-native';

interface IssueKeywordIconProps {
  keyword: IssueKeywords;
  color: string;
  width: number;
  height: number;
  isPath?: boolean;
}

const IssueKeywordIcon = ({ keyword, color, width, height, isPath }: IssueKeywordIconProps) => {
  return (
    <View style={{ alignItems: 'center', position: 'relative', bottom: isPath ? 6 : 0 }}>
      {isPath && (
        <View
          style={{
            position: 'absolute',
            bottom: -3,
            width: 0,
            height: 0,
            borderTopColor: color,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopWidth: 5,
            borderLeftWidth: 3,
            borderRightWidth: 3,
          }}
        />
      )}
      {keyword === '공사' && <IconConstruction width={width} height={height} color={color} />}
      {keyword === '자연재해' && (
        <IconNaturalDisaster width={width} height={height} color={color} />
      )}
      {keyword === '연착' && <IconDelayed width={width} height={height} color={color} />}
      {keyword === '사고' && <IconAccident width={width} height={height} color={color} />}
      {keyword === '혼잡' && <IconCrowded width={width} height={height} color={color} />}
      {keyword === '시위' && <IconProtest width={width} height={height} color={color} />}
      {keyword === '행사' && <IconEvent width={width} height={height} color={color} />}
    </View>
  );
  return <></>;
};

export default IssueKeywordIcon;
