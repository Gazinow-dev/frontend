import styled from '@emotion/native';

import { IconButton, TextButton } from '@/components/common/molecules';
import { FontText, Space } from '@/components/common/atoms';
import COLOR from '@/constants/color';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { AxiosError } from 'axios';
import { axiosInstance } from '@/apis/axiosInstance';

const ConfirmQuitPage = () => {
    const nickName = '사용자17349245'
    const navigation = useRootNavigation();

    const onPressQuit = async () => {
        console.log('탈퇴 버튼 클릭');
    
        try {
            await axiosInstance.delete('/api/v1/member/delete_member', {
                data: {}
            });
            console.log('탈퇴 요청 성공');
        } catch (err) {
            const error = err as AxiosError;
            console.error('탈퇴 요청 실패:', error.response?.data);
        }
    };
    
    return (
        <Container>
            <AlertContainer>
                <FontText
                    value={`${nickName}님,\n정말 탈퇴하시겠어요?`}
                    textSize="24px"
                    textWeight="Bold"
                    lineHeight="32px"
                />
                <Space height='20px' />
                <FontText
                    value={`탈퇴 시 계정의 모든 정보는 삭제되고\n재가입 시에도 복구하기 어려워요.`}
                    textSize="16px"
                    textWeight="Regular"
                    lineHeight="21px"
                />
            </AlertContainer>
            <MenuContainer>
                <QuitBtn>
                    <TextButton
                        value="탈퇴할래요"
                        textSize="13px"
                        textWeight="Regular"
                        lineHeight="18px"
                        textColor={COLOR.GRAY_999}
                        onPress={() => onPressQuit()}
                    />
                </QuitBtn>
                <BottomBtn onPress={() => navigation.goBack()}>
                    <TextButton
                        value="취소"
                        textSize="17px"
                        textWeight="Regular"
                        lineHeight="26px"
                        textColor={COLOR.WHITE}
                    />
                </BottomBtn>
            </MenuContainer>
        </Container >
    );
};
export default ConfirmQuitPage;

const Container = styled.View`
  background-color: white;
  padding: 0 16px;
  flex: 1;
`;
const AlertContainer = styled.Pressable`
  flex:1;
  margin-top: 29px;
`;
const MenuContainer = styled.Pressable`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 76px;
  align-items: center;
`;
const QuitBtn = styled.Pressable`
  margin-left: 17px;
  border-bottom-width: 1px;
  border-bottom-color: ${COLOR.GRAY_999};
`;
const BottomBtn = styled.Pressable`
  padding-vertical: 11px;
  margin-left: 28px;
  border-radius: 5px;
  align-items: center;
  flex: 1;
  background-color : ${COLOR.BASIC_BLACK};
`;