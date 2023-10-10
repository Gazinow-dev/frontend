import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import styled from 'styled-components/native';

import { RootNavigation } from '@/navigation';
import { store } from '@/store/store';

const queryClient = new QueryClient();

const App = (): JSX.Element => {
  return (
    <SafeArea>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RootNavigation />
        </QueryClientProvider>
      </Provider>
    </SafeArea>
  );
};

export default App;

const SafeArea = styled.SafeAreaView`
  flex: 1;
`;
