import React from 'react';
import styled from 'styled-components/native';

import { RootNavigation } from '@/navigation';

const App = (): JSX.Element => {
  return (
    <SafeArea>
      <RootNavigation />
    </SafeArea>
  );
};

export default App;

const SafeArea = styled.SafeAreaView`
  flex: 1;
`;
