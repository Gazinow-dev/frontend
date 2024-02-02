import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontText, TextButton } from '@/global/ui';
import { COLOR, EDIT_ROUTE_NAVIGATION, SAVED_ROUTES } from '@/global/constants';
import { useRootNavigation } from '@/navigation/RootNavigation';
import SavedRouteBox from './SavedRouteBox';
import RecentSearchBox from './RecentSearchBox';
import IssueBox from './IssueBox';

const categoryName: ['저장경로', '최근검색', '이슈'] = ['저장경로', '최근검색', '이슈'];

const SavedRouteIssues = () => {
  const rootNavigation = useRootNavigation();
  const [activeButton, setActiveButton] = useState<'저장경로' | '최근검색' | '이슈'>('저장경로');

  const handleButtonClick = (buttonText: typeof activeButton) => setActiveButton(buttonText);

  const renderButton = (text: typeof activeButton) => (
    <TouchableOpacity
      key={text}
      onPress={() => handleButtonClick(text)}
      style={[
        styles.navButton,
        {
          backgroundColor: activeButton === text ? '#474747' : 'white',
          borderColor: activeButton === text ? 'transparent' : '#EBEBEB',
        },
      ]}
    >
      <FontText
        value={text}
        textSize="13px"
        textWeight="Medium"
        lineHeight="19px"
        textColor={activeButton === text ? 'white' : 'black'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 이슈/저장경로/최근검색 버튼 */}
      <View style={styles.navContainer}>
        <View style={styles.textContainer}>{categoryName.map(renderButton)}</View>
        <TextButton
          value="저장경로 편집"
          textSize="12px"
          textColor={COLOR.GRAY_999}
          textWeight="Regular"
          onPress={() => rootNavigation.navigate(EDIT_ROUTE_NAVIGATION, { screen: SAVED_ROUTES })}
          lineHeight="15px"
        />
      </View>

      {/* 중앙선 */}
      <View style={styles.borderLine}></View>

      {/* 버튼에 따라 다른 컴포넌트를 렌더링 */}
      <ScrollView>
        {
          {
            저장경로: <SavedRouteBox />,
            최근검색: <RecentSearchBox />,
            이슈: <IssueBox />,
          }[activeButton]
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 215,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  navContainer: {
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 17,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  borderLine: {
    borderWidth: 1,
    borderColor: '#F2F2F2',
    flex: 1,
    marginHorizontal: -17,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SavedRouteIssues;