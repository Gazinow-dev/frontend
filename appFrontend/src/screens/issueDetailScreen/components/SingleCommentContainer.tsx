import { FontText } from '@/global/ui';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useMemo, useState } from 'react';
import ModalReportComment from './ModalReportComment';
import IconHeart from '@assets/icons/icon-heart-mono.svg';
import BottomSheetCommentExtraOptions from './BottomSheetCommentExtraOptions';
import { debounce } from 'lodash';
import { CommentContent } from '@/global/apis/entity';
import { useMutation, useQueryClient } from 'react-query';
import { deleteCommentLike, postCommentLike } from '../api/func';
import { useAppSelect } from '@/store';

interface CommentProps {
  item: CommentContent;
  setIsOpenLoginModal: (value: boolean) => void;
}

const SingleCommentContainer = ({ item, setIsOpenLoginModal }: CommentProps) => {
  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);
  const queryClient = useQueryClient();
  const { issueCommentContent, createdBy, agoTime, likesCount, liked, issueCommentId } = item;
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState<boolean>(false);
  const [isOpenModalReportComment, setIsOpenModalReportComment] = useState<boolean>(false);

  const { mutate: doLikeCommentMutate } = useMutation(postCommentLike, {
    onSuccess: () => queryClient.invalidateQueries('getCommentsOnAIssue'),
  });

  const { mutate: deleteCommentLikeMutate } = useMutation(deleteCommentLike, {
    onSuccess: () => queryClient.invalidateQueries('getCommentsOnAIssue'),
  });

  const commentLikeHandler = useMemo(
    () =>
      debounce(() => {
        if (isVerifiedUser !== 'success auth') setIsOpenLoginModal(true);
        else if (liked) deleteCommentLikeMutate(issueCommentId);
        else doLikeCommentMutate(issueCommentId);
      }, 300),
    [isVerifiedUser, liked],
  );

  return (
    <View className="px-16 mt-36">
      <BottomSheetCommentExtraOptions
        commentDetail={item}
        setIsOpenModalReportComment={setIsOpenModalReportComment}
        setIsOpenLoginModal={setIsOpenLoginModal}
        isVisible={isOpenBottomSheet}
        onCancel={() => setIsOpenBottomSheet(false)}
      />

      <ModalReportComment
        isVisible={isOpenModalReportComment}
        onCancel={() => setIsOpenModalReportComment(false)}
        issueCommentId={issueCommentId}
      />

      <View className="flex-row items-center mb-4 space-x-4">
        <FontText text={createdBy} className="text-[#6D7582] text-13 leading-19" fontWeight="500" />
        <View className="bg-[#6D7582] w-2 h-2 rounded-full" />
        <FontText text={agoTime} className="text-gray-999 text-13 leading-19" />
      </View>

      <FontText text={issueCommentContent} className="leading-24" />

      <View className="flex-row justify-between mt-12">
        <TouchableOpacity
          className={'flex-row w-64 space-x-4 ' + (Platform.OS === 'ios' ? 'items-center' : '')}
          onPress={commentLikeHandler}
          activeOpacity={0.5}
          hitSlop={30}
        >
          <IconHeart color={liked ? '#EB5147' : '#D1D6DB'} />
          <FontText text={'' + likesCount} className="text-13 leading-19 text-gray-999" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center space-x-3"
          hitSlop={20}
          onPress={() => setIsOpenBottomSheet(true)}
        >
          <View className="bg-[#D1D6DB] w-3 h-3 rounded-full" />
          <View className="bg-[#D1D6DB] w-3 h-3 rounded-full" />
          <View className="bg-[#D1D6DB] w-3 h-3 rounded-full" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SingleCommentContainer;
