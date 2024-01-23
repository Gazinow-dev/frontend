import styled from '@emotion/native';

import { IconButton, TextButton } from '@/components/common/molecules';
import { FontText, Space } from '@/components/common/atoms';
import COLOR from '@/constants/color';
import { useRootNavigation } from '@/navigation/RootNavigation';

const ContractPage = () => {
    const navigation = useRootNavigation();

    navigation.setOptions({
        title: '',
        headerLeft: () => (
            <HeaderLeft >
                <IconButton
                    isFontIcon={false}
                    imagePath="backBtn"
                    iconWidth="27px"
                    iconHeight="20px"
                    onPress={() => navigation.goBack()}
                />
            </HeaderLeft>
        ),
    })
    return (
        <Container>
            <AlertContainer>
                <FontText
                    value={`약관`}
                    textSize="24px"
                    textWeight="Bold"
                    lineHeight="32px"
                />
                <Space height='20px' />
                <FontText
                    value={`약관........약관`}
                    textSize="16px"
                    textWeight="Regular"
                    lineHeight="21px"
                />
            </AlertContainer>
            {/* <MenuContainer>
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
            </MenuContainer> */}
        </Container >
    );
};
export default ContractPage;

const Container = styled.View`
  background-color: white;
  padding: 0 16px;
  flex: 1;
`;
const AlertContainer = styled.View`
  flex:1;
  margin-top: 29px;
`;
// const MenuContainer = styled.Pressable`
//   flex-direction: row;
//   justify-content: space-between;
//   padding-bottom: 76px;
//   align-items: center;
// `;
// const QuitBtn = styled.Pressable`
//   margin-left: 17px;
//   border-bottom-width: 1px;
//   border-bottom-color: ${COLOR.GRAY_999};
// `;
// const BottomBtn = styled.Pressable`
//   padding-vertical: 11px;
//   margin-left: 28px;
//   border-radius: 5px;
//   align-items: center;
//   flex: 1;
//   background-color : ${COLOR.BASIC_BLACK};
// `;
const HeaderLeft = styled.View`
  margin-left: 10px;
  flex-direction: row;
`;