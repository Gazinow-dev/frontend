import styled from '@emotion/native';
import { useState } from 'react';
import { FontText, Input, Space } from '@/components/common/atoms';
import { IconButton, TextButton } from '@/components/common/molecules';
import { COLOR } from '@/constants';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { Image } from 'react-native';
import { iconPath } from '@/assets/icons/iconPath';
import { AxiosError } from 'axios';
import { axiosInstance } from '@/apis/axiosInstance';

const ChangeNickNamePage = () => {
    const navigation = useRootNavigation();
    navigation.setOptions({
        headerRight: () => (
            <TextButton
                value="완료    "
                textSize="16px"
                textColor={COLOR.GRAY_999}
                textWeight="Medium"
                lineHeight="21px"
                onPress={() => submitNickname(newNickname)}
            />
        ),
    })

    const [newNickname, setNewNickname] = useState<string>('');
    const [isNicknameValid, setIsNicknameValid] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const deleteInputText = () => { setNewNickname(''); };
    const changeNickname = (text: string) => { setNewNickname(text); };

    const submitNickname = async (newNickname: string) => {
        try {
            const response = await axiosInstance.post(`/api/v1/member/change_nickname`, { nickName: newNickname });
            if (response.status === 200) {
                navigation.goBack();
            }
        } catch (err) {
            const error = err as AxiosError;
            setIsNicknameValid(false);
            setErrorMessage(getErrorMessage(error.response?.status));
        }
    };

    const getErrorMessage = (status: number | undefined) => {
        switch (status) {
            case 409:
                return '중복된 닉네임입니다.';
            case 404:
                return '회원이 존재하지 않습니다. 다시 로그인해주세요.';
            case 400:
                return '7글자 이하의 한글, 알파벳, 숫자를 입력해주세요.\n한글 자모음 단독으로 입력 불가';
            default:
                return '';
        }
    };

    return (
        <>
            <Container>
                <SearchInput
                    value={newNickname}
                    placeholder={`새 닉네임을 입력하세요`}
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
            </Container>
            {!isNicknameValid && (
                <ConfirmContainer>
                    <Image source={iconPath.x_circle} style={{ width: 14, height: 14 }} />
                    <Space width='5px' />
                    <FontText
                        value={errorMessage}
                        textSize="14px"
                        textWeight="Medium"
                        lineHeight="16px"
                        textColor="#EB5147"
                    />
                </ConfirmContainer>
            )}
        </>
    );
};
export default ChangeNickNamePage;

const Container = styled.View`
    flex-direction: row;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #d4d4d4;
    padding: 8px 16px 8px 18.25px;
    margin: 34px 16px 0;
    background-color: ${COLOR.WHITE}
`;
const ConfirmContainer = styled.View`
    margin: 8px 25px;
    flex-direction: row;
`;
const SearchInput = styled(Input)`
    height: 36px;
    flex: 1;
`;