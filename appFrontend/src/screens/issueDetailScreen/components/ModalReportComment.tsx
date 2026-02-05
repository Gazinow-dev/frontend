import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import ReportReasonContainer from './ReportReasonContainer';
import cn from 'classname';
import { useMutation, useQueryClient } from 'react-query';
import { reportComment } from '../api/func';
import { showToast } from '@/global/utils/toast';
import { AxiosError } from 'axios';
import { CommentReportReasonType, CommentReportType } from '../api/entity';

const commentReportReason = [
  {
    reason: 'INAPPROPRIATE_LANGUAGE',
    text: '음란성 댓글, 비속어, 폭언, 비하 등 불쾌한 내용을 포함하고 있어요',
  },
  {
    reason: 'MISLEADING_INFORMATION',
    text: '갈등을 조장하거나 허위 사실을 퍼뜨려 혼란을 줄 수 있어요',
  },
  {
    reason: 'INAPPROPRIATE_CONTENT',
    text: '도배나 개인정보 노출 등 커뮤니티 목적에 맞지 않는 댓글이에요',
  },
  { reason: 'OTHER', text: '기타 (신고 사유 입력)' },
];

interface Props {
  isVisible: boolean;
  onCancel: () => void;
  issueCommentId: number;
}

const ModalReportComment = ({ isVisible, onCancel, issueCommentId }: Props) => {
  const queryClient = useQueryClient();
  const [selectedReason, setSelectedReason] = useState<CommentReportReasonType | null>(null);
  const [reasonDescription, setReasonDescription] = useState<string>('');

  const { mutate: reportCommentMutate } = useMutation(reportComment, {
    onSuccess: () => {
      showToast('reportSuccess');
      queryClient.invalidateQueries('getCommentsOnAIssue');
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        showToast('alreadyReported');
      }
    },
  });

  const handleCancel = () => {
    onCancel();
    setSelectedReason(null);
    setReasonDescription('');
  };

  const handleConfirm = ({ reportedCommentId, reason }: CommentReportType) => {
    if (reason === 'OTHER') {
      reportCommentMutate({ reportedCommentId, reason, reasonDescription });
    } else {
      reportCommentMutate({ reportedCommentId, reason });
    }
    handleCancel();
  };

  return (
    <Modal animationType="fade" transparent visible={isVisible} onRequestClose={handleCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 items-center justify-center bg-[#00000060]"
      >
        <View className="w-[81%] space-y-24 rounded-12 bg-white px-24 py-28">
          <FontText text="댓글 신고" className="text-center text-18" fontWeight="600" />

          <View>
            {commentReportReason.map(({ reason, text }, index) => (
              <ReportReasonContainer
                key={reason}
                reason={reason}
                text={text}
                isSelected={selectedReason === reason}
                onSelect={() => setSelectedReason(reason as CommentReportReasonType)}
                isFirstReason={index === 0}
              />
            ))}
          </View>

          <View>
            <View className="mb-10 mt-[-10px] h-64 rounded-5 bg-gray-9f9 px-12 py-11">
              <Input
                className={cn(Platform.OS === 'ios' ? 'text-14' : 'top-[-6px] text-14', {
                  'text-gray-d7d': selectedReason !== 'OTHER',
                })}
                value={reasonDescription}
                onChangeText={(text) => setReasonDescription(text)}
                onFocus={() => setSelectedReason('OTHER')}
                multiline
                maxLength={100}
                hitSlop={{ bottom: 30 }}
                placeholder="신고 사유를 자세히 알려주세요"
                placeholderTextColor={COLOR.GRAY_999}
              />
            </View>
            <FontText
              text={`${reasonDescription.length}/100`}
              className="text-right text-12 leading-14 text-gray-999"
              fontWeight="500"
            />
          </View>

          <View className="flex-row space-x-8">
            <TouchableOpacity
              className="items-center flex-1 p-12 rounded-5 border-1 border-gray-999"
              onPress={handleCancel}
            >
              <FontText text="취소" className="text-14 leading-21 text-gray-999" fontWeight="600" />
            </TouchableOpacity>
            <TouchableOpacity
              className={cn('flex-1 items-center rounded-5 bg-gray-ddd p-12', {
                'bg-black-717':
                  selectedReason &&
                  (selectedReason !== 'OTHER' || (selectedReason === 'OTHER' && reasonDescription)),
              })}
              onPress={() =>
                handleConfirm({
                  reportedCommentId: issueCommentId,
                  reason: selectedReason ?? 'INAPPROPRIATE_CONTENT',
                })
              }
              disabled={!selectedReason || (selectedReason === 'OTHER' && !reasonDescription)}
            >
              <FontText text="확인" className="text-white text-14 leading-21" fontWeight="600" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalReportComment;
