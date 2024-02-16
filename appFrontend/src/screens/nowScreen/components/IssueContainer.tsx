import React, { useState } from 'react';
import styled from '@emotion/native';
import { FontText, IconButton, Space } from '@/global/ui';
import { COLOR } from '@/global/constants';
import IssueModalTest from './IssueModalTest';

interface IssueDetailProps {
  id: number;
  title: string;
  location: string;
  time: string;
  body: string;
  isLastItemOfType?: boolean;
  isLastItem?: boolean;
}

const IssueContainer = ({
  id,
  title,
  location,
  time,
  body,
  isLastItemOfType,
  isLastItem,
}: IssueDetailProps) => {
  const [isIssueDetailOpened, setIsIssueDetailOpened] = useState<boolean>(false);

  const lastItemDetail = () => {
    if (isLastItemOfType && !isLastItem) {
      return (
        <>
          <Space height="12px" width="999px" backgroundColor={COLOR.WHITE} />
          <Space height="8px" width="999px" backgroundColor={COLOR.GRAY_F8} />
          <Space height="12px" width="999px" backgroundColor={COLOR.WHITE} />
        </>
      );
    } else if (isLastItem) {
      return <Space height="64px" width="999px" backgroundColor={COLOR.WHITE} />;
    } else return <Space height="1px" width="999px" backgroundColor={COLOR.GRAY_F8} />;
  };

  return (
    <>
      {isIssueDetailOpened && (
        <IssueModalTest id={id} onRequestClose={() => setIsIssueDetailOpened(false)} />
      )}
      <IssueList onPress={() => setIsIssueDetailOpened(true)}>
        <TextContainer>
          <FontText
            value={title}
            textSize="16px"
            textWeight="SemiBold"
            lineHeight="21px"
            numberOfLines={2}
          />
          <Space height="2px" />
          <FontText
            value={`${location} | ${time}`}
            textSize="11px"
            textWeight="Medium"
            lineHeight="13px"
          />
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
        <MapContainer>
          {/* TODO: 실제 지도로 바꾸기 */}
          <IconButton isFontIcon={false} imagePath="issueMap" iconWidth="72px" iconHeight="72px" />
        </MapContainer>
      </IssueList>
      {lastItemDetail()}
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
