import React from 'react';
import styled from '@emotion/native';
import { FontText, Space } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useAppDispatch } from '@/store';
import { getIssueId } from '@/store/modules';
import { useRootNavigation } from '@/navigation/RootNavigation';

interface IssueDetailProps {
  id: number;
  title: string;
  // {/* TODO: mvp 이후 장소 넣기 */}
  location?: string;
  time: string;
  body: string;
  isLastItem: boolean;
  isHeader: boolean;
}

const IssueContainer = ({
  id,
  title,
  location,
  time,
  body,
  isLastItem,
  isHeader,
}: IssueDetailProps) => {
  const dispatch = useAppDispatch();
  const navigation = useRootNavigation();

  return (
    <>
      <IssueList
        onPress={() => {
          dispatch(getIssueId(id));
          navigation.navigate('IssueStack', { screen: 'IssueDetail' });
        }}
      >
        <TextContainer>
          <FontText
            value={title}
            textSize="16px"
            textWeight="SemiBold"
            lineHeight="21px"
            numberOfLines={2}
          />
          <Space height="2px" />
          {/* TODO: mvp 이후 장소 넣기 */}
          {/* <FontText
            value={`${location} | ${time}`}
            textSize="11px"
            textWeight="Medium"
            lineHeight="13px"
          /> */}
          <FontText value={time} textSize="11px" textWeight="Medium" lineHeight="13px" />
          <Space height="6px" />
          <FontText
            value={body}
            textSize="12px"
            textWeight="Regular"
            lineHeight="15px"
            numberOfLines={2}
          />
        </TextContainer>
        <Space width="12px" />
        {/* TODO: mvp 이후 이미지 생기면 넣기 */}
        {/* <MapContainer>
          <IconButton isFontIcon={false} imagePath="issueMap" iconWidth="72px" iconHeight="72px" />
        </MapContainer> */}
      </IssueList>
      {!isLastItem && <Space height="1px" width="999px" backgroundColor={COLOR.GRAY_F8} />}
      {isHeader && isLastItem && (
        <>
          <Space height="12px" width="999px" backgroundColor={COLOR.WHITE} />
          <Space height="8px" width="999px" backgroundColor={COLOR.GRAY_F8} />
          <Space height="12px" width="999px" backgroundColor={COLOR.WHITE} />
        </>
      )}
    </>
  );
};

const IssueList = styled.Pressable`
  padding: 16px 16px;
  flex-direction: row;
`;
const TextContainer = styled.View`
  flex: 3.3;
`;
const MapContainer = styled.View`
  flex: 1;
`;
export default IssueContainer;
