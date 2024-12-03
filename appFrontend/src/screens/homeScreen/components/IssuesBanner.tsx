import React from 'react';
import { FontText } from '@/global/ui';
import { IssueSummary, SubPath } from '@/global/apis/entity';
import MoreBtn from '@/assets/icons/moreBtn.svg';
import { subwayLineColor } from '@/global/utils';
import { useAppDispatch } from '@/store';
import { getIssueId } from '@/store/modules';
import { useRootNavigation } from '@/navigation/RootNavigation';
import IssueKeywordIcon from '@/global/components/IssueKeywordIcon';
import { TouchableOpacity } from 'react-native';

interface IssuesBannerProps {
  subPaths: SubPath[];
}

const IssuesBanner = ({ subPaths }: IssuesBannerProps) => {
  const dispatch = useAppDispatch();
  const navigation = useRootNavigation();

  const issues = subPaths.filter((subPath) => !!subPath.issueSummary.length);

  if (issues.length < 1) return null;
  return (
    <>
      {issues.map(({ issueSummary }, index: number) =>
        issueSummary.map((issue: IssueSummary, issueIndex: number) => (
          <TouchableOpacity
            key={`${index}-${issueIndex}`}
            onPress={() => {
              dispatch(getIssueId(issue.id));
              navigation.navigate('IssueStack', { screen: 'IssueDetail' });
            }}
            className="flex-row items-center justify-between px-16 py-12 overflow-hidden bg-white rounded-full border-gray-beb border-1"
          >
            <FontText
              className="mr-10 text-14 leading-21"
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
