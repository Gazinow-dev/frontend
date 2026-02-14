import { useAppSelect } from '@/store';
import { useCallback, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FontText } from '@/global/ui';
import { IconHeart, IconComment as IconComment } from '@/assets/icons';
import { deletePostLike, postLike } from '../api/func';
import { useMutation, useQueryClient } from 'react-query';
import { IssueGet } from '@/global/apis/entity';

dayjs.locale('ko');
dayjs.extend(relativeTime);

interface Props {
  issueData: IssueGet;
  setIsOpenLoginModal: (value: boolean) => void;
}

const IssueContent = ({ issueData, setIsOpenLoginModal }: Props) => {
  const { title, content, like, likeCount, commentCount, id } = issueData;

  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);

  const queryClient = useQueryClient();

  const [isOpenModalReportWrongInfo, setIsOpenModalReportWrongInfo] = useState<boolean>(false);

  const { mutate: doLikeMutate } = useMutation(postLike, {
    onSuccess: () => {
      queryClient.invalidateQueries('issue');
      queryClient.invalidateQueries('getAllIssues');
      queryClient.invalidateQueries('getIssuesByLane');
      queryClient.invalidateQueries('getPopularIssues');
    },
  });

  const { mutate: deleteLikeMutate } = useMutation(deletePostLike, {
    onSuccess: () => {
      queryClient.invalidateQueries('issue');
      queryClient.invalidateQueries('getAllIssues');
      queryClient.invalidateQueries('getIssuesByLane');
      queryClient.invalidateQueries('getPopularIssues');
    },
  });

  const likeHandler = useCallback(
    debounce(() => {
      if (!issueData) return;
      if (isVerifiedUser !== 'success auth') setIsOpenLoginModal(true);
      else if (like) deleteLikeMutate(id);
      else doLikeMutate(id);
    }, 300),
    [issueData, isVerifiedUser],
  );

  const reportWrongInfoHandler = () => {
    if (isVerifiedUser === 'success auth') setIsOpenModalReportWrongInfo(true);
    else setIsOpenLoginModal(true);
  };

  const startIssueDate = dayjs(issueData?.startDate).fromNow();

  if (!issueData) return null;
  return (
    <View>
      {/* <ModalReportWrongInfo
        isVisible={isOpenModalReportWrongInfo}
        onCancel={() => setIsOpenModalReportWrongInfo(false)}
      /> */}

      <View className="px-16">
        <FontText text={startIssueDate} className="mb-12 mt-16 text-14 text-gray-999" />
        <FontText text={title} className="text-20 leading-26" fontWeight="500" />
        <View className="my-28 h-1 bg-gray-beb" />
        <FontText text={content} className="leading-25 text-black" />
        <View className="h-28" />

        <View className="flex-row justify-between py-8">
          <View className="flex-row space-x-8">
            <TouchableOpacity
              className={'w-64 flex-row space-x-4 ' + (Platform.OS === 'ios' ? 'items-center' : '')}
              onPress={likeHandler}
              activeOpacity={0.5}
              hitSlop={30}
            >
              <IconHeart color={like ? '#EB5147' : '#D1D6DB'} />
              <FontText text={'' + likeCount} className="text-13 text-gray-999" />
            </TouchableOpacity>
            <View
              className={'w-64 flex-row space-x-4 ' + (Platform.OS === 'ios' ? 'items-center' : '')}
            >
              <IconComment />
              <FontText text={'' + commentCount} className="text-13 text-gray-999" />
            </View>
          </View>
          {/* TODO: 다음 업데이트 때 구현 */}
          {/* <TouchableOpacity onPress={reportWrongInfoHandler} activeOpacity={0.5} hitSlop={30}>
              <FontText text="잘못된 정보 신고" className="text-14 text-gray-999 leading-21" />
            </TouchableOpacity> */}
        </View>
      </View>

      <View className="mt-12 h-16 bg-gray-9f9" />
      <View className="h-8" />
    </View>
  );
};

export default IssueContent;
