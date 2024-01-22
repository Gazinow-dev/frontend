import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontText } from '@/components/common/atoms';
import { COLOR, EDIT_ROUTE_NAVIGATION, SAVED_ROUTES_PAGE } from '@/constants';
import { IssueBox, SavedRouteBox, RecentSearchBox } from '@/components/home/organism';
import { TextButton } from '@/components/common/molecules';
import { useNavigation } from '@react-navigation/native';
import { SavedRoutesPage } from '@/pages/savedRoutes';
import { useEditRouteNavigation } from '@/navigation/EditRouteNavigation';
const SavedRouteIssues = () => {
  const editRouteNavigation = useEditRouteNavigation();
  const [activeButton, setActiveButton] = useState<'저장경로' | '최근검색' | '이슈'>('저장경로');

  const handleButtonClick = (buttonText: string) => setActiveButton(buttonText);

  const renderButton = (text: string) => (
    <TouchableOpacity
      key={text}
      onPress={() => handleButtonClick(text)}
      style={[styles.navButton, { backgroundColor: activeButton === text ? '#474747' : 'white' }]}
    >
      <FontText
        value={text}
        textSize="16px"
        textWeight="Medium"
        lineHeight="31px"
        textColor={activeButton === text ? 'white' : 'black'}
      />
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeButton) {
      case '저장경로':
        return <SavedRouteBox />;
      case '최근검색':
        return <RecentSearchBox />;
      case '이슈':
        return <IssueBox />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* 이슈/저장경로/최근검색 버튼 */}
      <View style={styles.navContainer}>
        <View style={styles.textContainer}>{['저장경로', '최근검색', '이슈'].map(renderButton)}</View>
        <TextButton
          value="저장경로 편집"
          textSize="16px"
          textColor={COLOR.GRAY_999}
          textWeight="Medium"
          onPress={() => editRouteNavigation.navigate(EDIT_ROUTE_NAVIGATION, { screen: SAVED_ROUTES_PAGE})}
          lineHeight="21px"
        />
      </View>

      {/* 중앙선 */}
      <View style={styles.borderLine}></View>

      {/* 버튼에 따라 다른 컴포넌트를 렌더링 */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 17,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  navContainer: {
    paddingBottom: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 40,
    paddingHorizontal: 10,
    marginRight: 6,
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
