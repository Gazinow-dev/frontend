import { FontText } from '@/global/ui';
import { ARRIVAL_STATION, DEPARTURE_STATION } from '@/global/constants';
import { useAppDispatch, useAppSelect } from '@/store';
import { getSeletedStation, getStationType, initialize } from '@/store/modules';
import type { StationDataTypes } from '@/store/modules';
import IconSwapChange from '@assets/icons/swap_change.svg';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import AddNewRouteHeader from './AddNewRouteHeader';
import { useNewRouteNavigation } from '@/navigation/NewRouteNavigation';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import React from 'react';
import cn from 'classname';
import {
  trackMapBookmark3ArrivalClick,
  trackMapBookmark3DepartureClick,
} from '@/analytics/map.events';

export interface SelectedStationTypes {
  departure: StationDataTypes;
  arrival: StationDataTypes;
}
interface SwapStationProps {
  setSelectedStation: React.Dispatch<React.SetStateAction<SelectedStationTypes>>;
}

type StationTypes = typeof DEPARTURE_STATION | typeof ARRIVAL_STATION;

const SwapStation = ({ setSelectedStation }: SwapStationProps) => {
  const route = useRoute();
  const newRouteNavigation = useNewRouteNavigation();
  const dispatch = useAppDispatch();
  const selectedStation = useAppSelect((state) => state.subwaySearch.selectedStation);

  const navigateSearchStation = (type: StationTypes) => {
    if (type === '출발역') {
      trackMapBookmark3DepartureClick();
    } else {
      trackMapBookmark3ArrivalClick();
    }
    dispatch(getStationType(type));
    newRouteNavigation.navigate('Search');
  };

  useFocusEffect(() => {
    if (
      selectedStation.arrival.stationName &&
      selectedStation.departure.stationName &&
      route.name === 'Swap'
    ) {
      dispatch(initialize());
    }
  });

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
    setSelectedStation(({ departure, arrival }) => ({
      departure: { ...arrival },
      arrival: { ...departure },
    }));
  };

  return (
    <SafeAreaView className={cn({ 'flex-1 bg-white': route.name === 'Swap' })}>
      <AddNewRouteHeader />
      <View className="flex-row items-center px-16 bg-white pb-45 pt-28">
        <View className="flex-1 gap-8 mr-15">
          {renderStationButton(selectedStation.departure, DEPARTURE_STATION)}
          {renderStationButton(selectedStation.arrival, ARRIVAL_STATION)}
        </View>
        <TouchableOpacity onPress={swapStation} hitSlop={20}>
          <IconSwapChange width={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SwapStation;
