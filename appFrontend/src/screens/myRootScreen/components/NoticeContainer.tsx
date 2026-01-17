import { Pressable } from 'react-native';
import { FontText } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { NoticeType } from '../apis/entity';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import dayjs from 'dayjs';

interface CommentProps {
  item: NoticeType;
}

const NoticeContainer = ({ item }: CommentProps) => {
  const { noticeId, noticeTitle, createdAt } = item;
  const myPageNavigation = useMyPageNavigation();

  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 20,
        rowGap: 6,
        borderBottomWidth: 1,
        borderColor: COLOR.GRAY_EB,
      })}
      onPress={() => myPageNavigation.push('NoticeDetailScreen', { noticeId })}
    >
      <FontText text={noticeTitle} fontWeight="500" numberOfLines={2} />
      <FontText
        text={dayjs(createdAt).format('YYYY.MM.DD')}
        className="text-13 leading-19 text-gray-999"
      />
    </Pressable>
  );
};
export default NoticeContainer;
