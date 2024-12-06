import { IssueSummary, StationCode } from '@/global/apis/entity';
import { subwayLineColor } from '@/global/utils';
import { View } from 'react-native';
import IssueKeywordIcon from '../IssueKeywordIcon';

interface PathBarProps {
  stationCode: StationCode;
  isFirst?: boolean;
  isLast: boolean;
  issues: IssueSummary[];
  isHideIsuue: boolean;
}

const PathBar = ({ stationCode, isFirst, isLast, issues, isHideIsuue }: PathBarProps) => {
  return (
    <View
      style={{
        backgroundColor: subwayLineColor(stationCode),
        height: 2,
        flex: 1,
        marginTop: 10,
        marginRight: isLast ? 18 : null,
        marginLeft: isFirst ? 18 : null,
        position: 'relative',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: -31,
          width: '100%',
          justifyContent: issues.length > 1 ? 'space-around' : 'center',
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: 8,
        }}
      >
        {!isHideIsuue &&
          issues &&
          issues.map((issue, idx) => {
            if (idx > 2) return;
            return (
              <IssueKeywordIcon
                key={issue.id + issue.title}
                width={25}
                height={25}
                keyword={issue.keyword}
                color={subwayLineColor(stationCode)}
                isPath
              />
            );
          })}
      </View>
    </View>
  );
};

export default PathBar;
