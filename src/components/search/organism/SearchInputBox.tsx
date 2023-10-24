import styled from '@emotion/native';
import { useCallback, useState } from 'react';

import { Input } from '@/components/common/atoms';
import { IconButton } from '@/components/common/molecules';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useAppDispatch, useAppSelect } from '@/store';
import { getSearchResult } from '@/store/modules';
import { textSearchFilter } from '@/utils';

const SearchInputBox = () => {
  const rootNavigation = useRootNavigation();
  const dispatch = useAppDispatch();
  const stationType = useAppSelect(({ subwaySearch }) => subwaySearch.stationType);
  const subwayInfoList = useAppSelect(({ publicData }) => publicData.subwayInfo);

  const [searchText, setSearchText] = useState<string>('');

  const backToScreen = useCallback(() => {
    rootNavigation.goBack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeSearchText = useCallback((text: string) => {
    setSearchText(text);
    const result = subwayInfoList.filter((info) => {
      const searchLength = text.length;
      const wordToCheck = info.stnKrNm.slice(0, searchLength);
      return textSearchFilter(text, wordToCheck);
    });
    const sortedResult = result.sort((a, b) =>
      a.stnKrNm < b.stnKrNm ? -1 : a.stnKrNm > b.stnKrNm ? 1 : 0,
    );
    dispatch(getSearchResult(sortedResult));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteInputText = useCallback(() => {
    setSearchText('');
  }, []);

  return (
    <Container>
      <IconButton
        isFontIcon
        iconName="arrow-back-sharp"
        iconWidth="19.5"
        iconColor="#49454F"
        onPress={backToScreen}
      />
      <SearchInput
        value={searchText}
        placeholder={`${stationType}역을 검색해보세요`}
        placeholderTextColor="#BEBEBE"
        inputMode="search"
        onChangeText={changeSearchText}
      />
      <IconButton
        isFontIcon
        iconName="close-circle"
        iconWidth="19.5"
        iconColor="rgba(0, 0, 0, 0.46)"
        onPress={deleteInputText}
      />
    </Container>
  );
};

export default SearchInputBox;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 28px;
  border: 1px solid #d4d4d4;
  padding: 4px 16px 4px 18.25px;
  margin-top: 16px;
`;

const SearchInput = styled(Input)`
  height: 36px;
  flex: 1;
  margin-left: 18.25px;
  margin-right: 31.2px;
`;