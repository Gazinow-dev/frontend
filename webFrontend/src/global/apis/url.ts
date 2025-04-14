type ApiName =
  | "member_login"
  | "member_logout"
  | "member_delete_member"
  | "issue_get"
  | "member_reissue"
  | "like"
  | "get_stations_by_line"
  | "editIssue";

const apiUrls: {
  [key in ApiName]: string;
} = {
  member_login: "/api/v1/member/login",
  member_logout: "/api/v1/member/logout",
  member_delete_member: "/api/v1/member/delete_member",
  issue_get: "/api/v1/issue/get",
  member_reissue: "/api/v1/member/reissue",
  like: "/api/v1/like",
  get_stations_by_line: "/api/v1/stations",
  editIssue: "/api/v1/issue",
};

export default apiUrls;
