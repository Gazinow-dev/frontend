import { useState } from 'react';
import { View } from 'react-native';

import { Input, NormalText, TextButton } from '@/components/common';
import { MAIN_BOTTOM_TAB } from '@/constants/navigation';
import { useLoginMutation } from '@/hooks/queries';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useAppDispatch } from '@/store';
import { getAccessToken } from '@/store/modules';

const initialFormState = {
  email: '',
  password: '',
};

const Login = () => {
  const dispatch = useAppDispatch();
  const rootNavigation = useRootNavigation();

  const [form, setForm] = useState(initialFormState);

  const { isLoading, mutate: loginFetching } = useLoginMutation();

  const changeFormText = (type: 'email' | 'password', text: string) => {
    setForm((prev) => ({ ...prev, [type]: text }));
  };

  const loginSuccessHandler = (accessToken: string) => {
    dispatch(getAccessToken(accessToken));
    rootNavigation.navigate(MAIN_BOTTOM_TAB);
  };

  const submitForm = () => {
    loginFetching(form, {
      onSuccess: ({ data }) => {
        const { accessToken } = data;
        loginSuccessHandler(accessToken);
      },
      onError: (error) => {
        // debug
        console.error('Login fetching error ', error);
      },
    });
  };

  return (
    <View>
      <Input
        placeholder="이메일을 입력해주세요"
        value={form.email}
        onChangeText={(text) => changeFormText('email', text)}
        inputMode="email"
      />
      <Input
        placeholder="비밀번호를 입력해주세요"
        value={form.password}
        onChangeText={(text) => changeFormText('password', text)}
        secureTextEntry
      />
      <TextButton value="로그인" onPress={submitForm} />

      {isLoading && <NormalText value="로딩중" />}
    </View>
  );
};

export default Login;
