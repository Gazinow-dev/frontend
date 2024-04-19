import React from 'react';
import styled from '@emotion/native';
import { FontText, Space } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useAppDispatch } from '@/store';
import { getIssueId } from '@/store/modules';
import { useRootNavigation } from '@/navigation/RootNavigation';
import dayjs from 'dayjs';
import LaneCapsulesPerIssue from './LaneCapsulesPerIssue';
import { IssueContent } from '@/global/apis/entity';

interface IssueContainerProps {
  isLastItem: boolean;
  issue: IssueContent;
  isHeader?: boolean;
}

const IssueContainer = ({ isLastItem, isHeader, issue }: IssueContainerProps) => {
  const { id, title, lines, startDate, content } = issue;

  const dispatch = useAppDispatch();
  const navigation = useRootNavigation();

  return (
    <>
      <LaneCapsulesPerIssue lanes={lines} />
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
          <Space height="4px" />
          <FontText
            value={dayjs(startDate).fromNow()}
            textSize="14px"
            textWeight="Regular"
            lineHeight="21px"
            textColor={COLOR.GRAY_999}
          />
          <Space height="4px" />
          <FontText
            value={content}
            textSize="14px"
            textWeight="Regular"
            lineHeight="21px"
            textColor="#6A6A6A"
            numberOfLines={2}
          />
        </TextContainer>
        <Space width="12px" />
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
  padding: 0 16px 16px;
  flex-direction: row;
`;
const TextContainer = styled.View`
  flex: 3.3;
`;
export default IssueContainer;
