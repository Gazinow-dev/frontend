import { useMutation } from 'react-query';
import { checkNicknameFetch, emailConfirmFetch, signUpFetch } from './func';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { SignUpResponse } from './entity';

/**
 * 이메일 인증 요청 axios
 */
export const useEmailConfirm = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: AxiosError) => void;
}) => {
  const [authNumber, setAuthNumber] = useState<string>('');
  const { isError, mutate, isLoading } = useMutation(emailConfirmFetch, {
    onSuccess: (data) => {
      setAuthNumber(data);
      onSuccess();
    },
    onError,
  });

  const resetAuthNumber = () => {
    setAuthNumber('');
  };

  return { authNumber, isError, resetAuthNumber, emailConfirmMutate: mutate, isLoading };
};

/**
 * 닉네임 중복 확인 axios
 */
export const useCheckNickname = ({
  onSettled,
}: {
  onSettled: (data?: { message: string; state: 200 | 409 }, error?: AxiosError | null) => void;
}) => {
  const {
    data,
    isLoading,
    mutate: checkNicknameMutate,
  } = useMutation(checkNicknameFetch, {
    onSettled,
  });

  return { data, isLoading, checkNicknameMutate };
};

/**
 * 회원가입 axios
 */
export const useSignUp = ({ onSuccess }: { onSuccess: (data: SignUpResponse) => void }) => {
  const { mutate: signUpMutate } = useMutation(signUpFetch, {
    onSuccess,
  });

  return { signUpMutate };
};
