export type RootStackParamList = {
  Temp: undefined;
  Login: undefined;
  MainBottomTab: undefined;
  SearchNavigation: { screen: 'SubwaySearch', route: undefined };
  EditRouteNavigation: { screen: string, params: { pathId: number } };
  MyPageNavigation: { screen: string };
};

export type EditRouteStackParamList = {
  SavedRoutesPage: undefined;
  AddNewRoutePage: undefined;
  SubwaySearch: { isBackBtn: boolean };
  SubwayPathResult: {
    departure: { name: string; line: string };
    arrival: { name: string; line: string };
  };
  SubwayPathDetail: undefined;
  NameNewRoutePage: { screen: string, params: number };
};

export type SearchStackParamList = {
  SubwaySearch: { isBackBtn: boolean };
  SubwayPathResult: {
    departure: { name: string; line: string };
    arrival: { name: string; line: string };
  };
  SubwayPathDetail: { pathId: number };
};

export type MyPageStackParamList = {
  Nickname: undefined;
  MyPage: undefined;
  ChangeNicknamePage: undefined;
  AccountManagePage: undefined;
  AlertSettingsPage: undefined;
  ChangePwPage: undefined;
  ConfirmQuitPage: undefined;
  ContractPage: undefined;
};
