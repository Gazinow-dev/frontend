import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { FontText, TextButton, Space } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useGetSavedRoutesQuery } from '@/global/apis/hook';
import styled from '@emotion/native';
import { SubwaySimplePath } from '@/global/components';
import { Path, RenderSavedRoutesType } from '@/global/apis/entity';
import IconRightArrowHead from '@/assets/icons/right_arrow_head.svg';
import { useHomeNavigation } from '@/navigation/HomeNavigation';

const SavedRouteBox = () => {
  const homeNavigation = useHomeNavigation();
  const { data: savedRoutes } = useGetSavedRoutesQuery();
  const isRoutesExist = savedRoutes && savedRoutes.length > 0;
  const [selectedRoute, setSelectedRoute] = useState<Path | null>(null);

  const [hasIssueRoutes, setHasIssueRoutes] = useState<RenderSavedRoutesType[]>([]);

  useEffect(() => {
    if (selectedRoute) {
      homeNavigation.push('SavedRoutesDetail', { state: selectedRoute! });
    }
  }, [selectedRoute]);

  useEffect(() => {
    if (savedRoutes) {
      const issueRoutes = savedRoutes.filter((savedRoute) => {
        return savedRoute.subPaths.some((subPath) =>
          subPath.stations.some((station) => station.issueSummary !== null),
        );
      });
      setHasIssueRoutes(issueRoutes);
    }
  }, [savedRoutes]);

  if (isRoutesExist) {
    return (
      <View>
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
              <Pressable hitSlop={20} onPress={() => setSelectedRoute(item)}>
                <TextContainer>
                  <TextButton
                    value="세부정보"
                    textSize="13px"
                    textWeight="Regular"
                    lineHeight="19px"
                    textColor={COLOR.GRAY_999}
                    onPress={() => setSelectedRoute(item)}
                  />
                  <Space width="4px" />
                  <IconRightArrowHead color={COLOR.GRAY_999} />
                </TextContainer>
              </Pressable>
            </TitleContainer>
            {/* 각 경로별로 수정하기 */}
            {!hasIssueRoutes && (
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
