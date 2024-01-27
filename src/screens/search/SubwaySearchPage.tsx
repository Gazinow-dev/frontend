import { SearchInputBox, SearchResultList } from '@/screens/search/components';
import { COLOR } from '@/global/constants';
import { useSerarchHistory } from '@/hooks';
import styled from '@emotion/native';

const SubwaySearchPage = () => {
  const { data: history } = useSerarchHistory();

  return (
    <SearchPageContainer>
      <SearchInputBox />
      {history && <SearchResultList historyList={history} />}
    </SearchPageContainer>
  );
};
const SearchPageContainer = styled.View`
  background-color: ${COLOR.WHITE};
  flex: 1;
`;
export default SubwaySearchPage;
