import { MyRoutesType, Path, SubPath } from '@/global/apis/entity';

export type RootStackParamList = {
  AuthStack: { screen: 'Landing' };
  IssueStack: {
    screen: 'SearchStation' | 'IssueDetail';
    params?: { searchType: '출발역' | '도착역' };
  };
  MainBottomTab: { screen: 'homeStack' };
  MyPageNavigation: {
    screen:
      | 'NotiSettingsDetailScreen'
      | 'MyRootScreen'
      | 'ChangeNickNameScreen'
      | 'MyCommentsScreen'
      | 'ChangePwScreen'
      | 'ConfirmPwScreen'
      | 'ConfirmQuitScreen'
      | 'ManageAccountScreen'
      | 'NoticeDetailScreen'
      | 'NotiOnScreen'
      | 'NotiSettingsScreen'
      | 'NoticesScreen'
      | 'SubscribeTermsScreen'
      | 'PersonalTermsScreen';
    params?: {
      myRoutes?: MyRoutesType;
      prevScreen?: 'SaveModal' | 'SaveScreen';
      noticeId?: number;
    };
  };
  OnboardingNavigation: undefined;
  SavePathNavigation: { screen: 'SavedPaths' | 'SwapStation' };
  SubwayPathDetail: { state?: Path | SubPath[]; notificationId?: number | null };
};

export type AuthStackStackParamList = {
  Landing: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  NotiHistory: undefined;
  SubwayPathResult: undefined;
  SubwayPathDetail: { state?: Path | SubPath[]; notificationId?: number | null };
  SavedPaths: undefined;
};

export type IssueStackParamList = {
  SearchStation: undefined;
  IssueDetail: undefined;
};

export type MyPageStackParamList = {
  MyRootScreen: undefined;
  ChangeNickNameScreen: undefined;
  MyCommentsScreen: undefined;
  ChangePwScreen: undefined;
  ConfirmPwScreen: undefined;
  ConfirmQuitScreen: undefined;
  ManageAccountScreen: undefined;
  NotiOnScreen: undefined;
  NotiSettingsScreen: undefined;
  NotiSettingsDetailScreen: { myRoutes?: MyRoutesType };
  NoticesScreen: undefined;
  NoticeDetailScreen: { noticeId: number };
  SubscribeTermsScreen: undefined;
  PersonalTermsScreen: undefined;
};

export type SavePathStackParamList = {
  PathName: { state?: Path | SubPath[]; pathId?: number | null };
  PathSelect: undefined;
  SavedPaths: undefined;
  StationSearch: undefined;
  SwapStation: undefined;
  PathDetail: { state?: Path | SubPath[]; pathId?: number | null };
};
