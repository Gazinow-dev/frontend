import styled from '@emotion/native';
import { Platform, Pressable, View } from 'react-native';
import { FontText, Space, TextButton } from '@/global/ui';
import { COLOR } from '@/global/constants';
// import { RESULTS, requestNotifications } from 'react-native-permissions';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import packageJson from '../../../package.json';
import IconPencil from '@assets/icons/pencil.svg';
import IconRightArrowHead from '@/assets/icons/right_arrow_head.svg';
import { useRootNavigation } from '@/navigation/RootNavigation';
import VersionCheck from 'react-native-version-check';
import { useEffect, useState } from 'react';

interface RenderMenuProps {
  text: string;
  onPress?: () => void;
  versionInfo?: string;
}
// const ALLOWED_PERMISSIONS = {
//   [RESULTS.GRANTED]: true,
//   [RESULTS.LIMITED]: true,
//   [RESULTS.UNAVAILABLE]: true,
//   [RESULTS.BLOCKED]: false,
//   [RESULTS.DENIED]: false,
// };

const requestNotificationPermission = async () => {
  // const { status } = await requestNotifications(['alert']);
  // return ALLOWED_PERMISSIONS[status];
};

const MyRootScreen = () => {
  const rootNavigation = useRootNavigation();
  const { nickname, email, isVerifiedUser } = useSelector((state: RootState) => state.auth);
  const currentVersionInfo = packageJson.version;

  const [versionText, setVersionText] = useState<string>('');

  const confirmUserNotificationOn = async () => {
    // const result = await requestNotificationPermission();
    // if (!result) {
    //   setIsNotiOnScreenOpen(true);
    // } else {
    //   setIsNotiSettingsScreenOpen(true);
    // }
  };

  useEffect(() => {
    VersionCheck.getLatestVersion({
      provider: Platform.OS === 'ios' ? 'appStore' : 'playStore',
    }).then((latestVersion) => {
      if (currentVersionInfo === latestVersion) setVersionText(`v${latestVersion} 최신버전 입니다`);
      else setVersionText(`v${currentVersionInfo}`);
    });
  }, []);

  const renderMenu = ({ text, onPress, versionInfo }: RenderMenuProps) => (
    <MenuContainer onPress={onPress}>
      <TextButton
        value={text}
        textSize="16px"
        textWeight="Regular"
        lineHeight="21px"
        onPress={onPress}
      />
      {versionInfo ? (
        <FontText value={versionText} textSize="12px" textWeight="Regular" lineHeight="17px" />
      ) : (
        <IconRightArrowHead width={14} color={COLOR.GRAY_999} />
      )}
    </MenuContainer>
  );

  return (
    <Container>
      <ProfileContainer>
        {isVerifiedUser !== 'success auth' ? (
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => rootNavigation.navigate('AuthStack', { screen: 'Landing' })}
          >
            <FontText
              value="로그인하세요"
              textSize="18px"
              textWeight="SemiBold"
              style={{ marginRight: 6 }}
            />
            <IconRightArrowHead
              width={11}
              height={11}
              strokeWidth={1.2}
              color={COLOR.BASIC_BLACK}
            />
          </Pressable>
        ) : (
          <>
            <NickNameContainer>
              <FontText value={nickname} textSize="16px" textWeight="SemiBold" />
              <Space width="5px" />
              <Pressable
                hitSlop={20}
                onPress={() =>
                  rootNavigation.navigate('MyPageNavigation', { screen: 'ChangeNickNameScreen' })
                }
              >
                <IconPencil width={15} />
              </Pressable>
            </NickNameContainer>
            <FontText
              value={email}
              textSize="12px"
              textWeight="Regular"
              lineHeight="15px"
              textColor={COLOR.GRAY_999}
            />
          </>
        )}
      </ProfileContainer>
      <BtnContainer>
        {isVerifiedUser === 'success auth' &&
          renderMenu({
            text: '계정 관리',
            onPress: () =>
              rootNavigation.navigate('MyPageNavigation', { screen: 'ManageAccountScreen' }),
          })}
        {/* TODO: 페이지 들어가서 퍼미션 컨펌창 띄우는 로직으로 수정하기 */}
        {/* {renderMenu({ text: '알림 설정', onPress: () => confirmUserNotificationOn() })} */}
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
        {renderMenu({ text: '버전', versionInfo: versionText })}
      </BtnContainer>
    </Container>
  );
};

export default MyRootScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${COLOR.GRAY_F9};
`;
const NickNameContainer = styled.Pressable`
  flex-direction: row;
  align-items: center;
`;
const ProfileContainer = styled.Pressable`
  padding: 45px 16px;
  background-color: ${COLOR.GRAY_F9};
`;
const MenuContainer = styled.Pressable`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 16px;
  height: 53px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${COLOR.GRAY_EB};
`;
const BtnContainer = styled.View`
  background-color: white;
  flex: 1;
`;
