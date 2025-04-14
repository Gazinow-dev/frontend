import { STORAGE_ACCESS_KEY } from "@global/constants";
import localStorageFunc from "@global/utils/localStorage";
import { useGetIssue } from "@pages/issueDetail/api/hooks";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";

const AdminIssueDetailPage = () => {
  const navigate = useNavigate();

  const { id } = useParams() as { id: string };

  const storageAccessToken = localStorageFunc.get<string>(STORAGE_ACCESS_KEY);

  const { issueData } = useGetIssue({
    id,
    enabled: !!storageAccessToken && !!id,
  });

  const formatedStartDate = dayjs(issueData?.startDate).format(
    "YYYY.MM.DD HH:mm"
  );
  const formatedExpireDate = dayjs(issueData?.expireDate).format(
    "YYYY.MM.DD HH:mm"
  );

  const goToIssueList = () => navigate("/admin/issueList");

  if (!issueData) return null;

  return (
    <div className="max-w-2xl min-h-screen px-4 pb-24 mx-auto bg-white sm:px-8">
      <button
        className="sticky top-0 w-full py-4 mb-4 text-indigo-600 bg-white text-start hover:underline"
        onClick={goToIssueList}
      >
        ← 목록으로
      </button>

      <h1 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
        {issueData.title}
      </h1>

      <p className="pb-4 text-sm text-gray-500 border-b">{issueData.agoTime}</p>

      <section className="py-4 border-b">
        <p className="text-gray-800 whitespace-pre-wrap">{issueData.content}</p>
      </section>

      <section className="py-4 border-b">
        <h2 className="mb-1 text-sm font-semibold text-gray-700">기간</h2>
        <p className="text-sm text-gray-800">
          {formatedStartDate} ~ {formatedExpireDate}
        </p>
      </section>

      <section className="py-4 border-b">
        <h2 className="mb-1 text-sm font-semibold text-gray-700">키워드</h2>
        <span className="inline-block py-1 text-sm text-blue-700 bg-blue-100 rounded-full">
          {issueData.keyword}
        </span>
      </section>

      <section className="py-4 border-b">
        <h2 className="mb-1 text-sm font-semibold text-gray-700">노선</h2>
        {issueData.lines && issueData.lines.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {issueData.lines.sort().map((line) => (
              <li
                key={line}
                className="px-2 py-1 text-sm text-gray-800 bg-gray-100 rounded-full"
              >
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">노선 정보 없음</p>
        )}
      </section>

      <section className="py-4">
        <h2 className="mb-1 text-sm font-semibold text-gray-700">관련 역</h2>
        <ul className="space-y-2">
          {issueData.stationDtos.map((station) => (
            <li
              key={`${station.stationName}_${station.line}`}
              className="text-sm text-gray-800"
            >
              🚉 {station.line} - {station.stationName}
            </li>
          ))}
        </ul>
      </section>

      <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200">
        <div className="max-w-2xl px-4 py-3 mx-auto sm:px-8">
          <button
            className="w-full px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
            onClick={() => navigate(`/admin/issueEdit/${issueData?.id}`)}
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminIssueDetailPage;
