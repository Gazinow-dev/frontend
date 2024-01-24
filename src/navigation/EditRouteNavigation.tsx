import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackNavigationProp } from '@react-navigation/stack';

import { EditRouteStackParamList } from '@/types/navigation';
import { SavedRoutesPage, AddNewRoutePage, SelectNewRoutePage, NameNewRoutePage } from '@/pages/savedRoutes';
import { COLOR, SAVED_ROUTES_PAGE, ADD_NEW_ROUTE_PAGE, SUBWAY_SEARCH, SUBWAY_PATH_RESULT } from '@/constants';
import { SearchPathResultDetail, SubwaySearchPage } from '@/pages/search';
import { NAME_NEW_ROUTE_PAGE, SUBWAY_PATH_DETAIL } from '@/constants/navigation';
import { IconButton } from '@/components/common/molecules';
import styled from '@emotion/native';

const Stack = createStackNavigator<EditRouteStackParamList>();

const screenOption = {
  headerShown: true,
  headerTintColor: COLOR.BASIC_BLACK,
  headerTitleStyle: { fontWeight: 'semibold', fontSize: 20 },
  title: '새 경로 저장',
  headerTitleAlign: 'center',
};

const renderHeader = (navigation: StackNavigationProp<EditRouteStackParamList, keyof EditRouteStackParamList>) => ({
  headerLeft: () => (
    <HeaderLeft>
      <IconButton
        isFontIcon={false}
        imagePath="backBtn"
        iconWidth="27px"
        iconHeight="20px"
        onPress={() => navigation.goBack()}
      />
    </HeaderLeft>
  ),
  headerRight: () => (
    <HeaderRight>
      <IconButton
        isFontIcon={false}
        imagePath="x"
        iconWidth="27px"
        iconHeight="20px"
        onPress={() => navigation.popToTop()}
      />
    </HeaderRight>
  )
});

const renderHeaderLeft = (navigation: StackNavigationProp<EditRouteStackParamList, keyof EditRouteStackParamList>) => ({
  title: '저장한 경로',
  headerTitleAlign: 'left',
  headerStyle: { backgroundColor: COLOR.LIGHT_GRAY },
  headerLeft: () => (
    <HeaderLeft>
      <IconButton
        isFontIcon={false}
        imagePath="backBtn"
        iconWidth="27px"
        iconHeight="20px"
        onPress={() => navigation.goBack()}
      />
    </HeaderLeft>
  ),
});

const EditRouteNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOption}>
      <Stack.Screen name={SAVED_ROUTES_PAGE} component={SavedRoutesPage} options={({ navigation }) => renderHeaderLeft(navigation)} />
      <Stack.Screen name={ADD_NEW_ROUTE_PAGE} component={AddNewRoutePage} options={({ navigation }) => renderHeader(navigation)} />
      <Stack.Screen name={SUBWAY_SEARCH} component={SubwaySearchPage} options={({ navigation }) => renderHeader(navigation)} initialParams={{ isBackBtn: false }} />
      <Stack.Screen name={SUBWAY_PATH_RESULT} component={SelectNewRoutePage} options={({ navigation }) => renderHeader(navigation)} />
      <Stack.Screen name={SUBWAY_PATH_DETAIL} component={SearchPathResultDetail} options={{ headerShown: false }} />
      <Stack.Screen name={NAME_NEW_ROUTE_PAGE} component={NameNewRoutePage} options={({ navigation }) => renderHeader(navigation)} />
    </Stack.Navigator>
  );
};

export default EditRouteNavigation;

const HeaderLeft = styled.View`
  margin-left: 10px;
  flex-direction: row;
`;

const HeaderRight = styled.View`
  margin-right: 10px;
  flex-direction: row;
`;

export const useEditRouteNavigation = <RouteName extends keyof EditRouteStackParamList>() => {
  return useNavigation<StackNavigationProp<EditRouteStackParamList, RouteName>>();
};
