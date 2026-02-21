import { useInfiniteQuery, useQuery } from 'react-query';
import { getCommentsOnAIssueFetch, getIssueDetail } from './func';
import { useAppSelect } from '@/store';

/**
 * 상세 이슈 조회 훅
 */
export const useGetIssue = ({ issueId }: { issueId: number | null }) => {
  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);
  const { data, refetch, isLoading, isError } = useQuery(
    ['issue', issueId],
    () => getIssueDetail({ params: { id: issueId }, isVerifiedUser }),
    {
      enabled: !!issueId,
    },
  );
  return {
    issueData: data,
    refetchIssue: refetch,
    isLoadingIssue: isLoading,
    isIssueError: isError,
  };
};

/**
 * 이슈에 달린 댓글 조회 훅
 */
export const useGetCommentsOnAIssue = ({ issueId }: { issueId: number }) => {
  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);
  const { data, refetch, fetchNextPage, hasNextPage, isLoading, isError } = useInfiniteQuery(
    ['getCommentsOnAIssue', issueId],
    ({ pageParam = 0 }) =>
      getCommentsOnAIssueFetch({ isVerifiedUser, params: { issueId: issueId, page: pageParam } }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.content && lastPage?.content.length < 15) return undefined;
        return allPages.length;
      },
      enabled: !!issueId,
    },
  );
  return {
    commentsOnAIssue: data,
    commentsOnAIssueRefetch: refetch,
    fetchCommentsOnAIssueNextPage: fetchNextPage,
    commentsOnAIssueHasNextPage: hasNextPage,
    isLoadingComment: isLoading,
    isCommentError: isError,
  };
};
