import styled from '@emotion/native';
import type { NavigationProp } from '@react-navigation/native';

import { FontText, Input } from '@/components/common/atoms';
import { COLOR } from '@/constants';
import { RootStackParamList } from '@/types/navigation';
import React, { useState } from 'react';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { AxiosError } from 'axios';
import { axiosInstance } from '@/apis/axiosInstance';
import { AddRouteTypes } from '@/types/apis';

const dummy = [
  { time: '45분', departureName: '신용산역', departureLine: '4', arrivalLine: '2' },
  { time: '45분', departureName: '신용산역', departureLine: '4', arrivalLine: '2' },
];

const NameNewRoutePage = ({
  navigation, route
}: {
  navigation: NavigationProp<RootStackParamList, 'SearchNavigation'>;
}) => {
  const rootNavigation = useRootNavigation();
  const [newRouteName, setNewRouteName] = useState<string | null>();

  const saveRoute = async (newRouteName: string | null | undefined, selectedRouteId: number) => {
    const newRoute = {
      roadName: newRouteName,
      totalTime: 0,
      subwayTransitCount: 0,
      firstStartStation: "string",
      lastEndStation: "string",
      subPaths: [
        {
          trafficType: 1,
          distance: 0,
          sectionTime: 0,
          stationCount: 0,
          lanes: [
            {
              name: "string",
              subwayCode: 0,
              startName: "string",
              endName: selectedRouteId,
            }
          ],
          subways: [
            {
              index: selectedRouteId,
              stationName: "압구정",
            }
          ]
        }
      ]
    };

    try {
      const res = await axiosInstance.post<{ newRoute: AddRouteTypes }>(
        '/api/v1/my_find_road/add_route',
        newRoute,
      );
      return res
    } catch (err) {
      const er = err as AxiosError;
      throw er;
    }
  };

  return (
    <Container>
      {/* 경로 그래프 */}
        <FontText
          value="새 경로 이름"
          textSize="14px"
          textWeight="Medium"
          lineHeight="21px"
          textColor={COLOR.BASIC_BLACK}
        />

      <InputBox>
        <Input
          placeholder="경로 이름을 입력하세요"
          value={newRouteName}
          onChangeText={(text) => setNewRouteName(text)}
          inputMode="email"
          maxLength={10}
        >
        </Input>
      </InputBox>

      <TextLengthBox>
        <FontText
          value={`${newRouteName?.length ? newRouteName.length : 0}/10`}
          textSize='12px'
          textWeight='Regular'
          textColor={COLOR.GRAY_999}
          lineHeight='14px'
        />
      </TextLengthBox>

      <BottomBtn onPress={() => {
        saveRoute(newRouteName, route.params.pathId);
        rootNavigation.popToTop();
      }}
        disabled={!newRouteName}
      >
        <FontText
          value="완료"
          textSize="17px"
          textWeight="SemiBold"
          textColor={COLOR.WHITE}
          lineHeight="26px"
        />
      </BottomBtn>

    </Container>
  );
};

export default NameNewRoutePage;

const Container = styled.View`
  background-color: ${COLOR.WHITE};
  padding-horizontal: 16px;
  flex: 1;
`;
const InputBox = styled.Pressable`
  padding-vertical: 12px;
  padding-horizontal: 16px;
  margin-vertical: 7px;
  border-radius: 5px;
  background-color : ${COLOR.LIGHT_GRAY}
`;
const TextLengthBox = styled.View`
  align-items: flex-end;
  flex: 1;
`;
const BottomBtn = styled.Pressable`
  padding-vertical: 11px;
  border-radius: 5px;
  align-items: center;
  bottom: 41px;
  ${({ disabled }) =>
    disabled ?
      `background-color : #dddddd`
      :
      `background-color : ${COLOR.BASIC_BLACK};`
  }
`;