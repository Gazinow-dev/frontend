import React, { useState } from 'react';
import { View } from 'react-native';
import { FontText, TextButton, Space } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useGetSavedRoutesQuery } from '@/global/apis/hook';
import styled from '@emotion/native';
import { SubwaySimplePath } from '@/global/components';
import { Path, RenderSavedRoutesType } from '@/global/apis/entity';
import NewRouteDetailModal from '@/screens/savedRoutesScreen/components/NewRouteDetailModal';
import MoreBtn from '@/assets/icons/moreBtn.svg';

const SavedRouteBox = () => {
  const { data: savedRoutes } = useGetSavedRoutesQuery();
  const isRoutesExist = savedRoutes && savedRoutes.length > 0;
  const [isRouteDetailOpened, setIsRouteDetailOpened] = useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = useState<Path | null>(null);

  if (isRoutesExist) {
    return (
      <View>
        {isRouteDetailOpened && selectedRoute && (
          <NewRouteDetailModal
            item={selectedRoute}
            onRequestClose={() => setIsRouteDetailOpened(false)}
          />
        )}
        {savedRoutes?.map((item: RenderSavedRoutesType, index: number) => (
          <RouteContainer key={item.id}>
            {index !== 0 && (
              <BorderContainer>
                <Space height="1px" width="999px" backgroundColor={COLOR.GRAY_EB} />
              </BorderContainer>
            )}
            <TitleContainer>
              <TextContainer>
                <FontText
                  value={item.roadName}
                  textSize="18px"
                  textWeight="Bold"
                  lineHeight="23px"
                  textColor={COLOR.BASIC_BLACK}
                />
                <Space width="8px" />
                <FontText
                  value={`${item.totalTime}분 소요`}
                  textSize="12px"
                  textWeight="Medium"
                  lineHeight="15px"
                  textColor={COLOR.GRAY_999}
                />
              </TextContainer>
              <TextContainer>
                <TextButton
                  value="세부정보"
                  textSize="13px"
                  textWeight="Regular"
                  lineHeight="19px"
                  textColor={COLOR.GRAY_999}
                  onPress={() => {
                    setIsRouteDetailOpened(true);
                    setSelectedRoute(item);
                  }}
                />
                <Space width="4px" />
                <MoreBtn
                  onPress={() => {
                    setIsRouteDetailOpened(true);
                    setSelectedRoute(item);
                  }}
                />
              </TextContainer>
            </TitleContainer>
            {!item.issues && (
              <IssueContainer>
                <FontText
                  value="아무런 이슈가 없어요!"
                  textSize="13px"
                  textWeight="Regular"
                  lineHeight="19px"
                  textColor={COLOR.GRAY_999}
                />
              </IssueContainer>
            )}
            <SubwaySimplePath
              pathData={item.subPaths}
              arriveStationName={item.lastEndStation}
              betweenPathMargin={24}
            />
          </RouteContainer>
        ))}
      </View>
    );
  } else {
    return (
      <FontText
        value="저장한 경로가 없어요"
        textSize="13px"
        textWeight="Regular"
        lineHeight="500px"
        textColor={COLOR.GRAY_999}
        textAlign="center"
      />
    );
  }
};

export default SavedRouteBox;

const RouteContainer = styled.View`
  padding-bottom: 4px;
`;
const TextContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const BorderContainer = styled.View`
  margin-start: -99px;
`;
const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`;
const IssueContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  margin-top: 8px;
`;
