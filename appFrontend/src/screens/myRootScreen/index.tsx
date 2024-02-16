import styled from '@emotion/native';
import { Image, Platform, StatusBar } from 'react-native';
import { iconPath } from '@/assets/icons/iconPath';
import { FontText, Space, TextButton } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { RESULTS, requestNotifications } from 'react-native-permissions';
import { useState } from 'react';
import ChangeNickNameModal from './components/ChangeNickNameModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/configureStore';
import packageJson from '../../../package.json';
import ContractModal from './components/ContractModal';
import ManageAccountModal from './components/ManageAccountModal';
import NotiOnModal from './components/NotiOnModal';
import NotiSettingsModal from './components/NotiSettingsModal';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Pencil from '@assets/icons/pencil.svg';
import MoreBtn from '@/assets/icons/moreBtnMy.svg';

interface RenderMenuProps {
  text: string;
  onPress?: () => void;
  versionInfo?: string;
}
const ALLOWED_PERMISSIONS = {
  [RESULTS.GRANTED]: true,
  [RESULTS.LIMITED]: true,
  [RESULTS.UNAVAILABLE]: true,
  [RESULTS.BLOCKED]: false,
  [RESULTS.DENIED]: false,
};

const requestNotificationPermission = async () => {
  const { status } = await requestNotifications(['alert']);
  return ALLOWED_PERMISSIONS[status];
};

const MyRootScreen = () => {
  const StatusBarHeight =
    Platform.OS === 'ios'
      ? getStatusBarHeight(true) - 15
      : (StatusBar.currentHeight as number) - 24;

  const { nickname, email } = useSelector((state: RootState) => state.auth);
  const versionInfo = packageJson.version;

  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState<boolean>(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState<boolean>(false);
  const [isManageAccountModalOpen, setIsManageAccountModalOpen] = useState<boolean>(false);
  const [isNotiOnModalOpen, setIsNotiOnModalOpen] = useState<boolean>(false);
  const [isNotiSettingsModalOpen, setIsNotiSettingsModalOpen] = useState<boolean>(false);

  const confirmUserNotificationOn = async () => {
    const result = await requestNotificationPermission();
    if (!result) {
      setIsNotiOnModalOpen(true);
    } else {
      setIsNotiSettingsModalOpen(true);
    }
  };

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
        <FontText
          value={`v ${versionInfo} 최신버전입니다`}
          textSize="12px"
          textWeight="Regular"
          lineHeight="17px"
        />
      ) : (
        <MoreBtn width={14} />
      )}
    </MenuContainer>
  );

  return (
    <Container
      style={{
        paddingTop: StatusBarHeight,
        backgroundColor: COLOR.GRAY_F9,
      }}
    >
      <ProfileContainer>
        <NickNameContainer onPress={() => setIsNicknameModalOpen(true)}>
          <FontText value={nickname} textSize="16px" textWeight="Medium" lineHeight="21px" />
          <Space width="5px" />
          <Pencil width={15} onPress={() => setIsNicknameModalOpen(true)} />
        </NickNameContainer>
        <FontText
          value={email}
          textSize="12px"
          textWeight="Regular"
          lineHeight="15px"
          textColor={COLOR.GRAY_999}
        />
      </ProfileContainer>
      <BtnContainer>
        {renderMenu({
          text: '계정 관리',
          onPress: () => setIsManageAccountModalOpen(true),
        })}
        {/* TODO: 페이지 들어가서 퍼미션 컨펌창 띄우는 로직으로 수정하기 */}
        {/* {renderMenu({ text: '알림 설정', onPress: () => confirmUserNotificationOn() })} */}
        {renderMenu({
          text: '약관 및 정책',
          onPress: () => setIsContractModalOpen(true),
        })}
        {renderMenu({ text: '버전', versionInfo })}

        {isNicknameModalOpen && (
          <ChangeNickNameModal onCancel={() => setIsNicknameModalOpen(false)} />
        )}
        {isContractModalOpen && <ContractModal onCancel={() => setIsContractModalOpen(false)} />}
        {isManageAccountModalOpen && (
          <ManageAccountModal onCancel={() => setIsManageAccountModalOpen(false)} />
        )}
        {isNotiOnModalOpen && <NotiOnModal onCancel={() => setIsNotiOnModalOpen(false)} />}
        {isNotiSettingsModalOpen && (
          <NotiSettingsModal onCancel={() => setIsNotiSettingsModalOpen(false)} />
        )}
      </BtnContainer>
    </Container>
  );
};

export default MyRootScreen;

const Container = styled.View`
  flex: 1;
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
