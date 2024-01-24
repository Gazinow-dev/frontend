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

const HeaderLeft = styled.View`
  margin-left: 16px;
  flex-direction: row;
`;


// import React, { useEffect, useState } from 'react';
// import styled from '@emotion/native';
// import { debounce } from 'lodash';
// import { FontText, Input } from '@/components/common/atoms';
// import { IconButton, TextButton } from '@/components/common/molecules';
// import { COLOR } from '@/constants';
// import { useRootNavigation } from '@/navigation/RootNavigation';
// import { useAppDispatch } from '@/store';
// import { getSearchText } from '@/store/modules/subwaySearchModule';
// import { Image } from 'react-native';
// import { iconPath } from '@/assets/icons/iconPath';
// import { AxiosError } from 'axios';
// import { axiosInstance } from '@/apis/axiosInstance';

// const ChangeNickNamePage = () => {
//     const navigation = useRootNavigation();
//     const dispatch = useAppDispatch();

//     const [newNickname, setNewNickname] = useState<string>('');
//     const [isVaildNickname, setIsValidNickname] = useState<boolean>(false);

//     const changeNickname = (text: string) => {
//         setNewNickname(text);
//     };

//     const sendSearchText = debounce((text: string) => {
//         // 여기에서 서버로 요청하여 닉네임 중복 여부를 확인하고 결과를 setIsValidNickname에 반영합니다.
//         axiosInstance.post(`/api/v1/member/change_nickname`, { nickName: text })
//           .then(response => {
//             console.log(response)
//             const isValid = response.data.isValid;
//             setIsValidNickname(isValid);
//           })
//           .catch(error => {
//             console.error('Error checking nickname:', error);
//           });

//         // 임시로 디바운스된 함수 호출 시마다 isValid를 반전시킵니다.
//         setIsValidNickname((prev) => !prev);
//     }, 15000);

//     useEffect(() => {
//         // 검색어가 변경될 때마다 디바운스된 함수 호출
//         sendSearchText(newNickname);
//     }, [newNickname, sendSearchText]);

//     const deleteInputText = () => {
//         setNewNickname('');
//     };

//     const submitNickname = () => {
//         try {
//             axiosInstance.post(`/api/v1/member/change_nickname`, { nickName: newNickname });
//             console.log(newNickname);
//         } catch (err) {
//             const error = err as AxiosError;
//             console.log(error);
//         }
//     };

//     navigation.setOptions({
//         title: '닉네임 수정',
//         headerLeft: () => (
//             <HeaderLeft>
//                 <IconButton
//                     isFontIcon={false}
//                     imagePath="x"
//                     iconWidth="23px"
//                     iconHeight="23px"
//                     onPress={() => navigation.goBack()}
//                 />
//             </HeaderLeft>
//         ),
//         headerRight: () => (
//             <TextButton
//                 value="완료    "
//                 textSize="16px"
//                 textColor={COLOR.GRAY_999}
//                 textWeight="Medium"
//                 lineHeight="21px"
//                 onPress={submitNickname}
//             />
//         ),
//     });

//     return (
//         <>
//             <Container>
//                 <SearchInput
//                     value={newNickname}
//                     placeholder={`새 닉네임을 입력하세요`}
//                     placeholderTextColor={COLOR.BE_GRAY}
//                     inputMode="search"
//                     onChangeText={changeNickname}
//                     autoFocus
//                 />
//                 <IconButton
//                     iconType="Ionicons"
//                     isFontIcon
//                     iconName="close-circle"
//                     iconWidth="19.5"
//                     iconColor="rgba(0, 0, 0, 0.46)"
//                     onPress={deleteInputText}
//                 />
//             </Container>
//             <ConfirmContainer>
//                 <Image source={isVaildNickname ? iconPath.checked : iconPath.x_circle} style={{ width: 14, height: 14 }} />
//                 <FontText
//                     value={isVaildNickname ? ' 사용 가능한 닉네임입니다' : ' 중복된 닉네임입니다'}
//                     textSize="14px"
//                     textWeight="Medium"
//                     lineHeight="20px"
//                     textColor={isVaildNickname ? '#0BC73F' : '#EB5147'}
//                 />
//             </ConfirmContainer>
//         </>
//     );
// };

// export default ChangeNickNamePage;

// const Container = styled.View`
//   flex-direction: row;
//   align-items: center;
//   border-radius: 5px;
//   border: 1px solid #d4d4d4;
//   padding: 8px 16px 8px 18.25px;
//   margin: 34px 16px 0;
//   background-color: ${COLOR.WHITE}
// `;

// const ConfirmContainer = styled.View`
//   margin: 8px 25px;
//   flex-direction: row;
//   align-items: center;
// `;

// const SearchInput = styled(Input)`
//   height: 36px;
//   flex: 1;
// `;

// const HeaderLeft = styled.View`
//   margin-left: 16px;
//   flex-direction: row;
// `;
