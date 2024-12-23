import { COLOR } from '@/global/constants';
import { FontText } from '@/global/ui';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { Dimensions, Pressable, View } from 'react-native';

const NonLoggedIn = () => {
  const navigation = useRootNavigation();
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get('screen').height * 0.431,
        paddingBottom: 10,
        borderTopColor: COLOR.GRAY_EB,
        borderTopWidth: 1,
      }}
    >
      <FontText
        text={`로그인하고 자주 가는 경로의\n이슈를 바로 확인하세요`}
        className="text-center text-13 leading-16 text-gray-999"
        fontWeight="500"
      />
      <Pressable
        className="bg-black-717 w-[120px] py-12 items-center rounded-5 mt-24"
        onPress={() => navigation.navigate('AuthStack', { screen: 'Landing' })}
      >
        <FontText text="로그인" className="text-white text-14" fontWeight="600" />
      </Pressable>
    </View>
  );
};

export default NonLoggedIn;
