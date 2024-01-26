import styled from '@emotion/native';
import { TextButton } from '@/components/common/molecules';
import { FontText, Space } from '@/components/common/atoms';
import COLOR from '@/constants/color';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { Linking } from 'react-native';

const NotificationOnPage = () => {
    const navigation = useRootNavigation();
    navigation.setOptions({
        headerRight: () => (
            <TextButton
                value="완료    "
                textSize="16px"
                textColor={COLOR.GRAY_999}
                textWeight="Medium"
                lineHeight="21px"
            // onPress={() => submitNotificationSettings()}
            />
        ),
    })

    const goToDeviceSettings = () => {
        console.log('adkdkd')
        Linking.openSettings();
    };

    return (
        <Container>
            <AlertContainer>
                <FontText
                    value={`기기 알림을 켜주세요!`}
                    textSize="24px"
                    textWeight="Bold"
                    lineHeight="32px"
                />
                <Space height='7px' />
                <FontText
                    value={`정보 알림을 받기 위해선 기기 알림을 켜주세요`}
                    textSize="16px"
                    textWeight="Regular"
                    lineHeight="21px"
                    textColor={COLOR.GRAY_999}
                />
            </AlertContainer>
            <BottomBtn onPress={goToDeviceSettings}>
                <TextButton
                    value="기기 알림 켜기"
                    textSize="17px"
                    textWeight="Regular"
                    lineHeight="26px"
                    textColor={COLOR.WHITE}
                    onPress={goToDeviceSettings}
                />
            </BottomBtn>
        </Container >
    );
};
export default NotificationOnPage;

const Container = styled.View`
  background-color: white;
  padding: 0 16px;
  flex: 1;
`;
const AlertContainer = styled.Pressable`
  flex:1;
  margin-top: 229px;
  align-items: center;
`;
const BottomBtn = styled.Pressable`
  padding-vertical: 11px;
  margin-bottom: 83px;
  border-radius: 5px;
  align-items: center;
  background-color : ${COLOR.BASIC_BLACK};
`;