import { useMutation } from 'react-query';

import { loginFetch, logoutFetch } from '@/apis/auth';
import { LoginFetchResponse } from '@/types/apis';

export const useLoginMutation = ({
  onSuccess,
}: {
  onSuccess: (data: LoginFetchResponse) => void;
}) => {
  const { mutate: loginMutate } = useMutation(loginFetch, { onSuccess });
  return { loginMutate };
};

export const useLogoutMutation = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const { mutate: logoutMutate } = useMutation(logoutFetch, { onSuccess });
  return { logoutMutate };
};