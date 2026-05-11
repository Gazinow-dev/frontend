import { IssueKeywords, RawSubwayLineName } from '@global/apis/entity';

/**
 * 이슈 댓글 등록
 */
export interface PostCommentType {
  issueCommentContent: string;
  issueId: number;
}

/**
 * 이슈 댓글 신고 사유
 */
export type CommentReportReasonType =
  | 'INAPPROPRIATE_LANGUAGE'
  | 'MISLEADING_INFORMATION'
  | 'INAPPROPRIATE_CONTENT'
  | 'OTHER';

/**
 * 이슈 댓글 신고
 */
export interface CommentReportType {
  reportedCommentId: number;
  reason: CommentReportReasonType;
  reasonDescription?: string;
}

/**
 * 이슈 본문 신고 사유
 */
export type IssueReportReasonType = '이미 끝난 이슈예요' | '잘못된 정보예요';

/**
 * 이슈 본문 신고
 */
export interface IssueReportType {
  issueId: number;
  reason: IssueReportReasonType;
  reasonDescription?: string;
}
