import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllIssuesFetch } from "./func";

/**
 * 이슈 전체 조회 훅
 */
export const useGetAllIssuesQuery = () => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["getAllIssues"],
    queryFn: ({ pageParam = 0 }) => getAllIssuesFetch({ page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.content && lastPage?.content.length < 15) return undefined;
      return allPages.length;
    },
  });
  return { data, fetchNextPage, hasNextPage };
};
