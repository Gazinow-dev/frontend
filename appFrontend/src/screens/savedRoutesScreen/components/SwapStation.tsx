import { FontText } from '@/global/ui';
import { COLOR, ARRIVAL_STATION, DEPARTURE_STATION } from '@/global/constants';
import { useAppDispatch, useAppSelect } from '@/store';
import { getSeletedStation, getStationType, initialize } from '@/store/modules';
import type { StationDataTypes } from '@/store/modules';
import IconSwapChange from '@assets/icons/swap_change.svg';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import AddNewRouteHeader from './AddNewRouteHeader';
import { useNewRouteNavigation } from '@/navigation/NewRouteNavigation';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import React from 'react';

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
      className="w-[100%] h-41 pl-10 rounded-8 justify-center bg-gray-f9"
      onPress={() => navigateSearchStation(type)}
    >
      <FontText
        value={station.stationName || type}
        textSize="16px"
        textWeight="Regular"
        lineHeight="21px"
        textColor={station.stationName ? COLOR.BASIC_BLACK : COLOR.GRAY_999}
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
    <SafeAreaView className={`${route.name === 'Swap' ? `flex-1 bg-white` : ``}`}>
      <AddNewRouteHeader />
      <View className="flex-row pt-28 pb-45 px-16 items-center bg-white">
        <View className="flex-1 mr-15 gap-8">
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
