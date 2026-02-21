import {
  IconIssueAccident,
  IconIssueConstruction,
  IconIssueCrowded,
  IconIssueDelayed,
  IconIssueEvent,
  IconIssueNaturalDisaster,
  IconIssueProtest,
} from '@/assets/icons';
import { IssueKeywords } from '@/global/apis/entity';
import { View } from 'react-native';

interface Props {
  keyword: IssueKeywords;
  color: string;
  width: number;
  height: number;
  isPath?: boolean;
}

const IssueKeywordIcon = ({ keyword, color, width, height, isPath }: Props) => {
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
      {keyword === '공사' && <IconIssueConstruction width={width} height={height} color={color} />}
      {keyword === '자연재해' && (
        <IconIssueNaturalDisaster width={width} height={height} color={color} />
      )}
      {keyword === '연착' && <IconIssueDelayed width={width} height={height} color={color} />}
      {keyword === '사고' && <IconIssueAccident width={width} height={height} color={color} />}
      {keyword === '혼잡' && <IconIssueCrowded width={width} height={height} color={color} />}
      {keyword === '시위' && <IconIssueProtest width={width} height={height} color={color} />}
      {keyword === '행사' && <IconIssueEvent width={width} height={height} color={color} />}
    </View>
  );
};

export default IssueKeywordIcon;
