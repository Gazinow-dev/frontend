import React from 'react';
import Toast from '../ui/Toast';

export type ToastType =
  | 'logout'
  | 'quit'
  | 'deleteRoute'
  | 'saveRoute'
  | 'nickNameChanged'
  | 'socialLoginSuccess'
  | 'socialLoginFailed'
  | 'saveNotiSettingsFailed'
  | 'reportSuccess'
  | 'alreadyReported'
  | 'commentDeleted'
  | 'commentPostFailed'
  | 'postFailureByForbiddenWord'
  | 'likeActionError';

const ToastConfig = {
  logout: () => <Toast text="로그아웃 되었어요" />,
  quit: () => <Toast text="탈퇴되었어요" />,
  deleteRoute: () => <Toast text="경로가 삭제되었어요" />,
  saveRoute: () => <Toast text="경로를 저장했어요" />,
  nickNameChanged: () => <Toast text="닉네임이 변경되었어요" />,
  socialLoginSuccess: () => <Toast text="소셜로그인 성공" />,
  socialLoginFailed: () => <Toast text="소셜로그인에 실패했어요" isWarning />,
  saveNotiSettingsFailed: () => (
    <Toast text="저장 불가: 시작시간보다 종료시간이 더 빨라요" isWarning />
  ),
  reportSuccess: () => <Toast text="댓글을 신고했어요" />,
  alreadyReported: () => <Toast text="이미 신고한 댓글이에요" isWarning />,
  commentDeleted: () => <Toast text="댓글을 삭제했어요" />,
  commentPostFailed: () => <Toast text="댓글 등록에 실패했어요. 다시 시도해 주세요." isWarning />,
  postFailureByForbiddenWord: () => (
    <Toast text="사용할 수 없는 단어가 포함되어 있어요." isWarning />
  ),
  likeActionError: () => (
    <Toast text="‘도움돼요’를 반영할 수 없어요. 다시 시도해 주세요." isWarning />
  ),
};

export default ToastConfig;
