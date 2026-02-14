import React from 'react';
import { FontText } from '@/global/ui';
import { SubPath } from '@/global/apis/entity';
import { IconChevronRight2 } from '@/assets/icons';
import { useAppDispatch } from '@/store';
import { getIssueId } from '@/store/modules';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { TouchableOpacity } from 'react-native';
import cn from 'classname';
import { trackMapBookmarkIssueCheck, trackMapSearchIssueCheck } from '@/analytics/map.events';

interface Props {
  subPaths: SubPath[];
  isHomeScreen?: boolean;
}

const IssuesBanner = ({ subPaths, isHomeScreen }: Props) => {
  const issues = subPaths.filter((subPath) => !!subPath.issueSummary.length);
  if (issues.length < 1) return null;

  const dispatch = useAppDispatch();
  const navigation = useRootNavigation();

  const allIssueSummary = issues.flatMap((issue) => issue.issueSummary);

  // title 기준으로 중복 제거
  const uniqueIssueSummary = Array.from(
    new Map(allIssueSummary.map((issue) => [issue.title, issue])).values(),
  );

  return (
    <>
      {uniqueIssueSummary.map((issue, index: number) => (
        <TouchableOpacity
          key={`${index}-${issue}`}
          onPress={() => {
            const trackData = {
              station_departure: subPaths[1].stations[0].stationName,
              station_arrival: subPaths.at(-2)?.stations.at(-1)?.stationName!,
              line_departure: subPaths[1].name,
              line_arrival: subPaths.at(-2)?.name!,
            };
            if (isHomeScreen) {
              trackMapBookmarkIssueCheck(trackData);
            } else {
              trackMapSearchIssueCheck(trackData);
            }
            dispatch(getIssueId(issue.id));
            navigation.navigate('IssueStack', { screen: 'IssueDetail' });
          }}
          className={cn(
            'flex-row items-center justify-between overflow-hidden rounded-full border-1 border-gray-beb bg-white px-16 py-12',
            { 'mb-8': index !== uniqueIssueSummary.length - 1 },
          )}
        >
          <FontText
            className="mr-10 text-14 leading-21"
            text={issue.title}
            fontWeight="600"
            numberOfLines={1}
          />
          <IconChevronRight2 />
        </TouchableOpacity>
      ))}
    </>
  );
};
export default IssuesBanner;
