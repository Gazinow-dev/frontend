import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllIssuesQuery } from "./apis/hooks";

const AdminIssueListPage = () => {
  const navigate = useNavigate();

  // TODO: 무한쿼리
  const { data } = useGetAllIssuesQuery();

  const flattenedIssuesListData = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) ?? [];
  }, [data]);

  return (
    <div className="min-h-screen px-4 py-6 bg-white sm:px-8">
      <div className="sticky top-0 py-2 bg-white">
        <h1 className="text-lg font-semibold text-gray-800 sm:text-xl">
          수정할 게시글을 선택해주세요
        </h1>
      </div>

      <ul className="mt-4 space-y-1">
        {flattenedIssuesListData.map((issueData) => (
          <li
            key={`${issueData.id}_${issueData.title}`}
            className="p-4 transition border rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/admin/issue/${issueData.id}`)}
          >
            <p className="text-base font-medium text-gray-900 sm:text-lg line-clamp-1">
              {issueData.title}
            </p>
            <p className="text-sm font-thin text-gray-500 sm:text-lg line-clamp-2">
              {issueData.content}
            </p>
          </li>
        ))}
      </ul>

      {/* <div
        ref={ref}
        className="flex items-center justify-center h-12 mt-10 text-sm text-gray-400"
      > */}
      {/* {isFetchingNextPage
          ? "불러오는 중..."
          : hasNextPage
          ? "스크롤하여 더 보기"
          : "모든 게시글을 불러왔습니다."} */}
      {/* </div>  */}
    </div>
  );
};

export default AdminIssueListPage;
