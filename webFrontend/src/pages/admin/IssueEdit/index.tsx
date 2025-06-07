import {
  ISSUE_KEYWORDS,
  IssueGet,
  IssueKeywords,
  RawSubwayLineName,
  STATION_LINE,
} from "@global/apis/entity";
import { STORAGE_ACCESS_KEY } from "@global/constants";
import localStorageFunc from "@global/utils/localStorage";
import { useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetStationsByLine } from "./apis/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editIssue } from "./apis/func";
import { EditIssueBody } from "./apis/entity";
import { getIssueDetail } from "@global/apis/func";

type Action =
  | { type: "INIT"; payload: IssueGet }
  | { type: "TITLE"; payload: string }
  | { type: "CONTENT"; payload: string }
  | { type: "START-DATE"; payload: string }
  | { type: "EXPIRE-DATE"; payload: string }
  | { type: "KEYWORD"; payload: IssueKeywords }
  | { type: "DELETE-LINE"; payload: RawSubwayLineName }
  | { type: "ADD-LINE"; payload: RawSubwayLineName }
  | {
      type: "SET-START-STATION";
      payload: { line: RawSubwayLineName; stationCode: number };
    }
  | {
      type: "SET-END-STATION";
      payload: { line: RawSubwayLineName; stationCode: number };
    };

const reducer = (editedIssue: EditIssueBody, { type, payload }: Action) => {
  switch (type) {
    case "INIT":
      return editedIssue;
    case "TITLE":
      return { ...editedIssue, title: payload };
    case "CONTENT":
      return { ...editedIssue, content: payload };
    case "START-DATE":
      return { ...editedIssue, startDate: payload };
    case "EXPIRE-DATE":
      return { ...editedIssue, expireDate: payload };
    case "KEYWORD":
      return { ...editedIssue, keyword: payload };
    case "DELETE-LINE":
      return {
        ...editedIssue,
        issueUpdateStationList: editedIssue.issueUpdateStationList.filter(
          (item) => item.line !== payload
        ),
      };
    case "ADD-LINE":
      return {
        ...editedIssue,
        issueUpdateStationList: [
          ...editedIssue.issueUpdateStationList,
          { line: payload, startStationCode: 0, endStationCode: 0 },
        ],
      };
    case "SET-START-STATION":
    case "SET-END-STATION":
      return {
        ...editedIssue,
        issueUpdateStationList: editedIssue.issueUpdateStationList.map((item) =>
          item.line === payload.line
            ? {
                ...item,
                ...(type === "SET-START-STATION"
                  ? { startStationCode: payload.stationCode }
                  : { endStationCode: payload.stationCode }),
              }
            : item
        ),
      };
    default:
      return editedIssue;
  }
};

const AdminIssueEditPage = () => {
  const navigate = useNavigate();

  const { id } = useParams() as { id: string };

  const storageAccessToken = localStorageFunc.get<string>(STORAGE_ACCESS_KEY);

  useEffect(() => {
    if (!storageAccessToken) {
      navigate("/admin/login");
    }
  }, [storageAccessToken, navigate]);

  const { data: issueData } = useQuery({
    queryKey: ["issue", id],
    queryFn: () => getIssueDetail({ id }),
    enabled: !!storageAccessToken && !!id,
  });

  const { title, content, startDate, expireDate, keyword } = issueData || {};

  const [editedIssue, dispatch] = useReducer(
    reducer,
    issueData,
    (issueData) =>
      ({
        ...issueData,
        issueUpdateStationList: Array.from(
          (issueData?.stationDtos || []).reduce(
            (map, { line, issueStationCode }) => {
              return map.set(line, [
                ...(map.get(line) || []),
                issueStationCode,
              ]);
            },
            new Map()
          )
        ).map(([line, stations]) => ({
          line,
          startStationCode: stations[0],
          endStationCode: stations.at(-1),
        })),
      } as EditIssueBody)
  );

  useEffect(() => {
    if (issueData) dispatch({ type: "INIT", payload: issueData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedLine, setSelectedLine] =
    useState<RawSubwayLineName>("수도권 1호선");

  const { stationsByLinedata } = useGetStationsByLine(selectedLine);

  const { mutate } = useMutation({
    mutationFn: editIssue,
    onSuccess: () => {
      alert("수정 완료");
      navigate(`/admin/issue/${issueData?.id}`);
    },
    onError: () => alert("수정 실패"),
  });

  const handleSave = () => mutate({ data: editedIssue });

  const filteredLines = STATION_LINE.filter(
    (line) =>
      !editedIssue.issueUpdateStationList
        .map((item) => item.line)
        .includes(line)
  );

  const sortedIssueStations = useMemo(
    () =>
      issueData?.stationDtos
        ? [...issueData.stationDtos].sort((a, b) => {
            if (!a.line || !b.line) return 0;
            const lineCompare = a.line.localeCompare(b.line, "ko");
            if (lineCompare !== 0) return lineCompare;
            return a.issueStationCode - b.issueStationCode;
          })
        : [],
    [issueData?.stationDtos]
  );

  const handleNavigateWithConfirm = (destination: string) => {
    const confirmed = window.confirm(
      "현재 수정 중인 내용이 사라집니다. 계속하시겠어요?"
    );
    if (confirmed) navigate(destination);
  };

  const goBackToIssueList = () => {
    handleNavigateWithConfirm("/admin/issueList");
  };

  const cancelBtnHandler = () => {
    handleNavigateWithConfirm(`/admin/issue/${id}`);
  };

  if (!issueData) return null;

  return (
    <div className="max-w-2xl min-h-screen px-4 mx-auto bg-white sm:px-8 pb-28">
      <button
        className="sticky top-0 w-full py-4 mb-4 text-indigo-600 bg-white text-start hover:underline"
        onClick={goBackToIssueList}
      >
        ← 목록으로
      </button>

      <h1 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
        이슈 수정
      </h1>

      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          제목
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 text-sm border rounded-lg"
          defaultValue={title}
          onChange={(e) => dispatch({ type: "TITLE", payload: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          내용
        </label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm min-h-[120px] resize-y"
          defaultValue={content}
          onChange={(e) =>
            dispatch({ type: "CONTENT", payload: e.target.value })
          }
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          시작일시
        </label>
        <input
          type="datetime-local"
          className="w-full px-3 py-2 text-sm border rounded-lg"
          defaultValue={startDate}
          onChange={(e) =>
            dispatch({ type: "START-DATE", payload: e.target.value })
          }
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          종료일시
        </label>
        <input
          type="datetime-local"
          className="w-full px-3 py-2 text-sm border rounded-lg"
          defaultValue={expireDate}
          onChange={(e) =>
            dispatch({ type: "EXPIRE-DATE", payload: e.target.value })
          }
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          키워드
        </label>
        <select
          defaultValue={keyword}
          onChange={(e) =>
            dispatch({
              type: "KEYWORD",
              payload: e.target.value as IssueKeywords,
            })
          }
          className="px-2 py-1 text-sm text-gray-800 bg-gray-200 rounded-full"
        >
          <option value="">키워드를 선택하세요</option>
          {ISSUE_KEYWORDS?.map((keyword) => (
            <option key={keyword} value={keyword}>
              {keyword}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          노선
        </label>

        <ul className="space-y-4">
          {editedIssue.issueUpdateStationList.map(({ line }, idx) => (
            <li
              key={`${line}_${idx}`}
              className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0"
            >
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() =>
                    dispatch({ type: "DELETE-LINE", payload: line })
                  }
                  className="text-xs text-gray-500 bg-gray-100 rounded-full w-7 h-7 hover:bg-red-200"
                >
                  X
                </button>
                <span className="text-sm text-gray-800">{line}</span>
              </div>

              <select
                onClick={() => setSelectedLine(line)}
                onChange={(e) =>
                  dispatch({
                    type: "SET-START-STATION",
                    payload: { line, stationCode: +e.target.value },
                  })
                }
                className="block w-full px-2 py-1 text-sm text-gray-800 bg-gray-100 rounded-full md:w-auto"
              >
                <option value="">
                  {editedIssue.issueUpdateStationList.find(
                    (item) => item.line === line
                  )?.startStationCode ?? "출발역"}
                </option>
                {stationsByLinedata?.map((station) => (
                  <option
                    key={`${station.name}_${station.stationCode}`}
                    value={station.issueStationCode}
                  >
                    {station.name}
                  </option>
                ))}
              </select>

              <select
                onClick={() => setSelectedLine(line)}
                onChange={(e) =>
                  dispatch({
                    type: "SET-END-STATION",
                    payload: { line, stationCode: +e.target.value },
                  })
                }
                className="block w-full px-2 py-1 text-sm text-gray-800 bg-gray-100 rounded-full md:w-auto"
              >
                <option value="">
                  {editedIssue.issueUpdateStationList.find(
                    (item) => item.line === line
                  )?.endStationCode ?? "도착역"}
                </option>
                {stationsByLinedata?.map((station) => (
                  <option
                    key={`${station.name}_${station.stationCode}`}
                    value={station.issueStationCode}
                  >
                    {station.name}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>

        <select
          value=""
          onChange={(e) => {
            const value = e.target.value as RawSubwayLineName;
            setSelectedLine(value);
            dispatch({ type: "ADD-LINE", payload: value });
          }}
          className="block w-full px-2 py-1 mt-4 text-sm text-gray-800 bg-gray-200 rounded-full"
        >
          <option value="">노선을 선택하세요</option>
          {filteredLines?.map((line) => (
            <option key={line} value={line}>
              {line}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          관련 역
        </label>
        <ul className="space-y-2">
          {sortedIssueStations.map((station) => (
            <li
              key={`${station.issueStationCode}_${station.stationName}`}
              className="text-sm text-gray-800"
            >
              🚉 {station.line} - {station.stationName}
            </li>
          ))}
        </ul>
      </div>

      <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200">
        <div className="flex max-w-2xl gap-4 px-4 py-3 mx-auto sm:px-8">
          <button
            className="w-full px-4 py-2 text-white transition-colors bg-gray-400 rounded-lg hover:bg-gray-500"
            onClick={cancelBtnHandler}
          >
            취소
          </button>
          <button
            className="w-full px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminIssueEditPage;
