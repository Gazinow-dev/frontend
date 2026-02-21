import { useParams } from "react-router-dom";
import { useDeletePostLike, usePostLike } from "./api/hooks";

import IconThumsUp from "@assets/icons/thumbs_up.svg?react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import color from "@global/constants/color";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import cn from "classnames";
import localStorageFunc from "@global/utils/localStorage";
import { STORAGE_ACCESS_KEY } from "@global/constants";
import { useQuery } from "@tanstack/react-query";
import { getIssueDetail } from "@global/apis/func";

dayjs.locale("ko");
dayjs.extend(relativeTime);

const IssueDetailPage = () => {
  const { id } = useParams() as { id: string };
  const storageAccessToken = localStorageFunc.get<string>(STORAGE_ACCESS_KEY);

  // TODO: MVP에서 빠짐
  // const [isOpenModal, setIsOpenModal] = useState<boolean>(true);
  // const closeModal = () => setIsOpenModal(false);

  const [token, setToken] = useState<string>("");

  const {
    data: issueData,
    isLoading: isLoadingIssue,
    refetch: refetchIssue,
  } = useQuery({
    queryKey: ["issue", id],
    queryFn: () => getIssueDetail({ id }),
    enabled: (!!storageAccessToken && !!id) || (!!token && !!id),
  });

  const { doLikeMutate } = usePostLike({ onSuccess: refetchIssue });
  const { deleteLikeMutate } = useDeletePostLike({ onSuccess: refetchIssue });

  const likeHandler = useMemo(
    () =>
      debounce(() => {
        if (!issueData) return;
        if (issueData.like) deleteLikeMutate(issueData.id);
        else doLikeMutate(issueData.id);
      }, 300),
    [issueData]
  );

  const createIssueDate = dayjs(issueData?.startDate).fromNow();

  const onMessageEvent = (e: MessageEvent) => {
    e.stopPropagation();
    const accessToken = String(e.data);
    if (!!accessToken) {
      localStorageFunc.set(STORAGE_ACCESS_KEY, accessToken);
      setToken(accessToken);
    }
  };

  useEffect(() => {
    window.addEventListener("message", onMessageEvent);
  });

  // TODO: 개발 시 주석 해제
  // if (!issueData && !isLoadingIssue) {
  //   return (
  //     <p>
  //       이슈 불러오기 실패
  //       <br />
  //       id: {id}
  //       <br />
  //       storageAccessToken: {storageAccessToken}
  //       <br />
  //       accessToken: {accessToken}
  //     </p>
  //   );
  // }
  if (isLoadingIssue) {
    return <div className="bg-[#F9F9F9] w-screen h-screen"></div>;
  }
  return (
    <div className="relative bg-[#F9F9F9]">
      <section className="h-screen px-4 overflow-y-auto">
        <header className="mb-5">
          <h1 className="mb-1 text-xl font-semibold">{issueData?.title}</h1>
          <p className="text-xs">{createIssueDate}</p>
        </header>

        <article className="py-6 border-y border-gray-beb">
          <p className="text-sm whitespace-pre-wrap text-real-black">
            {issueData?.content}
          </p>
        </article>

        <footer className="pt-[17px] flex justify-between">
          <button className="flex items-center" onClick={likeHandler}>
            <p
              className={cn("text-xs font-medium mr-[5px]", {
                "text-blue": issueData?.like,
                "text-gray-999": !issueData?.like,
              })}
            >
              도움돼요
            </p>
            <div className="mr-px">
              <IconThumsUp
                color={issueData?.like ? color.BLUE : color.GRAY99}
                width={15}
                height={15}
              />
            </div>
            <p
              className={cn("text-xs font-medium mt-[0.5px]", {
                "text-blue": issueData?.like,
                "text-gray-999": !issueData?.like,
              })}
            >
              {issueData?.likeCount}
            </p>
          </button>
          {/* TODO: MVP에서 빠짐 */}
          {/* <button>
            <p className="text-xs font-medium text-gray-999">잘못된 정보 신고</p>
          </button> */}
        </footer>
      </section>
      {/* {isOpenModal && <WrongInfoModal closeModal={closeModal} />} */}
    </div>
  );
};

export default IssueDetailPage;
