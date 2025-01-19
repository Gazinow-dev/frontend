import { useState } from 'react';
import { Keyboard, Pressable, TouchableOpacity, View } from 'react-native';
import { Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import IconArrowUp from '@assets/icons/up_arrow.svg';
import cn from 'classname';
import { postComment } from '../api/func';
import { useMutation, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import { useAppSelect } from '@/store';

interface CommentInputProps {
  issueId: number;
  setIsOpenLoginModal: (value: boolean) => void;
}

const CommentInput = ({ issueId, setIsOpenLoginModal }: CommentInputProps) => {
  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState<string>('');

  const { mutate: postCommentMutate } = useMutation(postComment, {
    onSuccess: () => {
      Keyboard.dismiss();
      setCommentText('');
      queryClient.invalidateQueries('getCommentsOnAIssue');
      queryClient.invalidateQueries('getMyComments');
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 403) {
        //TODO: 기획 나오면 수정
      }
    },
  });

  const handlePressInput = () => {
    if (isVerifiedUser !== 'success auth') setIsOpenLoginModal(true);
  };

  const handlePressSubmit = () => {
    postCommentMutate({ issueId: issueId!, issueCommentContent: commentText.trim() });
  };

  return (
    <View>
      <View className="h-1 bg-gray-beb" />
      <Pressable
        className="flex-row justify-between items-center max-h-83 pr-8 pl-16 rounded-12 py-10 mx-16 my-12 bg-[#F9FAFB]"
        onPress={handlePressInput}
      >
        <Input
          className="flex-1"
          multiline
          maxLength={500}
          placeholder="댓글을 입력해주세요"
          placeholderTextColor={COLOR.GRAY_BE}
          value={commentText}
          onChangeText={(text) => setCommentText(text)}
          onPressIn={handlePressInput}
          editable={isVerifiedUser === 'success auth'}
        />
        <TouchableOpacity
          disabled={!commentText}
          className={cn('items-center justify-center ml-12 rounded-full w-28 h-28 bg-gray-ddd', {
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
