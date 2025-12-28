import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import {
  changePasswordFetch,
  checkPasswordFetch,
  deleteAccountFetch,
  logoutFetch,
  changeNicknameFetch,
  checkNicknameFetch,
  getPathNotiFetch,
  getMyCommentsFetch,
} from './func';
import { AxiosError } from 'axios';

/**
 * 로그아웃 요청 훅
 */
export const useLogoutMutation = ({ onSuccess }: { onSuccess: () => void }) => {
  const { mutate: logoutMutate } = useMutation(logoutFetch, { onSuccess });
  return { logoutMutate };
};

/**
 * 회원 탈퇴 훅
 */
export const useDeleteAccountMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: AxiosError) => void;
}) => {
  const { mutate: deleteAccountMutate } = useMutation(deleteAccountFetch, { onSuccess, onError });
  return { deleteAccountMutate };
};

/**
 * 비밀번호 확인 훅
 */
export const useCheckPasswordMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { mutate: checkPasswordMutate } = useMutation(checkPasswordFetch, {
    onSuccess,
    onError,
  });
  return { checkPasswordMutate };
};

/**
 * 비밀번호 변경 훅
 */
export const useChangePasswordMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { mutate: changePasswordMutate } = useMutation(changePasswordFetch, {
    onSuccess,
    onError,
  });
  return { changePasswordMutate };
};

/**
 * 닉네임 변경 훅
 */
export const useChangeNicknameMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { mutate } = useMutation(changeNicknameFetch, {
    onSuccess,
    onError,
  });
  return { changeNicknameMutate: mutate };
};

/**
 * 닉네임 중복 검사 훅
 */
export const useCheckNicknameMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { mutate } = useMutation(checkNicknameFetch, {
    onSuccess,
    onError,
  });
  return { checkNicknameMutate: mutate };
};

/**
 * 경로별 알림 설정 불러오기 훅
 */
export const useGetPathNotiQuery = (myPathId: number) => {
  const { data } = useQuery(['getPathNoti'], () => getPathNotiFetch(myPathId));
  return { pathNotiData: data };
};

/**
 * 내가 쓴 댓글 조회 훅
 */
export const useGetMyComments = () => {
  const { data, refetch, fetchNextPage, hasNextPage, isError } = useInfiniteQuery(
    ['getMyComments'],
    ({ pageParam = 0 }) => getMyCommentsFetch({ page: pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.content && lastPage?.content.length < 15) return undefined;
        return allPages.length;
      },
    },
  );
  return {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isError,
  };
};
