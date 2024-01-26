import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from '@/components/common/molecules';
import styled from '@emotion/native';
import { FontText } from '@/components/common/atoms';
import { COLOR, EDIT_ROUTE_NAVIGATION, ADD_NEW_ROUTE_PAGE } from '@/constants';
import { RenderSavedRoutes } from '@/components/savedRoutes';
import { useRootNavigation } from '@/navigation/RootNavigation';

const SavedRoutes = () => {
  const rootNavigation = useRootNavigation();
  return (
    <Container>
      <View style={styles.container}>
        <RenderSavedRoutes />
        <AddContainer onPress={() => rootNavigation.navigate(EDIT_ROUTE_NAVIGATION, { screen: ADD_NEW_ROUTE_PAGE })}>
          <IconButton isFontIcon={false} imagePath="addRoute" iconWidth="20px" iconHeight="20px" />
          <FontText value="  추가하기" textSize="16px" textWeight="Medium" lineHeight="21px" textColor={COLOR.GRAY_999} />
        </AddContainer>
      </View>
    </Container>
  );
};
export default SavedRoutes;
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 15,
  },
});
const Container = styled.View`
  padding: 0 16px;
  flex-direction: column;
  background-color: ${COLOR.LIGHT_GRAY};
`;
const AddContainer = styled.Pressable`
  padding: 0px 0px 20px;
  alignItems: center;
  justifyContent: center;
  flex-direction: row;
`;