import styled from '@emotion/native';
import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useSaveMyRoutesQuery } from '@/global/apis/hook';
import { useQueryClient } from 'react-query';
import { SubwaySimplePath } from '@/global/components';
import { Path, SubPath } from '@/global/apis/entity';
import { View, Keyboard } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import XCircle from '@assets/icons/x-circle.svg';

interface ModalProps {
  item: Path;
  onCancel: () => void;
  setDepth: Dispatch<SetStateAction<'search' | 'pathList' | 'detail' | 'name'>>;
}

const NameNewRouteModal = ({ item, onCancel, setDepth }: ModalProps) => {
  const [roadName, setRoadName] = useState<string>();
  const [isDuplicatedName, setIsDuplicatedName] = useState<boolean>(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const queryClient = useQueryClient();

  const keyboardDidShow = () => setKeyboardVisible(true);
  const keyboardDidHide = () => setKeyboardVisible(false);

  Keyboard.addListener('keyboardDidShow', keyboardDidShow);
  Keyboard.addListener('keyboardDidHide', keyboardDidHide);

  const freshSubPathData: SubPath[] = useMemo(() => {
    const subPaths = item?.subPaths || [];
    return subPaths.filter((subPath) => !!subPath.lanes.length && !!subPath.stations.length);
  }, [item]);

  const { mutate } = useSaveMyRoutesQuery({
    onSuccess: async () => {
      await queryClient.invalidateQueries('getRoads');
      setDepth('search');
      onCancel();
    },
    onError: async (error: any) => {
      await queryClient.invalidateQueries('getRoads');
      if (error.response.status === 409) {
        setIsDuplicatedName(true);
      }
    },
  });

  return (
    //FIXME: 풀블리드버튼 올라올 떄 애니메이션이 부자연스러움
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Container>
        <SubPathContainer>
          <SubwaySimplePath
            pathData={freshSubPathData}
            arriveStationName={item.lastEndStation}
            betweenPathMargin={24}
          />
        </SubPathContainer>
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
            value={roadName}
            onChangeText={(text) => setRoadName(text)}
            inputMode="email"
            maxLength={10}
            placeholderTextColor={COLOR.GRAY_999}
          ></Input>
        </InputBox>
        <TextLengthBox>
          {isDuplicatedName ? (
            <MessageContainer>
              <XCircle width={14} />
              <FontText
                value={` 이미 존재하는 이름입니다`}
                textSize="12px"
                textWeight="Medium"
                lineHeight="14px"
                textColor={COLOR.LIGHT_RED}
              />
            </MessageContainer>
          ) : (
            <View></View>
          )}
          <FontText
            value={`${roadName?.length ? roadName.length : 0}/10`}
            textSize="12px"
            textWeight="Regular"
            textColor={COLOR.GRAY_999}
            lineHeight="14px"
          />
        </TextLengthBox>
      </Container>
      <BottomBtn
        style={{
          marginBottom: isKeyboardVisible ? 0 : 41,
          marginHorizontal: isKeyboardVisible ? -30 : 16,
        }}
        onPress={() => {
          mutate({
            roadName: roadName,
            lastEndStation: item.lastEndStation,
            totalTime: item.totalTime,
            subPaths: freshSubPathData,
          });
        }}
        disabled={!roadName}
      >
        <FontText
          value="완료"
          textSize="17px"
          textWeight="SemiBold"
          textColor={COLOR.WHITE}
          lineHeight="26px"
        />
      </BottomBtn>
    </KeyboardAvoidingView>
  );
};

export default NameNewRouteModal;

const Container = styled.View`
  background-color: ${COLOR.WHITE};
  padding-horizontal: 16px;
  flex: 1;
`;
const SubPathContainer = styled.View`
  margin: 32px 33px 22px;
`;
const InputBox = styled.Pressable`
  padding-vertical: 12px;
  padding-horizontal: 16px;
  margin-vertical: 7px;
  border-radius: 5px;
  background-color: ${COLOR.GRAY_F9};
`;
const TextLengthBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
`;
const MessageContainer = styled.View`
  flex-direction: row;
  margin: 0 0 0 9px;
  align-items: center;
  height: 14px;
`;
const BottomBtn = styled.Pressable`
  padding-vertical: 11px;
  border-radius: 5px;
  align-items: center;
  ${({ disabled }) =>
    disabled ? `background-color : #dddddd` : `background-color : ${COLOR.BASIC_BLACK};`}
`;
