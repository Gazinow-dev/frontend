import { COLOR } from '@/global/constants';
import cn from 'classname';
import { useAppSelect } from '@/store';
import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import IconLeftArrowHead from '@assets/icons/left_arrow_head.svg';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useDeletePostLike, useGetIssue, usePostLike } from './api/hooks';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FontText } from '@/global/ui';
import IconThumsUp from '@assets/icons/thumbs_up.svg';
import MyTabModal from '@/global/components/MyTabModal';

dayjs.locale('ko');
dayjs.extend(relativeTime);

const IssueDetailScreen = () => {
  const navigation = useRootNavigation();
  const issueId = useAppSelect((state) => state.subwaySearch.issueId);
  const isVerifiedUser = useAppSelect((state) => state.auth.isVerifiedUser);

  const [isOpenLoginModal, setIsOpenLoginModal] = useState<boolean>(false);

  const { issueData, refetchIssue } = useGetIssue({ issueId });
  const { doLikeMutate } = usePostLike({ onSuccess: refetchIssue });
  const { deleteLikeMutate } = useDeletePostLike({ onSuccess: refetchIssue });

  const likeHandler = useMemo(
    () =>
      debounce(() => {
        if (!issueData) return;
        if (isVerifiedUser !== 'success auth') setIsOpenLoginModal(true);
        else if (issueData.like) deleteLikeMutate(issueData.id);
        else doLikeMutate(issueData.id);
      }, 300),
    [issueData, isVerifiedUser],
  );

  const startIssueDate = dayjs(issueData?.startDate).fromNow();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MyTabModal
        isVisible={isOpenLoginModal}
        onCancel={() => setIsOpenLoginModal(false)}
        onConfirm={() => {
          setIsOpenLoginModal(false);
          navigation.navigate('AuthStack', { screen: 'Landing' });
        }}
        title="로그인 후 이용할 수 있어요"
        confirmText="로그인"
        cancelText="취소"
      />

      <TouchableOpacity className="p-16 w-30" hitSlop={20} onPress={() => navigation.goBack()}>
        <IconLeftArrowHead color="#3F3F46" height={24} />
      </TouchableOpacity>

      {issueData && (
        <ScrollView className="flex-1 px-16" showsVerticalScrollIndicator={false}>
          <FontText text={startIssueDate} className="mt-16 mb-12 text-12 text-gray-999" />
          <FontText text={issueData.title} className="text-21 " fontWeight="600" />
          <View className="w-full h-1 my-28 bg-gray-beb" />
          <FontText text={issueData.content} className="text-black leading-24" />
          <View className="w-full h-1 my-28 bg-gray-beb" />

          <View className="flex-row justify-between mt-8">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={likeHandler}
              activeOpacity={0.5}
              hitSlop={30}
            >
              <IconThumsUp
                color={issueData?.like ? COLOR.LIGHT_BLUE : COLOR.GRAY_999}
                width={24}
                height={24}
              />
              <FontText
                text={`도움돼요 ${issueData.likeCount}`}
                className={cn('text-14 leading-21 tracking-[-0.2px] ml-4', {
                  'text-light-blue': issueData.like,
                  'text-gray-999': !issueData.like,
                })}
                fontWeight="500"
              />
            </TouchableOpacity>
            {/* TODO: MVP에서 빠짐 */}
            {/* <TouchableOpacity onPress={} activeOpacity={0.5} hitSlop={30}>
              <FontText
                text="잘못된 정보 신고"
                className="text-14 text-gray-999 leading-21 tracking-[-0.2px]"
                fontWeight="500"
              />
            </TouchableOpacity> */}
          </View>
          <View className="h-64" />
        </ScrollView>
        // {isOpenModal && <WrongInfoModal closeModal={closeModal} />}
      )}
    </SafeAreaView>
  );
};

export default IssueDetailScreen;

