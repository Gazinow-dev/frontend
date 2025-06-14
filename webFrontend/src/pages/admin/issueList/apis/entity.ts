import { IssueGet } from "@global/apis/entity";

/**
 * 페이징 처리 된 이슈 목록 (나우탭) 데이터
 */
export type AllIssues = Pagination<IssueGet>;

/**
 * 페이징 처리 된 데이터 응답 형식
 */
export interface Pagination<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
