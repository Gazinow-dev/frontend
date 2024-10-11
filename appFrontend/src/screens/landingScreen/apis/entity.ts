/**
 * 소셜로그인폼
 */
export interface SocialLoginFormTypes {
  email: string;
  firebaseToken: string;
}

/**
 * 로그인 응답
 */
export interface SignInFetchResponse {
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