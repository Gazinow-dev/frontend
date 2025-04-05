import { useMemo } from "react";
import { useGetAllIssuesQuery } from "./apis/hooks";
import { useNavigate } from "react-router-dom";

const IssuesManagement = () => {
  const navigate = useNavigate();

  const { data } = useGetAllIssuesQuery();

  const flattenedData = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) ?? [];
  }, [data]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="fixed w-full p-2 text-lg text-center bg-gray-100 border-b">
        수정할 게시글을 선택해 주세요
      </div>
      <div className="pt-12 overflow-auto">
        {flattenedData.map((item, index) => (
          <div
            className="flex flex-col p-4 border-b"
            key={index}
            onClick={() => navigate(`/admin/editIssue/${item.id}`)}
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-gray-500 line-clamp-2">{item.content}</p>
            <p className="text-sm text-gray-400">
              {item.agoTime} | {item.likeCount} Likes | {item.commentCount}{" "}
              Comments
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssuesManagement;
