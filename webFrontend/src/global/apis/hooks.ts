import { useQuery } from "@tanstack/react-query";
import { getIssueDetail } from "./func";

/**
 * 상세 이슈 조회 훅
 */
export const useGetIssue = ({
  id,
  enabled,
}: {
  id: string;
  enabled: boolean;
}) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["issue", id],
    queryFn: () => getIssueDetail({ id }),
    enabled: enabled,
  });
  return { issueData: data, isLoadingIssue: isLoading, refetchIssue: refetch };
};
