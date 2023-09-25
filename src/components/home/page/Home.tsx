import { Pressable, Text, View } from 'react-native';

import { SEARCH_NAVIGATION, SUBWAY_SEARCH } from '@/constants/navigation';
import { useRootNavigation } from '@/navigation/RootNavigation';

const Home = () => {
  const rootNavigation = useRootNavigation();

  const navigateSubwaySearch = () => {
    rootNavigation.push(SEARCH_NAVIGATION, { screen: SUBWAY_SEARCH });
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
