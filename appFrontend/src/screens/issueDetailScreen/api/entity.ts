import { IssueKeywords, RawSubwayLineName } from '@global/apis/entity';

/**
 * 상세 이슈 조회 응답
 */
export interface IssueGet {
  id: number;
  title: string;
  content: string;
  agoTime: string;
  line: string[] | null;
  like: boolean;
  likeCount: number;
  keyword: IssueKeywords;
  /**
   * @format timestamp
   */
  startDate: string;
  /**
   * @format timestamp
   */
  expireDate: string;
  stationDtos: [
    {
      line: RawSubwayLineName;
      stationName: string;
    },
  ];
}
