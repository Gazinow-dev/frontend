import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import IconCrossX from '@assets/icons/cross_x.svg';
import { useMyPageNavigation } from '@/navigation/MyPageNavigation';

const PersonalTermsScreen = () => {
  const myPageNavigation = useMyPageNavigation();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity className="pl-16 pt-13 pb-10" onPress={() => myPageNavigation.goBack()}>
        <IconCrossX width="24px" />
      </TouchableOpacity>
      <View className="bg-gray-beb h-1" />
      <WebView
        source={{
          uri: 'https://reflective-pincushion-d6c.notion.site/ver-1-c94b91a436814e3f86881f9f144f8581?pvs=4',
        }}
      />
    </SafeAreaView>
  );
};

export default PersonalTermsScreen;
