import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllIssuesQuery } from "./apis/hooks";
import localStorageFunc from "@global/utils/localStorage";
import { STORAGE_ACCESS_KEY } from "@global/constants";

const AdminIssueListPage = () => {
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isLoading } =
    useGetAllIssuesQuery();

  const flattenedIssuesListData = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) ?? [];
  }, [data]);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const storageAccessToken = localStorageFunc.get<string>(STORAGE_ACCESS_KEY);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.3 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const navigateHandler = (id: number) => {
    if (!storageAccessToken) {
      const confirmed = window.confirm("로그인이 필요합니다.");
      if (confirmed) {
        navigate("/admin/login");
      }
    } else {
      navigate(`/admin/issue/${id}`);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        로딩 중...
      </div>
    );

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
            onClick={() => navigateHandler(issueData.id)}
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
      <div ref={loaderRef} className="h-10" />
    </div>
  );
};

export default AdminIssueListPage;
