import React from 'react';
import styled from '@emotion/native';
import { FontText, Space } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useGetSavedRoutesQuery } from '@/global/apis/hook';
import { FreshSubwayLineName, SubPath } from '@/global/apis/entity';
import { ScrollView } from 'react-native';
import { allLines, pathSubwayLineNameInLine } from '@/global/utils/subwayLine';

interface LaneButtonsProps {
  activeButton: string;
  setActiveButton: (activeButton: string) => void;
}

//TODO: + 버튼 구현
const LaneButtons = ({ activeButton, setActiveButton }: LaneButtonsProps) => {
  // 내가 저장한 경로의 노선만 가져옴
  const { data: savedRoutes } = useGetSavedRoutesQuery();
  const savedStations: string[] = savedRoutes?.reduce((acc, current) => {
    const { subPaths } = current;
    const lineOfSubPath = subPaths.map((sub: SubPath) => {
      return pathSubwayLineNameInLine(sub.lanes[0].stationCode);
    });
    return Array.from(new Set([...acc, ...lineOfSubPath])).sort();
  }, []);

  // savedStations에 없는 나머지 노선
  const otherStations: FreshSubwayLineName[] = allLines.filter(
    (line) => !savedStations.includes(line),
  );

  return (
    <>
      <IssueLineType>
        <FontText
          value={activeButton === '전체' ? '전체' : `${activeButton} NOW`}
          textSize="20px"
          textWeight="SemiBold"
          lineHeight="25px"
        />
      </IssueLineType>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ flexDirection: 'row', paddingVertical: 12 }}
      >
        <Space width="16px" />
        {['전체', ...savedStations, ...otherStations].map((text) => (
          <ButtonStyle
            key={text}
            onPress={() => setActiveButton(text)}
            activeButton={activeButton === text}
          >
            <FontText
              value={text}
              textSize="16px"
              textWeight="Medium"
              lineHeight="21px"
              textColor={activeButton === text ? 'white' : '#969696'}
            />
          </ButtonStyle>
        ))}
        <Space width="16px" />
      </ScrollView>
    </>
  );
};

const ButtonStyle = styled.TouchableOpacity<{ activeButton: boolean }>`
  border-width: 1px;
  border-color: ${({ activeButton }) => (activeButton ? 'transparent' : COLOR.GRAY_EB)};
  border-radius: 999px;
  padding-vertical: 8px;
  padding-horizontal: 16px;
  margin-right: 6px;
  background-color: ${({ activeButton }) => (activeButton ? '#171717' : 'white')};
`;
const IssueLineType = styled.View`
  padding: 24px 16px 12px;
`;
export default LaneButtons;
