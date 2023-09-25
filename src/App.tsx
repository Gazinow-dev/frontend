import React from 'react';
import { SafeAreaView } from 'react-native';

import { RootNavigation } from '@/navigation';

const App = (): JSX.Element => {
  return (
    <SafeAreaView>
      <RootNavigation />
    </SafeAreaView>
  );
};

export default App;
