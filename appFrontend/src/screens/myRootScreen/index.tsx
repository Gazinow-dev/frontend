import { Platform, Pressable, SafeAreaView, View } from 'react-native';
import { FontText } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import packageJson from '../../../package.json';
import IconPencil from '@assets/icons/pencil.svg';
import IconRightArrowHead from '@/assets/icons/right_arrow_head.svg';
import { useRootNavigation } from '@/navigation/RootNavigation';
import VersionCheck from 'react-native-version-check';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface RenderMenuProps {
  text: string;
  onPress?: () => void;
  versionText?: string;
}

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

  const renderMenu = ({ text, onPress, versionText }: RenderMenuProps) => (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: pressed ? COLOR.GRAY_E5 : 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 53,
        borderBottomColor: COLOR.GRAY_EB,
        borderBottomWidth: 1,
      })}
      onPress={onPress}
      disabled={versionText ? true : false}
    >
      <FontText text={text} className="leading-21" />
      {versionText ? (
        <FontText text={versionText} className="text-12 leading-17" />
      ) : (
        <IconRightArrowHead width={14} color={COLOR.GRAY_999} />
      )}
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-9f9">
      <View className="pl-16 pt-45 pb-37">
        {isVerifiedUser !== 'success auth' ? (
          <TouchableOpacity
            className="flex-row items-center space-x-6"
            onPress={() => rootNavigation.navigate('AuthStack', { screen: 'Landing' })}
          >
            <FontText text="로그인하세요" className="text-18" fontWeight="600" />
            <IconRightArrowHead
              width={11}
              height={11}
              strokeWidth={1.2}
              color={COLOR.BASIC_BLACK}
            />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              className="flex-row items-center space-x-5"
              hitSlop={20}
              onPress={() =>
                rootNavigation.navigate('MyPageNavigation', { screen: 'ChangeNickNameScreen' })
              }
            >
              <FontText text={nickname} className="text-18 leading-23" fontWeight="600" />
              <IconPencil width={18} />
            </TouchableOpacity>

            <FontText text={email} className="text-14 leading-21 text-gray-999" />
          </>
        )}
      </View>
      <View className="flex-1 bg-white">
        {isVerifiedUser === 'success auth' && (
          <>
            {renderMenu({
              text: '계정 관리',
              onPress: () =>
                rootNavigation.navigate('MyPageNavigation', { screen: 'ManageAccountScreen' }),
            })}
            {renderMenu({
              text: '알림 설정',
              onPress: () =>
                rootNavigation.push('MyPageNavigation', { screen: 'NotiSettingsScreen' }),
            })}
          </>
        )}

        {renderMenu({
          text: '약관 및 정책',
          onPress: () =>
            rootNavigation.navigate('MyPageNavigation', {
              screen: 'SubscribeTermsScreen',
            }),
        })}
        {renderMenu({
          text: '개인정보처리방침',
          onPress: () =>
            rootNavigation.navigate('MyPageNavigation', {
              screen: 'PersonalTermsScreen',
            }),
        })}
        {renderMenu({ text: '버전', versionText })}
      </View>
    </SafeAreaView>
  );
};

export default MyRootScreen;
