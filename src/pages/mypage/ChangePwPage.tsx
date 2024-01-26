import styled from '@emotion/native';

import { IconButton, TextButton } from '@/components/common/molecules';
import { FontText, Input, Space } from '@/components/common/atoms';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { Image } from 'react-native';
import { iconPath } from '@/assets/icons/iconPath';
import { COLOR } from '@/constants';
import { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { CustomModal } from '@/components/common/modals';

const ChangePwPage = () => {
    const navigation = useRootNavigation();
    // const submitNewPw = () => {
    //     console.log('비밀번호 변경 완료')
    // }
    navigation.setOptions({
        headerRight: () => (
            <TextButton
                value="완료    "
                textSize="16px"
                textColor={COLOR.GRAY_999}
                textWeight="Medium"
                lineHeight="21px"
                onPress={() => submitNewPw()}
            />
        ),
    })
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const submitNewPw = () => setPopupVisible(true);
    const handleConfirm = async () => {
        navigation.goBack();
        setPopupVisible(false);
    };

    const [newNickname, setNewNickname] = useState<string>('');

    const changeNickname = (text: string) => {
        setNewNickname(text);
        sendSearchText(text);
    };

    const sendSearchText = useCallback(
        debounce((text: string) => {
            // dispatch(getSearchText(text));
        }, 500),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const deleteInputText = () => {
        setNewNickname('');
    };

    return (
        <Container>
            <Space height='39px' />
            <FontText
                value="현재 비밀번호"
                textSize="14px"
                textWeight="SemiBold"
                lineHeight="21px"
                textColor={COLOR.BASIC_BLACK}
            />
            <InputContainer>
                <SearchInput
                    value={newNickname}
                    placeholder={`비밀번호를 입력해주세요`}
                    placeholderTextColor={COLOR.BE_GRAY}
                    inputMode="search"
                    onChangeText={changeNickname}
                    autoFocus
                />
                <IconButton
                    iconType="Ionicons"
                    isFontIcon
                    iconName="close-circle"
                    iconWidth="19.5"
                    iconColor="rgba(0, 0, 0, 0.46)"
                    onPress={deleteInputText}
                />
            </InputContainer>
            <ConfirmContainer>
                <Image source={iconPath.x_circle} style={{ width: 14, height: 14 }} />
                <FontText
                    value=" 비밀번호가 틀립니다"
                    textSize="12px"
                    textWeight="Medium"
                    lineHeight="14px"
                    textColor={COLOR.GRAY_999}
                />
            </ConfirmContainer>
            <Space height='28px' />
            <FontText
                value="새로운 비밀번호"
                textSize="14px"
                textWeight="SemiBold"
                lineHeight="21px"
                textColor={COLOR.BASIC_BLACK}
            />
            <InputContainer>
                <SearchInput
                    value={newNickname}
                    placeholder={`변경하실 비밀번호를 입력해주세요`}
                    placeholderTextColor={COLOR.BE_GRAY}
                    inputMode="search"
                    onChangeText={changeNickname}
                />
                <IconButton
                    iconType="Ionicons"
                    isFontIcon
                    iconName="close-circle"
                    iconWidth="19.5"
                    iconColor="rgba(0, 0, 0, 0.46)"
                    onPress={deleteInputText}
                />
            </InputContainer>
            <ConfirmContainer>
                <Image source={iconPath.x_circle} style={{ width: 14, height: 14 }} />
                <FontText
                    value=" 비밀번호가 틀립니다"
                    textSize="12px"
                    textWeight="Medium"
                    lineHeight="14px"
                    textColor={COLOR.GRAY_999}
                />
            </ConfirmContainer>

            <InputContainer>
                <SearchInput
                    value={newNickname}
                    placeholder={`비밀번호를 확인해주세요`}
                    placeholderTextColor={COLOR.BE_GRAY}
                    inputMode="search"
                    onChangeText={changeNickname}
                />
                <IconButton
                    iconType="Ionicons"
                    isFontIcon
                    iconName="close-circle"
                    iconWidth="19.5"
                    iconColor="rgba(0, 0, 0, 0.46)"
                    onPress={deleteInputText}
                />
            </InputContainer>
            <ConfirmContainer>
                <Image source={iconPath.x_circle} style={{ width: 14, height: 14 }} />
                <FontText
                    value=" 비밀번호가 틀립니다"
                    textSize="12px"
                    textWeight="Medium"
                    lineHeight="14px"
                    textColor={COLOR.GRAY_999}
                />
            </ConfirmContainer>
            <CustomModal
                isVisible={popupVisible}
                onCancel={handleConfirm}
                title="비밀번호가 변경되었습니다"
                cancelText="확인"
                btnColor={COLOR.LIGHT_GRAY}
            />
        </Container>
    );
};
export default ChangePwPage;

const Container = styled.View`
  padding: 0 16px;
  background-color: ${COLOR.WHITE};
  flex:1;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 5px;
  padding: 4px 16px 4px 18.25px;
  margin-top: 8px;
  background-color: ${COLOR.LIGHT_GRAY};
`;

const ConfirmContainer = styled.View`
  margin: 8px 5px;
  flex-direction: row;
  align-items: center;
`;

const HeaderLeft = styled.View`
  margin-left: 10px;
  flex-direction: row;
`;

const SearchInput = styled(Input)`
  height: 36px;
  flex: 1;
`;