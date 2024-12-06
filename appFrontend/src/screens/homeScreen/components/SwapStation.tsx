import { Shadow } from 'react-native-shadow-2';
import cn from 'classname';

import { COLOR, ARRIVAL_STATION, DEPARTURE_STATION } from '@/global/constants';
import { useAppDispatch, useAppSelect } from '@/store';
import { getStationType, initialize, swapStation } from '@/store/modules';
import type { StationDataTypes } from '@/store/modules';
import { TouchableOpacity, View } from 'react-native';
import IconSwapChange from '@assets/icons/swap_change.svg';
import { useRootNavigation } from '@/navigation/RootNavigation';
import { useFocusEffect } from '@react-navigation/native';
import { FontText } from '@/global/ui';

export interface SelectedStationTypes {
  departure: StationDataTypes;
  arrival: StationDataTypes;
}

type StationTypes = typeof DEPARTURE_STATION | typeof ARRIVAL_STATION;

const SwapStation = () => {
  const navigation = useRootNavigation();
  const dispatch = useAppDispatch();
  const selectedStation = useAppSelect((state) => state.subwaySearch.selectedStation);

  const navigateSearchStation = (type: StationTypes) => {
    dispatch(getStationType(type));
    navigation.navigate('IssueStack', { screen: 'SearchStation' });
  };

  useFocusEffect(() => {
    if (selectedStation.arrival.stationName && selectedStation.departure.stationName) {
      dispatch(initialize());
    }
  });

  return (
    <Shadow
      offset={[0, 4]}
      distance={34}
      startColor="rgba(0,0,0,0.05)"
      style={{
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: COLOR.WHITE,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View className="flex-1 gap-12">
        <TouchableOpacity
          className="justify-center pl-10 bg-gray-9f9 h-49 rounded-8"
          onPress={() => navigateSearchStation(DEPARTURE_STATION)}
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
          className="justify-center pl-10 bg-gray-9f9 h-49 rounded-8"
          onPress={() => navigateSearchStation(ARRIVAL_STATION)}
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
      <TouchableOpacity className="ml-15" onPress={() => dispatch(swapStation(selectedStation))}>
        <IconSwapChange />
      </TouchableOpacity>
    </Shadow>
  );
};

export default SwapStation;
