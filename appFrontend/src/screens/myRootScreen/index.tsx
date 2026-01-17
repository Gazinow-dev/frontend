import { Platform, Pressable, View } from 'react-native';
import { FontText } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import packageJson from '../../../package.json';
import IconPencil from '@assets/icons/pencil.svg';
import IconArrowRight from '@/assets/icons/arrow_right.svg';
import IconComment from '@/assets/icons/icon-chat-bubble-mini.svg';
import { useRootNavigation } from '@/navigation/RootNavigation';
import VersionCheck from 'react-native-version-check';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyRootScreen = () => {
  const rootNavigation = useRootNavigation();
  const { nickname, email, isVerifiedUser } = useSelector((state: RootState) => state.auth);
  const currentVersionInfo = packageJson.version;

  const [versionText, setVersionText] = useState<string>('');

  useEffect(() => {
    VersionCheck.getLatestVersion({
      provider: Platform.OS === 'ios' ? 'appStore' : 'playStore',
    }).then((latestVersion) => {
      if (currentVersionInfo === latestVersion)
        setVersionText(`v.${latestVersion} 최신버전 입니다`);
      else setVersionText(`v.${currentVersionInfo}`);
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {isVerifiedUser !== 'success auth' ? (
        <View className="px-32 py-44">
          <TouchableOpacity
            className="flex-row items-center space-x-7"
            onPress={() => rootNavigation.navigate('AuthStack', { screen: 'Landing' })}
          >
            <FontText text="로그인하세요" className="text-18" fontWeight="600" />
            <IconArrowRight color={COLOR.BASIC_BLACK} />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="px-32 pb-24 pt-36">
          <View className="space-y-15">
            <View>
              <TouchableOpacity
                className="flex-row items-center space-x-3"
                hitSlop={20}
                onPress={() =>
                  rootNavigation.navigate('MyPageNavigation', { screen: 'ChangeNickNameScreen' })
                }
              >
                <FontText text={nickname} className="text-18 leading-23" fontWeight="600" />
                <IconPencil width={18} />
              </TouchableOpacity>

              <FontText text={email} className="text-14 leading-21 text-purple-54f" />
            </View>

            <TouchableOpacity
              className="flex-row items-center space-x-4"
              hitSlop={20}
              onPress={() =>
                rootNavigation.navigate('MyPageNavigation', { screen: 'MyCommentsScreen' })
              }
            >
              <IconComment />
              <FontText text="내가 쓴 댓글" className="text-13 leading-19 text-gray-999" />
              <IconArrowRight color={COLOR.GRAY_DDD} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View className="flex-1 space-y-10 bg-gray-9f9 pt-20">
        {isVerifiedUser === 'success auth' && (
          <View className="mx-16 rounded-12 bg-white">
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              })}
              onPress={() =>
                rootNavigation.navigate('MyPageNavigation', { screen: 'ManageAccountScreen' })
              }
            >
              <FontText text="계정관리" className="leading-21 text-purple-54f" />
              <IconArrowRight color="#D7D7D7" />
            </Pressable>
            <View className="h-1 bg-gray-beb" />
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
              })}
              onPress={() =>
                rootNavigation.navigate('MyPageNavigation', { screen: 'NotiSettingsScreen' })
              }
            >
              <FontText text="알림 설정" className="leading-21 text-purple-54f" />
              <IconArrowRight color="#D7D7D7" />
            </Pressable>
          </View>
        )}
        <View className="mx-16 rounded-12 bg-white">
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            })}
            onPress={() => rootNavigation.navigate('MyPageNavigation', { screen: 'NoticesScreen' })}
          >
            <FontText text="공지사항" className="leading-21 text-purple-54f" />
            <IconArrowRight color="#D7D7D7" />
          </Pressable>
          <View className="h-1 bg-gray-beb" />
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
            })}
            onPress={() =>
              rootNavigation.navigate('MyPageNavigation', { screen: 'SubscribeTermsScreen' })
            }
          >
            <FontText text="약관 및 정책" className="leading-21 text-purple-54f" />
            <IconArrowRight color="#D7D7D7" />
          </Pressable>
          <View className="h-1 bg-gray-beb" />
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
            })}
            onPress={() =>
              rootNavigation.navigate('MyPageNavigation', { screen: 'PersonalTermsScreen' })
            }
          >
            <FontText text="개인정보처리방침" className="leading-21 text-purple-54f" />
            <IconArrowRight color="#D7D7D7" />
          </Pressable>
          <View className="h-1 bg-gray-beb" />
          <View className="flex-row justify-between rounded-b-12 p-16">
            <FontText text="버전" className="leading-21 text-purple-54f" />
            <FontText text={versionText} className="text-12 leading-17" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyRootScreen;
