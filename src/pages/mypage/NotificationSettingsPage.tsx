import styled from '@emotion/native';
import React, { useState } from 'react';
import { Switch, StyleSheet } from 'react-native';
import { TextButton } from '@/components/common/molecules';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { COLOR } from '@/constants';
import { Space } from '@/components/common/atoms';

const NotificationSettingsPage = () => {
    const navigation = useRootNavigation();
    navigation.setOptions({
        headerRight: () => (
            <TextButton
                value="완료    "
                textSize="16px"
                textColor={COLOR.GRAY_999}
                textWeight="Medium"
                lineHeight="21px"
                onPress={() => submitNotificationSettings()}
            />
        ),
    })

    const submitNotificationSettings = () => {

    }

    const [pushNotification, setPushNotification] = useState(true);
    const [savedPathNotification, setSavedPathNotification] = useState(true);
    const [newsNotification, setNewsNotification] = useState(true);

    const handlePushNotificationToggle = () => {
        setPushNotification(!pushNotification);
    };

    return (
        <Container>
            <MenuContainer>
                <TextButton
                    value="푸시 알림 받기"
                    textSize="16px"
                    textWeight="Regular"
                    lineHeight="21px"
                />
                <Switch value={pushNotification} onValueChange={handlePushNotificationToggle} />
            </MenuContainer>
            {pushNotification && (
                <>
                    <Space height='20px' backgroundColor={COLOR.LIGHT_GRAY} />
                    <MenuContainer>
                        <TextButton
                            value="내가 저장한 경로 알림"
                            textSize="16px"
                            textWeight="Regular"
                            lineHeight="21px"
                        />
                        <Switch value={savedPathNotification}
                            onValueChange={() => setSavedPathNotification(!savedPathNotification)} />
                    </MenuContainer>
                    <MenuContainer>
                        <TextButton
                            value="새소식 알림"
                            textSize="16px"
                            textWeight="Regular"
                            lineHeight="21px"
                        />
                        <Switch value={newsNotification}
                            onValueChange={() => setNewsNotification(!newsNotification)} />
                    </MenuContainer>
                </>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
});

export default NotificationSettingsPage;
const Container = styled.View`
  background-color: white;
  flex: 1;
`;
const MenuContainer = styled.Pressable`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 16px;
  height: 53px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #ebebeb;
`;
//     return (
//         <Container>
//           
//             <MenuContainer>
//                 <TextButton
//                     value="계정관리"
//                     textSize="16px"
//                     textWeight="Regular"
//                     // onPress={submitFormData}
//                     lineHeight="21px"
//                 />
//                 <Image source={iconPath.backBtn} style={{ width: 14, height: 17, transform: [{ scaleX: -1 }] }} />
//             </MenuContainer>
//             <MenuContainer>
//                 <TextButton
//                     value="약관 및 정책"
//                     textSize="16px"
//                     textWeight="Regular"
//                     // onPress={submitFormData}
//                     lineHeight="21px"
//                 />
//                 <Image source={iconPath.backBtn} style={{ width: 14, height: 17, transform: [{ scaleX: -1 }] }} />
//             </MenuContainer>
//             <VersionContainer>
//                 <FontText
//                     value="버전"
//                     textSize="16px"
//                     textWeight="Regular"
//                     // onPress={submitFormData}
//                     lineHeight="21px"
//                 />
//                 <FontText
//                     value={`v ${versionInfo} 최신버전입니다`}
//                     textSize="12px"
//                     textWeight="Regular"
//                     // onPress={submitFormData}
//                     lineHeight="17px"
//                 />
//             </VersionContainer> */}
//         </Container >
//     );
// };
// export default NotificationSettingsPage;

// const Container = styled.View`
//   background-color: white;
//   flex: 1;
// `;
// const NickNameContainer = styled.Pressable`
//   flex-direction: row;
// `;
// const MenuContainer = styled.Pressable`
//   flex-direction: row;
//   justify-content: space-between;
//   padding: 0 16px;
//   height: 53px;
//   align-items: center;
//   border-bottom-width: 1px;
//   border-bottom-color: #ebebeb;
// `;
// const VersionContainer = styled.View`
//   flex-direction: row;
//   justify-content: space-between;
//   padding: 0 16px;
//   height: 53px;
//   align-items: center;
//   border-bottom-width: 1px;
//   border-bottom-color: #ebebeb;
// `;