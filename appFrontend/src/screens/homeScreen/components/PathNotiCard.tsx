import { COLOR } from '@/global/constants';
import { FontText } from '@/global/ui';
import { Pressable, View } from 'react-native';
import cn from 'classname';
import { IssueKeywordIcon } from '@/global/components';
import { NotiHistoryContent } from '@/global/apis/entity';
import dayjs from 'dayjs';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useAppDispatch } from '@/store';
import { getIssueId } from '@/store/modules';
import { useMutation } from 'react-query';
import { updateNotiReadStatus } from '@/global/apis/func';

interface Props {
  item: NotiHistoryContent;
  index: number;
}

const PathNotiCard = ({ item, index }: Props) => {
  const { keyword, read, notificationBody, notificationTitle, agoTime } = item;

  const navigation = useRootNavigation();
  const dispatch = useAppDispatch();
  const { mutate } = useMutation(updateNotiReadStatus);

  const handleCard = () => {
    dispatch(getIssueId(item.issueId));
    navigation.navigate('IssueStack', { screen: 'IssueDetail' });
    if (!item.read) mutate(item.id);
  };

  if (keyword === '관리자') return null;
  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: pressed ? COLOR.GRAY_E5 : COLOR.WHITE,
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: COLOR.GRAY_EB,
      })}
      onPress={handleCard}
      key={`${index}_${item.issueId}`}
    >
      <IssueKeywordIcon
        keyword={keyword}
        color={read ? COLOR.GRAY_DDD : COLOR.BASIC_BLACK}
        width={24}
        height={24}
      />

      <View className="flex-1 ml-12 mr-32 space-y-4">
        <FontText
          text={notificationBody}
          className={cn('text-14 leading-21', {
            'text-gray-999': read,
          })}
          numberOfLines={2}
          fontWeight="600"
        />
        <FontText text={notificationTitle} className="text-12 leading-15 text-gray-999" />
      </View>
      <FontText
        text={dayjs(agoTime).fromNow()}
        className="text-11 leading-13 text-gray-999"
        fontWeight="500"
      />
    </Pressable>
  );
};

export default PathNotiCard;
