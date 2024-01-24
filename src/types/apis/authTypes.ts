export interface LoginFormTypes {
  email: string;
  password: string;
}

export interface LoginFetchResponse {
  grantType: 'Bearer';
  memberId: number;
  nickName: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpirationTime: number;
  refreshTokenExpirationTime: number;
  notificationByKeyword: boolean;
  notificationByRepost: boolean;
  notificationByLike: boolean;
  firebaseToken: boolean;
}

export interface LogoutFetchData {
  accessToken: string;
  refreshToken: string;
}