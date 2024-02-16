import styled, { css } from '@emotion/native';
import { Pressable, ScrollView, View } from 'react-native';
import { FontText, Space } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { SubwaySimplePath } from '@/global/components';
import { useGetSearchPaths } from '@/global/apis/hook';
import { Dispatch, SetStateAction } from 'react';
import { Path } from '@/global/apis/entity';
import { StationDataTypes } from '@/store/modules';

interface SelectedStationTypes {
  departure: StationDataTypes;
  arrival: StationDataTypes;
}
interface SelectNewRouteProps {
  setDepth: Dispatch<SetStateAction<'search' | 'pathList' | 'detail' | 'name'>>;
  seletedStation: SelectedStationTypes;
  selectedRoutePath: Path | null;
  setSelectedRoutePath: Dispatch<SetStateAction<Path | null>>;
}

const SelectNewRouteModal = ({
  setDepth,
  seletedStation,
  selectedRoutePath,
  setSelectedRoutePath,
}: SelectNewRouteProps) => {
  const { data } = useGetSearchPaths({
    strStationName: seletedStation.departure.stationName,
    strStationLine: seletedStation.departure.stationLine,
    endStationName: seletedStation.arrival.stationName,
    endStationLine: seletedStation.arrival.stationLine,
  });

  return (
    <Container>
      <SubPathContainer>
        <ScrollView>
          {data?.paths.map((item) => {
            return (
              <PathInner
                key={item.firstStartStation + item.totalTime}
                onPress={() => {
                  setSelectedRoutePath(item);
                  setDepth('detail');
                }}
              >
                <PathTitleInfoBox>
                  <View>
                    <FontText
                      value="평균 소요시간"
                      textSize="11px"
                      textWeight="SemiBold"
                      lineHeight="13px"
                      textColor="#999"
                    />
                    <Space height="4px" />
                    <FontText
                      value={`${item.totalTime}분`}
                      textSize="20px"
                      textWeight="SemiBold"
                      lineHeight="25px"
                      textColor={COLOR.BASIC_BLACK}
                    />
                  </View>
                  <RadioButtonContainer
                    selected={selectedRoutePath === item}
                    onPress={() => {
                      setSelectedRoutePath(item);
                    }}
                  >
                    {selectedRoutePath === item && <InnerCircle />}
                  </RadioButtonContainer>
                </PathTitleInfoBox>
                <SubwaySimplePath
                  pathData={item.subPaths}
                  arriveStationName={item.lastEndStation}
                  betweenPathMargin={24}
                />
              </PathInner>
            );
          })}
          <Space height="1px" backgroundColor={COLOR.GRAY_EB} />
        </ScrollView>
      </SubPathContainer>

      <BottomBtn onPress={() => setDepth('name')} disabled={selectedRoutePath === null}>
        <FontText
          value="다음"
          textSize="17px"
          textWeight="SemiBold"
          textColor={COLOR.WHITE}
          lineHeight="26px"
        />
      </BottomBtn>
    </Container>
  );
};

export default SelectNewRouteModal;

const Container = styled.View`
  background-color: ${COLOR.WHITE};
  flex: 1;
`;
const SubPathContainer = styled.View`
  padding-bottom: 30px;
  flex: 1;
`;
const PathTitleInfoBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 8px;
`;
const PathInner = styled.Pressable`
  padding: 20px 16px 8px;
  border-top-color: ${COLOR.GRAY_EB};
  border-top-width: 1px;
`;
const RadioButtonContainer = styled(Pressable)<{ selected?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: gray;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.selected &&
    css`
      border-color: blue;
    `}
`;
const InnerCircle = styled.View`
  width: 11px;
  height: 11px;
  border-radius: 6px;
  background-color: blue;
`;
const BottomBtn = styled.Pressable`
  padding-vertical: 11px;
  margin-horizontal: 16px;
  border-radius: 5px;
  align-items: center;
  bottom: 41px;
  ${({ disabled }) =>
    disabled ? `background-color : #dddddd` : `background-color : ${COLOR.BASIC_BLACK};`}
`;
