import { RawSubwayLineName } from '@/global/apis/entity';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface StationDataTypes {
  stationName: string;
  stationLine: RawSubwayLineName;
}

interface InitialStateTypes {
  stationType: null | '출발역' | '도착역';
  selectedStation: {
    departure: StationDataTypes;
    arrival: StationDataTypes;
  };
  issueId: number | null;
}

const initialState: InitialStateTypes = {
  stationType: null,
  selectedStation: {
    departure: {
      stationName: '',
      stationLine: null,
    },
    arrival: {
      stationName: '',
      stationLine: null,
    },
  },
  issueId: null,
};

const stationSearchSlice = createSlice({
  name: 'stationSearch',
  initialState,
  reducers: {
    getStationType: (state, action: PayloadAction<InitialStateTypes['stationType']>) => {
      state.stationType = action.payload;
    },
    getSeletedStation: (state, action: PayloadAction<InitialStateTypes['selectedStation']>) => {
      const isDuplicate =
        action.payload.arrival.stationName === action.payload.departure.stationName;
      if (isDuplicate) {
        state.selectedStation = {
          arrival: state.selectedStation.departure,
          departure: state.selectedStation.arrival,
        };
      } else state.selectedStation = action.payload;
    },
    swapStation: (state, action: PayloadAction<InitialStateTypes['selectedStation']>) => {
      state.selectedStation = {
        departure: action.payload.arrival,
        arrival: action.payload.departure,
      };
    },
    initialize: (state) => {
      state.stationType = null;
      state.selectedStation = {
        departure: {
          stationName: '',
          stationLine: null,
        },
        arrival: {
          stationName: '',
          stationLine: null,
        },
      };
      state.stationType = null;
    },
    getIssueId: (state, action: PayloadAction<InitialStateTypes['issueId']>) => {
      state.issueId = action.payload;
    },
  },
});

export const { swapStation, getStationType, getSeletedStation, initialize, getIssueId } =
  stationSearchSlice.actions;
export default stationSearchSlice.reducer;
