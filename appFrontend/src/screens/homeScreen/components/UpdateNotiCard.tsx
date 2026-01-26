import { FontText } from '@/global/ui';
import { Pressable, View } from 'react-native';
import { NoticeType } from '@/global/apis/entity';
import IconApp from '@assets/icons/app_icon_AOS.svg';
import dayjs from 'dayjs';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';
import { COLOR } from '@/global/constants';

type Props = {
  item: NoticeType;
  index: number;
};

const UpdateNotiCard = ({ item, index }: Props) => {
  const { noticeTitle, createdAt } = item;

  const myPageNavigation = useMyPageNavigation();

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
      onPress={() => {
        myPageNavigation.push('NoticeDetailScreen', { noticeId: item.noticeId });
      }}
      key={`${index}_${item.noticeId}`}
    >
      <IconApp />
      <View className="flex-1 ml-12 mr-32 space-y-4">
        <FontText text="[앱 업데이트 안내]" className="text-12 leading-15 text-gray-999" />
        <FontText
          text={noticeTitle}
          className="text-14 leading-21"
          numberOfLines={2}
          fontWeight="600"
        />
      </View>
      <FontText
        text={dayjs(createdAt).fromNow()}
        className="text-11 leading-13 text-gray-999"
        fontWeight="500"
      />
    </Pressable>
  );
};

export default UpdateNotiCard;
