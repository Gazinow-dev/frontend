import styled from '@emotion/native';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { TextButton } from '@/global/ui';
import { COLOR, ARRIVAL_STATION, DEPARTURE_STATION } from '@/global/constants';
import { useAppDispatch } from '@/store';
import { getSeletedStation } from '@/store/modules';
import type { StationDataTypes } from '@/store/modules';
import SearchStation from './NewSearchStation';
import SwapIcon from '@assets/icons/icon_change.svg';

export interface SelectedStationTypes {
  departure: StationDataTypes;
  arrival: StationDataTypes;
}

type StationTypes = typeof DEPARTURE_STATION | typeof ARRIVAL_STATION;

interface NewSearchSwapStationProps {
  setSeletedStation: React.Dispatch<React.SetStateAction<SelectedStationTypes>>;
  setDepth: Dispatch<SetStateAction<'search' | 'pathList' | 'detail' | 'name'>>;
}

const NewSearchSwapStation = ({ setSeletedStation, setDepth }: NewSearchSwapStationProps) => {
  const dispatch = useAppDispatch();

  const [searchType, setSearchType] = useState<StationTypes>('출발역');
  const [isOpenSearchStation, setIsOpenSearchStation] = useState<boolean>(false);
  const [selectedStation, setSelectedStation] = useState<SelectedStationTypes>({
    departure: {
      stationName: '',
      stationLine: null,
    },
    arrival: {
      stationName: '',
      stationLine: null,
    },
  });

  const closeSearchModal = () => setIsOpenSearchStation(false);

  const openSearchModal = (type: StationTypes) => {
    setDepth('search');
    setSearchType(type);
    setIsOpenSearchStation(true);
  };

  const swapStation = () => {
    dispatch(
      getSeletedStation({
        arrival: selectedStation.departure,
        departure: selectedStation.arrival,
      }),
    );
    setSelectedStation(({ departure, arrival }) => ({
      departure: {
        ...arrival,
      },
      arrival: {
        ...departure,
      },
    }));
  };

  useEffect(() => {
    if (selectedStation.arrival.stationName && selectedStation.departure.stationName) {
      setSeletedStation({
        arrival: selectedStation.arrival,
        departure: selectedStation.departure,
      });
      setDepth('pathList');
    }
  }, [selectedStation]);

  if (isOpenSearchStation) {
    return (
      <SearchStation
        closeModal={closeSearchModal}
        setSubwayStation={setSelectedStation}
        searchType={searchType}
      />
    );
  }
  return (
    <Container>
      <InnerBox>
        <StationButton
          value={
            selectedStation.departure.stationName
              ? selectedStation.departure.stationName
              : DEPARTURE_STATION
          }
          textSize="16px"
          textWeight="Regular"
          lineHeight="21px"
          textColor={selectedStation.departure.stationName ? COLOR.BASIC_BLACK : COLOR.GRAY_999}
          onPress={() => openSearchModal(DEPARTURE_STATION)}
        />
        <StationButton
          value={
            selectedStation.arrival.stationName
              ? selectedStation.arrival.stationName
              : ARRIVAL_STATION
          }
          textSize="16px"
          textWeight="Regular"
          lineHeight="21px"
          textColor={selectedStation.arrival.stationName ? COLOR.BASIC_BLACK : COLOR.GRAY_999}
          onPress={() => openSearchModal(ARRIVAL_STATION)}
        />
      </InnerBox>
      <SwapIcon width={20} onPress={swapStation} />
    </Container>
  );
};

export default NewSearchSwapStation;

const Container = styled.View`
  padding: 20px 16px 45px;
  background-color: ${COLOR.WHITE};
  flex-direction: row;
  align-items: center;
`;
const InnerBox = styled.View`
  flex: 1;
  margin-right: 15px;
  gap: 8px;
`;
const StationButton = styled(TextButton)`
  background-color: ${COLOR.GRAY_F9};
  width: 100%;
  height: 41px;
  border-radius: 8px;
  justify-content: center;
  padding-left: 10px;
  padding-right: 15px;
`;
