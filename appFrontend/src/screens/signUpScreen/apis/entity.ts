export interface SignUpResponse {
  email: string;
  nickName: string;
  accessToken: string;
  refreshToken: string;
  memberId: number;
}

export interface SignUpParams {
  email: string;
  password: string;
  nickname: string;
}
