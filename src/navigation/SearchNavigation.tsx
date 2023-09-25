import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SubwaySearch } from '@/components/search/page';

const Stack = createNativeStackNavigator();

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
