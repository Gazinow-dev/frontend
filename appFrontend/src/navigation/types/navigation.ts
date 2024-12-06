import { MyRoutesType, Path, SubPath } from '@/global/apis/entity';

export type RootStackParamList = {
  AuthStack: { screen: 'Landing' };
  IssueStack: {
    screen: 'SearchStation' | 'IssueDetail';
    params?: { searchType: '출발역' | '도착역' };
  };
  MainBottomTab: { screen: 'homeStack' };
  NewRouteNavigation: { screen: 'SavedRoutes' | 'Swap' };
  MyPageNavigation: { screen: unknown };
  SubwayPathDetail: { state?: Path | SubPath[]; notificationId?: number | null };
};

export type AuthStackStackParamList = {
  Landing: undefined;
  SignIn: undefined;
  SignUp: undefined;
  SocialLogin: { socialLoginType: 'naver' | 'google' | 'apple' };
};

export type HomeStackParamList = {
  Home: undefined;
  NotiHistory: undefined;
  SubwayPathResult: undefined;
  SubwayPathDetail: { state?: Path | SubPath[]; notificationId?: number | null };
  SavedRoutes: undefined;
};

export type NewRouteStackParamList = {
  SavedRoutes: undefined;
  Swap: undefined;
  Search: undefined;
  Result: undefined;
  Detail: { state?: Path | SubPath[]; pathId?: number | null };
  Name: { state?: Path | SubPath[]; pathId?: number | null };
};

export type MyPageStackParamList = {
  MyRootScreen: undefined;
  ChangeNickNameScreen: undefined;
  ChangePwScreen: undefined;
  ConfirmPwScreen: undefined;
  ConfirmQuitScreen: undefined;
  ManageAccountScreen: undefined;
  NotiOnScreen: undefined;
  NotiSettingsScreen: undefined;
  NotiSettingsDetailScreen: { myRoutes?: MyRoutesType };
  SubscribeTermsScreen: undefined;
  PersonalTermsScreen: undefined;
};

export type IssueStackParamList = {
  SearchStation: undefined;
  IssueDetail: undefined;
};
