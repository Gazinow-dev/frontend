// import styled from '@emotion/native';
// import { FontText } from '@/components/common/atoms';
// import { COLOR } from '@/constants';
// import React from 'react';

// const NicknameInput = () => {
//   return (
//     <Container>
//         <FontText
//           value="새 경로 이름"
//           textSize="14px"
//           textWeight="Medium"
//           lineHeight="21px"
//           textColor={COLOR.BASIC_BLACK}
//         />
//     </Container>
//   );
// };

// export default NicknameInput;

// const Container = styled.View`
//   background-color: ${COLOR.WHITE};
//   padding-horizontal: 16px;
//   flex: 1;
// `;
// const InputBox = styled.Pressable`
//   padding-vertical: 12px;
//   padding-horizontal: 16px;
//   margin-vertical: 7px;
//   border-radius: 5px;
//   background-color : ${COLOR.LIGHT_GRAY}
// `;
// const TextLengthBox = styled.View`
//   align-items: flex-end;
//   flex: 1;
// `;
// const BottomBtn = styled.Pressable`
//   padding-vertical: 11px;
//   border-radius: 5px;
//   align-items: center;
//   bottom: 41;
//   ${({ disabled }) =>
//     disabled ?
//       `background-color : #dddddd`
//       :
//       `background-color : ${COLOR.BASIC_BLACK};`
//   }
// `;

import styled from '@emotion/native';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';

import { FontText, Input } from '@/components/common/atoms';
import { IconButton, TextButton } from '@/components/common/molecules';
import { COLOR } from '@/constants';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useAppDispatch, useAppSelect } from '@/store';
import { getSearchText } from '@/store/modules/subwaySearchModule';
import { Image, View } from 'react-native';
import { iconPath } from '@/assets/icons/iconPath';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { Text } from 'react-native-svg';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@env';

const NicknameInput = ({
    navigation,
}: {
    navigation: NavigationProp<RootStackParamList, 'MyPageNavigation'>;
}) => {
    const rootNavigation = useRootNavigation();
    const dispatch = useAppDispatch();
    const { stationType } = useAppSelect(({ subwaySearch }) => subwaySearch);
    const submitNickname = (newNickname) => {
        try {
            // axios.post(API_BASE_URL)
            console.log(newNickname)
        }
        catch (err) {
            const error = err as AxiosError;
            console.log(error)
        }
    }

    navigation.setOptions({
        title: '닉네임 수정',
        headerRight: () => (
            <TextButton
                value="완료"
                textSize="16px"
                textColor={COLOR.GRAY_999}
                textWeight="Medium"
                lineHeight="21px"
                onPress={() => submitNickname(newNickname)}
            />
        ),
    })
    const [newNickname, setNewNickname] = useState<string>('');

    const backToScreen = () => {
        rootNavigation.goBack();
    };

    const changeNickname = (text: string) => {
        setNewNickname(text);
        sendSearchText(text);
    };

    const sendSearchText = useCallback(
        debounce((text: string) => {
            dispatch(getSearchText(text));
        }, 500),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const deleteInputText = () => {
        setNewNickname('');
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
            <ConfirmContainer>
                <Image source={iconPath.x_circle} style={{ width: 14, height: 14 }} />
                <FontText
                    value=" 중복된 닉네임입니다"
                    textSize="12px"
                    textWeight="Medium"
                    lineHeight="14px"
                    textColor={COLOR.GRAY_999}
                />
            </ConfirmContainer>
        </>
    );
};

export default NicknameInput;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #d4d4d4;
  padding: 4px 16px 4px 18.25px;
  margin: 34px 16px 0;
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
