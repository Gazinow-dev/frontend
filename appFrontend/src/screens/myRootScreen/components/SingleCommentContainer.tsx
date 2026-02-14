import { Platform, Pressable, View } from 'react-native';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { getIssueId } from '@/store/modules';
import { useAppDispatch } from '@/store';
import { FontText } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { CommentContent } from '@/global/apis/entity';
import { IconHeart } from '@/assets/icons';

interface Props {
  item: CommentContent;
}

const SingleCommentContainer = ({ item }: Props) => {
  const { issueCommentContent, issueId, agoTime, likesCount } = item;
  const navigation = useRootNavigation();
  const dispatch = useAppDispatch();

  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
        padding: 16,
        rowGap: 12,
        borderBottomWidth: 1,
        borderColor: COLOR.GRAY_EB,
      })}
      onPress={() => {
        dispatch(getIssueId(issueId));
        navigation.navigate('IssueStack', { screen: 'IssueDetail' });
      }}
    >
      <View className="space-y-4">
        <FontText text={agoTime} className="text-13 leading-19 text-gray-999" />
        <FontText text={issueCommentContent} className="leading-24" numberOfLines={2} />
      </View>

      <View className={'w-64 flex-row space-x-4 ' + (Platform.OS === 'ios' ? 'items-center' : '')}>
        <IconHeart color="#D1D6DB" />
        <FontText text={'' + likesCount} className="text-13 leading-19 text-gray-999" />
      </View>

      <View className="flex-row space-x-8">
        <FontText text="댓글 단 글" className="text-13 leading-19 text-gray-999" />
        <FontText
          text={item.issueTitle}
          className="flex-1 overflow-hidden text-13 leading-19 text-gray-999"
          numberOfLines={1}
          fontWeight="500"
        />
      </View>
    </Pressable>
  );
};
export default SingleCommentContainer;
