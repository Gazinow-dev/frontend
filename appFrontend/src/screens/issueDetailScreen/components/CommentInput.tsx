import { useState } from 'react';
import { Keyboard, Pressable, TouchableOpacity, View } from 'react-native';
import { Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import IconArrowUp from '@assets/icons/up_arrow.svg';
import cn from 'classname';
import { postComment } from '../api/func';
import { useMutation, useQueryClient } from 'react-query';
import { IssueGet } from '@/global/apis/entity';
import { useAppSelect } from '@/store';
import { showToast } from '@/global/utils/toast';
import { AxiosError } from 'axios';
import { trackNowComments } from '@/analytics/now.events';

interface CommentInputProps {
  issueData: IssueGet;
  issueId: number;
  setIsOpenLoginModal: (value: boolean) => void;
}

const CommentInput = ({ issueData, issueId, setIsOpenLoginModal }: CommentInputProps) => {
  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);
  const queryClient = useQueryClient();

  const [commentText, setCommentText] = useState<string>('');

  const isBannedUser = issueData.commentRestricted;

  const { mutate: postCommentMutate } = useMutation(postComment, {
    onSuccess: (_, provider) => {
      trackNowComments({
        title: issueData.title,
        text: provider.issueCommentContent,
      });
      Keyboard.dismiss();
      setCommentText('');
      queryClient.invalidateQueries('getCommentsOnAIssue');
      queryClient.invalidateQueries('getMyComments');
      queryClient.invalidateQueries('getAllIssues');
      queryClient.invalidateQueries('getIssuesByLane');
      queryClient.invalidateQueries('getPopularIssues');
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 422) showToast('postFailureByForbiddenWord');
      else showToast('commentPostFailed');
    },
  });

  const handlePressInput = () => {
    if (isVerifiedUser !== 'success auth') setIsOpenLoginModal(true);
  };

  const handlePressSubmit = () => {
    postCommentMutate({ issueId: issueId!, issueCommentContent: commentText.trim() });
  };

  return (
    <View className="border-t border-gray-beb">
      <Pressable
        className="mx-16 my-12 max-h-83 flex-row items-center justify-between rounded-12 bg-[#F9FAFB] py-10 pl-16 pr-8"
        onPress={handlePressInput}
      >
        <Input
          className="flex-1"
          multiline
          maxLength={500}
          placeholder={isBannedUser ? '댓글 작성이 제한되었습니다' : '댓글을 입력해주세요'}
          placeholderTextColor={COLOR.GRAY_BE}
          value={commentText}
          onChangeText={(text) => setCommentText(text)}
          onPressIn={handlePressInput}
          editable={isVerifiedUser === 'success auth' && !isBannedUser}
        />
        <TouchableOpacity
          disabled={!commentText}
          className={cn('ml-12 h-28 w-28 items-center justify-center rounded-full bg-gray-ddd', {
            'bg-light-blue': commentText,
          })}
          hitSlop={20}
          onPress={handlePressSubmit}
        >
          <IconArrowUp />
        </TouchableOpacity>
      </Pressable>
    </View>
  );
};
export default CommentInput;
