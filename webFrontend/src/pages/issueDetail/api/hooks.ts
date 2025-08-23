import { useMutation } from "@tanstack/react-query";
import { deletePostLike, postLike } from "./func";

/**
 * 상세 이슈 도움돼요 추가 훅
 */
export const usePostLike = ({ onSuccess }: { onSuccess: () => void }) => {
  const { mutate } = useMutation({
    mutationFn: postLike,
    onSuccess,
  });
  return { doLikeMutate: mutate };
};

/**
 * 상세 이슈 도움돼요 삭제 훅
 */
export const useDeletePostLike = ({ onSuccess }: { onSuccess: () => void }) => {
  const { mutate } = useMutation({
    mutationFn: deletePostLike,
    onSuccess,
  });
  return { deleteLikeMutate: mutate };
};
