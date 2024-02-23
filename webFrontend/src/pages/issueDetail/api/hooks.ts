import { useMutation, useQuery } from "@tanstack/react-query";
import { getIssueDetail, postLike } from "./func";

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
  const { data, isLoading } = useQuery({
    queryKey: ["issue", id],
    queryFn: () => getIssueDetail({ id }),
    enabled: enabled,
  });
  return { issueData: data, isLoadingIssue: isLoading };
};

/**
 * 상세 이슈 조회 훅
 */
export const usePostLike = () => {
  const { mutate } = useMutation({ mutationFn: postLike });
  return { doLikeMutate: mutate };
};
