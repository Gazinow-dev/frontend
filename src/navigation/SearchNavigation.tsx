import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SubwaySearch } from '@/components/search/page';
import { SUBWAY_SEARCH } from '@/constants/navigation';

const Stack = createNativeStackNavigator();

const screenOption = {
  headerShown: false,
};

const SearchNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOption}>
      <Stack.Screen name={SUBWAY_SEARCH} component={SubwaySearch} />
    </Stack.Navigator>
  );
};

export default SearchNavigation;
