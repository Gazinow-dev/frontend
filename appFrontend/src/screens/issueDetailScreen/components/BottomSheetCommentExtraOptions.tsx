import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, Animated, TouchableOpacity, View, Easing } from 'react-native';
import { FontText } from '@/global/ui';
import { showToast } from '@/global/utils/toast';
import MyTabModal from '@/global/components/MyTabModal';
import { CommentContent } from '@/global/apis/entity';
import { useMutation, useQueryClient } from 'react-query';
import { deleteComment } from '../api/func';
import { useAppSelect } from '@/store';

interface Props {
  isVisible: boolean;
  onCancel: () => void;
  commentDetail: CommentContent;
  setIsOpenModalReportComment: (value: boolean) => void;
  setIsOpenLoginModal: (value: boolean) => void;
}

const BottomSheetCommentExtraOptions = ({
  isVisible,
  onCancel,
  commentDetail,
  setIsOpenModalReportComment,
  setIsOpenLoginModal,
}: Props) => {
  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);
  const queryClient = useQueryClient();
  const { issueCommentId, mine } = commentDetail;
  const [isOpenDeleteCommentModal, setIsOpenDeleteCommentModal] = useState<boolean>(false);

  const { mutate: deleteCommentMutate } = useMutation(deleteComment, {
    onSuccess: async () => {
      queryClient.invalidateQueries('getCommentsOnAIssue');
      queryClient.invalidateQueries('getMyComments');
      queryClient.invalidateQueries('getAllIssues');
      queryClient.invalidateQueries('getIssuesByLane');
      queryClient.invalidateQueries('getPopularIssues');
      showToast('commentDeleted');
    },
  });

  // ... 버튼 클릭 핸들러
  const showMoreMenuHandler = () => {
    if (mine) {
      setIsOpenDeleteCommentModal(true);
    } else {
      onCancel();
      if (isVerifiedUser === 'success auth') {
        setIsOpenModalReportComment(true);
      } else setIsOpenLoginModal(true);
    }
  };

  // 댓글 삭제 팝업 핸들러
  const deleteCommentConfirmHandler = () => {
    deleteCommentMutate(issueCommentId);
    onCancel();
  };
  const deleteCommentCancelHandler = () => {
    setIsOpenDeleteCommentModal(false);
    onCancel();
  };

  // 바텀시트 애니메이션
  const translateY = useRef(new Animated.Value(300)).current;
  useEffect(() => {
    const animation = Animated.timing(translateY, {
      toValue: isVisible ? 0 : 300,
      duration: 300,
      easing: isVisible ? Easing.out(Easing.ease) : Easing.in(Easing.ease),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [isVisible]);

  return (
    <Modal visible={isVisible} onRequestClose={onCancel}>
      <MyTabModal
        isVisible={isOpenDeleteCommentModal}
        title="댓글을 삭제할까요?"
        confirmText="삭제"
        onConfirm={deleteCommentConfirmHandler}
        cancelText="취소"
        onCancel={deleteCommentCancelHandler}
      />

      <Pressable className="flex-1 bg-[#666666]" onPress={onCancel}>
        <Animated.View
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-14"
          style={{ transform: [{ translateY }] }}
        >
          <Pressable>
            <TouchableOpacity className="items-center h-32" onPress={onCancel}>
              <View className="h-4 top-12 w-34 rounded-2 bg-gray-ddd" />
            </TouchableOpacity>
            <TouchableOpacity className="px-16 py-12 mt-8 mb-64" onPress={showMoreMenuHandler}>
              <FontText text={mine ? '삭제하기' : '신고하기'} fontWeight="500" />
            </TouchableOpacity>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};
export default BottomSheetCommentExtraOptions;
