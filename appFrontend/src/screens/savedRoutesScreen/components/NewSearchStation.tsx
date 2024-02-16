import styled from '@emotion/native';
import Icon from 'react-native-vector-icons/Feather';
import { iconPath } from '@/assets/icons/iconPath';
import { FontText, Input } from '@/global/ui';
import { COLOR } from '@/global/constants';
import { useAppDispatch } from '@/store';
import { getSearchText } from '@/store/modules/subwaySearchModule';
import { useAddRecentSearch, useGetSearchHistory, useSearchStationName } from '@/global/apis/hook';
import { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { SelectedStationTypes } from './NewSearchSwapStation';
import DeleteInputIcon from '@assets/icons/deleteInput.svg';

interface SearchStationProps {
  searchType: '출발역' | '도착역';
  closeModal: () => void;
  setSubwayStation: React.Dispatch<React.SetStateAction<SelectedStationTypes>>;
}

const NewSearchStation = ({ searchType, closeModal, setSubwayStation }: SearchStationProps) => {
  const dispatch = useAppDispatch();

  const { data: history } = useGetSearchHistory();

  const [searchTextValue, setSearchTextValue] = useState<string>('');

  const changeSearchText = (text: string) => {
    setSearchTextValue(text);
    sendSearchText(text);
  };

  const sendSearchText = useCallback(
    debounce((text: string) => {
      dispatch(getSearchText(text));
    }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { searchResultData } = useSearchStationName(searchTextValue);
  const { addRecentMutate } = useAddRecentSearch({
    onSuccess: ({ stationLine, stationName }) => {
      const key = searchType === '출발역' ? 'departure' : 'arrival';
      setSubwayStation((prev) => ({
        ...prev,
        [key]: {
          stationLine,
          stationName,
        },
      }));
      closeModal();
    },
  });

  const stationBtnHandler = ({ stationName, stationLine }: (typeof searchResultData)[0]) => {
    if (!stationLine) return;
    addRecentMutate({ stationName, stationLine });
  };

  return (
    <>
      <Container>
        <SearchInput
          value={searchTextValue}
          placeholder={`${searchType}을 검색해보세요`}
          placeholderTextColor={COLOR.GRAY_BE}
          inputMode="search"
          onChangeText={changeSearchText}
          autoFocus
          isSavingNewRoute
        />
        <DeleteInputIcon width={19.5} onPress={() => setSearchTextValue('')} />
      </Container>
      {!searchTextValue ? (
        <ResultContainer>
          <Header>
            <FontText
              value="최근검색"
              textSize="14px"
              textWeight="Regular"
              lineHeight="24px"
              textColor="#757575"
            />
          </Header>

          <Ul marginTop="18px">
            {history?.map(({ id, stationName, stationLine }) => (
              <Li
                key={id}
                onPress={() =>
                  stationBtnHandler({
                    stationName,
                    stationLine,
                  })
                }
              >
                <Icon name="clock" size={25} color={COLOR.GRAY_BE} />
                <StationInfoBox>
                  <FontText
                    value={stationName}
                    textSize="16px"
                    textWeight="Medium"
                    lineHeight="21px"
                    textColor="#000"
                  />
                  <FontText
                    value={stationLine!}
                    textSize="14px"
                    textWeight="Regular"
                    lineHeight="21px"
                    textColor={COLOR.GRAY_999}
                  />
                </StationInfoBox>
              </Li>
            ))}
          </Ul>
        </ResultContainer>
      ) : (
        <ResultContainer>
          {/* 입력어가 있고 && 검색 결과가 있으면 결과 표시 */}
          {/* 입력어가 있고 && 검색 결과가 없으면 없음 표시 */}
          <Ul marginTop="28px">
            {searchResultData.map(({ stationName, stationLine }, idx) => (
              <Li key={idx} onPress={() => stationBtnHandler({ stationLine, stationName })}>
                <LocateIcon source={iconPath['location_pin_gray']} width={25} height={25} />
                <StationInfoBox>
                  <FontText
                    value={stationName}
                    textSize="16px"
                    textWeight="Medium"
                    lineHeight="21px"
                    textColor="#000"
                  />
                  <FontText
                    value={stationLine!}
                    textSize="14px"
                    textWeight="Regular"
                    lineHeight="21px"
                    textColor={COLOR.GRAY_999}
                  />
                </StationInfoBox>
              </Li>
            ))}
          </Ul>
        </ResultContainer>
      )}
    </>
  );
};

export default NewSearchStation;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 28px;
  border: 1px solid #d4d4d4;
  padding: 4px 16px 4px 18.25px;
  margin: 20px 16px 0;
`;
const SearchInput = styled(Input)<{ isSavingNewRoute?: boolean }>`
  height: 36px;
  flex: 1;
  margin-left: ${({ isSavingNewRoute }) => (isSavingNewRoute ? '1.75px' : '18.25px')};
  margin-right: 31.2px;
`;
const ResultContainer = styled.View`
  flex: 1;
`;
const Header = styled.View`
  padding-left: 16px;
  margin-top: 18px;
`;
const Ul = styled.ScrollView<{ marginTop: string }>`
  margin-top: ${({ marginTop }) => marginTop};
`;
const Li = styled.Pressable`
  flex-direction: row;
  gap: 7px;
  padding: 12px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${COLOR.GRAY_EB};
`;
const StationInfoBox = styled.View`
  gap: 2.95px;
`;
const LocateIcon = styled.Image`
  width: 25px;
  height: 25px;
`;
