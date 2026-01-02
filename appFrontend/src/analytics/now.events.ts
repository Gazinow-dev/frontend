import { NowScreenCapsules } from '@/global/apis/entity';
import { NOW } from '@/global/constants';
import * as Amplitude from '@amplitude/analytics-react-native';

interface IssueTrack {
  title: string;
  status: '예정' | '진행' | '종료';
  like: number;
  comments: number;
}

interface TotalIssueTrack extends IssueTrack {
  line: string;
  date: string;
}

interface CommentsTrack {
  title: string;
  text: string;
}

/**
 * 나우탭 클릭
 */
export const trackNowTabClick = () => {
  Amplitude.track(NOW.NOW_MENU_CLICK);
};

/**
 * 지금 인기 이슈 목록의 이슈 클릭
 * @param data (1)title: 이슈 제목 (2)status: 예정|진행|종료 (3)like: 좋아요 개수 (4)comments: 댓글 개수
 */
export const trackNowHotIssueClick = (data: IssueTrack) => {
  Amplitude.track(NOW.NOW_HOTISSUE_CLICK, data);
};

/**
 * 지금 인기 이슈 목록 '펼쳐보기' 클릭
 */
export const trackNowHotIssueOpen = () => {
  Amplitude.track(NOW.NOW_HOTISSUE_OPEN);
};

/**
 * 전체 이슈의 노선 캡슐 클릭
 * @param line 나우탭 노선 캡슐
 */
export const trackNowTotalIssueLine = (line: NowScreenCapsules) => {
  Amplitude.track(NOW.NOW_TOTALISSUE_LINE, { line });
};

/**
 * 전체 이슈 목록의 이슈 클릭
 * @param data (1)title: 이슈 제목 (2)status: 예정|진행|종료 (3)like: 좋아요 개수 (4)comments: 댓글 개수 (5)line: 나우탭 노선 캡슐 (6)date: 1일 전 ...
 */
export const trackNowTotalIssueClick = (data: TotalIssueTrack) => {
  Amplitude.track(NOW.NOW_TOTALISSUE_CLICK, data);
};

/**
 * 댓글 등록 완료
 * @param data (1)title: 이슈 제목 (2)text: 댓글 내용
 */
export const trackNowComments = (data: CommentsTrack) => {
  Amplitude.track(NOW.NOW_COMMENTS, data);
};
