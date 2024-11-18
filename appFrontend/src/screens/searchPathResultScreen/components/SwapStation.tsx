import cn from 'classname';

import { ARRIVAL_STATION, DEPARTURE_STATION } from '@/global/constants';
import { useAppDispatch } from '@/store';
import { getSeletedStation, getStationType } from '@/store/modules';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { SelectedStationTypes } from '..';
import IconSwapChange from '@assets/icons/swap_change.svg';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { FontText } from '@/global/ui';

interface SwapStationProps {
  selectedStation: SelectedStationTypes;
}

const SwapStation = ({ selectedStation }: SwapStationProps) => {
  const dispatch = useAppDispatch();
  const navigation = useRootNavigation();

  const swapStationHandler = () => {
    dispatch(
      getSeletedStation({
        arrival: selectedStation.departure,
        departure: selectedStation.arrival,
      }),
    );
  };

  return (
    <>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, marginRight: 15, rowGap: 8 }}>
          <TouchableOpacity
            className="justify-center w-full pl-10 bg-gray-9f9 h-41 rounded-8 pr-15"
            onPress={() => {
              dispatch(getStationType(DEPARTURE_STATION));
              navigation.navigate('IssueStack', { screen: 'SearchStation' });
            }}
          >
            <FontText
              text={
                selectedStation.departure.stationName
                  ? selectedStation.departure.stationName
                  : DEPARTURE_STATION
              }
              className={cn('leading-21', {
                'text-gray-999': !selectedStation.departure.stationName,
              })}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="justify-center w-full pl-10 bg-gray-9f9 h-41 rounded-8 pr-15"
            onPress={() => {
              dispatch(getStationType(ARRIVAL_STATION));
              navigation.navigate('IssueStack', { screen: 'SearchStation' });
            }}
          >
            <FontText
              text={
                selectedStation.arrival.stationName
                  ? selectedStation.arrival.stationName
                  : ARRIVAL_STATION
              }
              className={cn('leading-21', {
                'text-gray-999': !selectedStation.arrival.stationName,
              })}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={swapStationHandler}>
          <IconSwapChange />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SwapStation;
