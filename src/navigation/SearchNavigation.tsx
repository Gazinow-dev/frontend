import { createStackNavigator } from '@react-navigation/stack';

import { SubwaySearch } from '@/components/search/page';

const Stack = createStackNavigator();

const screenOption = {
  headerShown: false,
};

const SearchNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOption}>
      <Stack.Screen name="SubwaySearch" component={SubwaySearch} />
    </Stack.Navigator>
  );
};

export default SearchNavigation;
