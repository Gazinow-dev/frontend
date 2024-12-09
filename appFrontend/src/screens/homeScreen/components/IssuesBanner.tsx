import React from 'react';
import { FontText } from '@/global/ui';
import { SubPath } from '@/global/apis/entity';
import MoreBtn from '@/assets/icons/moreBtn.svg';
import { useAppDispatch } from '@/store';
import { getIssueId } from '@/store/modules';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { TouchableOpacity } from 'react-native';
import cn from 'classname';

interface IssuesBannerProps {
  subPaths: SubPath[];
}

const IssuesBanner = ({ subPaths }: IssuesBannerProps) => {
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
            dispatch(getIssueId(issue.id));
            navigation.navigate('IssueStack', { screen: 'IssueDetail' });
          }}
          className={cn(
            'flex-row items-center justify-between px-16 py-12 overflow-hidden bg-white rounded-full border-gray-beb border-1',
            { 'mb-8': index !== uniqueIssueSummary.length - 1 },
          )}
        >
          <FontText
            className="mr-10 text-14 leading-21"
            text={issue.title}
            fontWeight="600"
            numberOfLines={1}
          />
          <MoreBtn />
        </TouchableOpacity>
      ))}
    </>
  );
};
export default IssuesBanner;
