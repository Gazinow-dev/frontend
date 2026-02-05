import { FontText } from '@/global/ui';
import { Pressable, View } from 'react-native';
import { NotiHistoryContent } from '@/global/apis/entity';
import IconApp from '@assets/icons/app_icon_AOS.svg';
import cn from 'classname';
import { COLOR } from '@/global/constants';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useMutation } from 'react-query';
import { updateNotiReadStatus } from '@/global/apis/func';

interface Props {
  item: NotiHistoryContent;
  index: number;
}

const UpdateNotiCard = ({ item, index }: Props) => {
  const { issueId, notificationTitle, read, agoTime } = item;

  const navigation = useRootNavigation();
  const { mutate } = useMutation(updateNotiReadStatus);

  const handleCard = () => {
    navigation.push('MyPageNavigation', {
      screen: 'NoticeDetailScreen',
      params: { noticeId: issueId },
    });
    if (!item.read) mutate(item.id);
  };

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
      key={`${index}_${issueId}`}
    >
      <IconApp />
      <View className="flex-1 ml-12 mr-32 space-y-4">
        <FontText text="[앱 업데이트 안내]" className="text-12 leading-15 text-gray-999" />
        <FontText
          text={notificationTitle}
          className={cn('text-14 leading-21', {
            'text-gray-999': read,
          })}
          numberOfLines={2}
          fontWeight="600"
        />
      </View>
      <FontText text={agoTime} className="text-11 leading-13 text-gray-999" fontWeight="500" />
    </Pressable>
  );
};

export default UpdateNotiCard;
