import styled from '@emotion/native';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';

import { FontText, Input } from '@/components/common/atoms';
import { IconButton, TextButton } from '@/components/common/molecules';
import { COLOR } from '@/constants';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useAppDispatch } from '@/store';
import { getSearchText } from '@/store/modules/subwaySearchModule';
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
    const dispatch = useAppDispatch();

    const submitNickname = (newNickname: string) => {
        try {
            axiosInstance.post(`/api/v1/member/change_nickname`, { nickName: newNickname })
            console.log(newNickname)
        }
        catch (err) {
            const error = err as AxiosError;
            console.log(error)
        }
    }

    const [newNickname, setNewNickname] = useState<string>('');

    const changeNickname = (text: string) => {
        setNewNickname(text);
        sendSearchText(text);
    };

    const sendSearchText = useCallback(
        debounce((text: string) => {
            dispatch(getSearchText(text));
            console.log('dkdk')
        }, 500),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const deleteInputText = () => {
        setNewNickname('');
    };

    const isVaildNickname = false;

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
            {isVaildNickname ? (
                <ConfirmContainer>
                    <Image source={iconPath.checked} style={{ width: 14, height: 10 }} />
                    <FontText
                        value=" 사용 가능한 닉네임입니다"
                        textSize="14px"
                        textWeight="Medium"
                        lineHeight="20px"
                        textColor="#0BC73F"
                    />
                </ConfirmContainer>
            ) : (
                <ConfirmContainer>
                    <Image source={iconPath.x_circle} style={{ width: 14, height: 14 }} />
                    <FontText
                        value=" 중복된 닉네임입니다"
                        textSize="14px"
                        textWeight="Medium"
                        lineHeight="20px"
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
  align-items: center;
`;
const SearchInput = styled(Input)`
  height: 36px;
  flex: 1;
`;