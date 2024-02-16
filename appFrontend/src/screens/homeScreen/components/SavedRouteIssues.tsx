import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontText, Space, TextButton } from '@/global/ui';
import { COLOR } from '@/global/constants';
import SavedRouteBox from './SavedRouteBox';
import IssueBox from './IssueBox';
import { useHomeNavigation } from '@/navigation/HomeNavigation';
import styled from '@emotion/native';

const categoryName: ['저장경로', '이슈'] = ['저장경로', '이슈'];

const SavedRouteIssues = () => {
  const homeNavigation = useHomeNavigation();
  const [activeButton, setActiveButton] = useState<'저장경로' | '이슈'>('저장경로');

  const handleButtonClick = (buttonText: typeof activeButton) => setActiveButton(buttonText);

  const renderButton = (text: typeof activeButton) => (
    <TouchableOpacity
      key={text}
      onPress={() => handleButtonClick(text)}
      style={[
        styles.navButton,
        {
          backgroundColor: activeButton === text ? '#474747' : 'white',
          borderColor: activeButton === text ? 'transparent' : COLOR.GRAY_EB,
        },
      ]}
    >
      <FontText
        value={text}
        textSize="13px"
        textWeight={activeButton === text ? 'SemiBold' : 'Regular'}
        lineHeight="19px"
        textColor={activeButton === text ? 'white' : COLOR.GRAY_999}
      />
    </TouchableOpacity>
  );

  return (
    <Container>
      <CategoryContainer>
        <Category>{categoryName.map(renderButton)}</Category>
        <TextButton
          value="저장경로 편집"
          textSize="12px"
          textColor={COLOR.GRAY_999}
          textWeight="Regular"
          onPress={() => homeNavigation.navigate('SavedRoutes')}
          lineHeight="15px"
        />
      </CategoryContainer>

      <Space height="1px" backgroundColor={COLOR.GRAY_EB} />

      {/* 최근검색: <RecentSearchBox />, TODO: MVP에서 제외*/}
      <ContentsBox>
        {
          {
            저장경로: <SavedRouteBox />,
            이슈: <IssueBox />,
          }[activeButton]
        }
      </ContentsBox>
    </Container>
  );
};

const styles = StyleSheet.create({
  navButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLOR.GRAY_EB,
    borderRadius: 17,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
});

export default SavedRouteIssues;
const Container = styled.View`
  margin: 16px 0 0;
  border-radius: 14px;
  background-color: ${COLOR.WHITE};
  flex: 1;
`;
const Category = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;
const CategoryContainer = styled.View`
  margin: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${COLOR.WHITE};
  flex: 1;
`;
const ContentsBox = styled.View`
  padding: 0px 16px 4px;
`;
