import { Pressable, Text, View } from 'react-native';

import { useRootNavigation } from '@/navigation/RootNavigation';

const Home = () => {
  const rootNavigation = useRootNavigation();

  const navigateSubwaySearch = () => {
    rootNavigation.push('SearchNavigation', { screen: 'SubwaySearch' });
  };

  return (
    <View>
      <Text>홈 페이지</Text>
      <Pressable onPress={navigateSubwaySearch}>
        <Text>지하철검색 페이지 이동</Text>
      </Pressable>
    </View>
  );
};

export default Home;
