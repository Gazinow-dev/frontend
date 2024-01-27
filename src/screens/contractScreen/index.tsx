import styled from '@emotion/native';

import { useRootNavigation } from '@/navigation/RootNavigation';
import { FontText, Space } from '@/global/ui';

const ContractScreen = () => {
  const navigation = useRootNavigation();

  return (
    <Container>
      <AlertContainer>
        <FontText value={`약관`} textSize="24px" textWeight="Bold" lineHeight="32px" />
        <Space height="20px" />
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
    </Container>
  );
};
export default ContractScreen;

const Container = styled.View`
  background-color: white;
  padding: 0 16px;
  flex: 1;
`;
const AlertContainer = styled.View`
  flex: 1;
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
