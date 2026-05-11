import cn from 'classname';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getSeletedStation, getStationType } from '@/store/modules';
import type { StationDataTypes } from '@/store/modules';
import { ARRIVAL_STATION, DEPARTURE_STATION } from '@/global/constants';
import { FontText } from '@/global/ui';
import { useSavePathNavigation } from '@/navigation/SavePathNavigation';
import {
  trackMapBookmark3ArrivalClick,
  trackMapBookmark3DepartureClick,
} from '@/analytics/map.events';
import { IconSwapChange } from '@/assets/icons';
import { useAppDispatch, useAppSelect } from '@/store';
import { SavePathHeader } from '.';

export interface SelectedStationTypes {
  departure: StationDataTypes;
  arrival: StationDataTypes;
}

type StationTypes = typeof DEPARTURE_STATION | typeof ARRIVAL_STATION;

interface Props {
  setSelectedStation: React.Dispatch<React.SetStateAction<SelectedStationTypes>>;
}

const SwapStation = ({ setSelectedStation }: Props) => {
  const savePathNavigation = useSavePathNavigation();
  const dispatch = useAppDispatch();
  const selectedStation = useAppSelect((state) => state.subwaySearch.selectedStation);

  const navigateSearchStation = (type: StationTypes) => {
    if (type === '출발역') {
      trackMapBookmark3DepartureClick();
    } else {
      trackMapBookmark3ArrivalClick();
    }
    dispatch(getStationType(type));
    savePathNavigation.navigate('StationSearch');
  };

  const renderStationButton = (station: StationDataTypes, type: StationTypes) => (
    <TouchableOpacity
      className="h-41 w-[100%] justify-center rounded-8 bg-gray-9f9 pl-10"
      onPress={() => navigateSearchStation(type)}
    >
      <FontText
        text={station.stationName || type}
        className={cn('leading-21', {
          'text-gray-999': !station.stationName,
        })}
      />
    </TouchableOpacity>
  );

  const swapStation = () => {
    dispatch(
      getSeletedStation({
        arrival: selectedStation.departure,
        departure: selectedStation.arrival,
      }),
    );
    // setSelectedStation(({ departure, arrival }) => ({
    //   departure: { ...arrival },
    //   arrival: { ...departure },
    // }));
  };

  return (
    <View>
      <SavePathHeader />
      <View className="flex-row items-center bg-white px-16 pb-45 pt-28">
        <View className="mr-15 flex-1 gap-8">
          {renderStationButton(selectedStation.departure, DEPARTURE_STATION)}
          {renderStationButton(selectedStation.arrival, ARRIVAL_STATION)}
        </View>
        <TouchableOpacity onPress={swapStation} hitSlop={20}>
          <IconSwapChange width={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SwapStation;
