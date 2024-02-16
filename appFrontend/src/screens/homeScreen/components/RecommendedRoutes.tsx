import React, { useState } from 'react';
import { FontText, Space } from '@/global/ui';
import { COLOR } from '@/global/constants';
import styled from '@emotion/native';
import { SubwaySimplePath } from '@/global/components';
import { RenderSavedRoutesType } from '@/global/apis/entity';
import NewRouteDetailModal from '@/screens/savedRoutesScreen/components/NewRouteDetailModal';
import MoreBtn from '@/assets/icons/moreBtn.svg';

interface RecommendedRouteProps {
  pathData: RenderSavedRoutesType;
}

const RecommendedRoutes = ({ pathData }: RecommendedRouteProps) => {
  const [isRouteDetailOpened, setIsRouteDetailOpened] = useState<boolean>(false);

  return (
    <Container>
      {isRouteDetailOpened && (
        <NewRouteDetailModal item={pathData} onRequestClose={() => setIsRouteDetailOpened(false)} />
      )}
      <TextContainer>
        <TextContainer>
          <FontText
            value="대체경로"
            textSize="16px"
            textWeight="SemiBold"
            lineHeight="21px"
            textColor={COLOR.BASIC_BLACK}
          />
          <Space width="8px" />
          <FontText
            value={`평균 ${pathData.totalTime}분`}
            textSize="12px"
            textWeight="Regular"
            lineHeight="15px"
            textColor={COLOR.GRAY_999}
          />
        </TextContainer>
        <TextContainer onPress={() => setIsRouteDetailOpened(true)}>
          <FontText
            value="세부정보"
            textSize="13px"
            textWeight="Regular"
            lineHeight="19px"
            textColor={COLOR.GRAY_999}
          />
          <Space width="4px" />
          <MoreBtn onPress={() => setIsRouteDetailOpened(true)} />
        </TextContainer>
      </TextContainer>
      <Space height="4px" />
      <SubwaySimplePath
        pathData={pathData.subPaths}
        arriveStationName={pathData.lastEndStation}
        betweenPathMargin={24}
      />
    </Container>
  );
};
export default RecommendedRoutes;

const Container = styled.View`
  background: #f7f7f9;
  padding: 16px 16px 0;
  border-radius: 8px;
  margin: 8px 2px 0;
`;
const TextContainer = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
