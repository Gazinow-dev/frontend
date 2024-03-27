import { COLOR } from '@/global/constants';
import { Pressable, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import IconCrossX from '@assets/icons/cross_x.svg';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';

const PersonalTermsScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.WHITE }}>
      <View
        style={{
          paddingLeft: 16,
          paddingTop: 13,
          paddingBottom: 10,
          backgroundColor: COLOR.WHITE,
          borderBottomWidth: 1,
          borderBottomColor: COLOR.GRAY_DDD,
        }}
      >
        <Pressable hitSlop={20} onPress={() => myPageNavigation.goBack()}>
          <IconCrossX width="24px" />
        </Pressable>
      </View>
      <WebView
        source={{
          uri: 'https://reflective-pincushion-d6c.notion.site/ver-1-c94b91a436814e3f86881f9f144f8581?pvs=4',
        }}
      />
    </SafeAreaView>
  );
};

export default PersonalTermsScreen;
