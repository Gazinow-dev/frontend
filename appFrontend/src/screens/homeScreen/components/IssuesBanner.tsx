import React from 'react';
import { FontText } from '@/global/ui';
import { IssueSummary, Lane, SubPath } from '@/global/apis/entity';
import MoreBtn from '@/assets/icons/moreBtn.svg';
import { subwayLineColor } from '@/global/utils';
import { useAppDispatch } from '@/store';
import { getIssueId } from '@/store/modules';
import { useRootNavigation } from '@/navigation/RootNavigation';
import IssueKeywordIcon from '@/global/components/IssueKeywordIcon';
import { TouchableOpacity } from 'react-native';

interface IssuesBannerProps {
  subPathss: SubPath[];
}

const IssuesBanner = ({ subPathss }: IssuesBannerProps) => {
  const dispatch = useAppDispatch();
  const navigation = useRootNavigation();

  const hasIssueLane = subPathss.reduce((accumulator: Lane[], subPaths: SubPath) => {
    if (subPaths.lanes[0].issueSummary.length > 0) {
      accumulator.push(subPaths.lanes[0]);
    }
    return accumulator;
  }, []);

  if (hasIssueLane.length < 1) return null;
  return (
    <>
      {hasIssueLane.map((lane: Lane, index: number) =>
        lane.issueSummary.map((issue: IssueSummary, issueIndex: number) => (
          <TouchableOpacity
            key={`${index}-${issueIndex}`}
            onPress={() => {
              dispatch(getIssueId(issue.id));
              navigation.navigate('IssueStack', { screen: 'IssueDetail' });
            }}
            className="flex-row items-center justify-between px-12 py-8 mb-8 overflow-hidden rounded-full border-gray-beb border-1"
          >
            <IssueKeywordIcon
              width={16}
              height={16}
              keyword={issue.keyword}
              color={subwayLineColor(lane.stationCode)}
            />
            <FontText
              className="flex-1 ml-10 mr-30 text-13"
              text={issue.title}
              fontWeight="600"
              numberOfLines={1}
            />
            <MoreBtn />
          </TouchableOpacity>
        )),
      )}
    </>
  );
};
export default IssuesBanner;
