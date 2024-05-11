import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  isNavMode: false,
  currentElevation: null,
  distanceLeft: null,
  distanceTraveled: null,
  timeElapsed: null,
  isOnPath: false,
  timer: null,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    stopNavigation() {
      return initialState;
    },
    startNavigation(state) {
      state.isNavMode = true;
    },
    setCurrentElevation(state, action) {
      state.currentElevation = action.payload;
    },
    setDistanceLeft(state, action) {
      state.distanceLeft = action.payload;
    },
    setDistanceTraveled(state, action) {
      state.distanceTraveled = action.payload;
    },
    setTimeElapsed(state, action) {
      state.timeElapsed = action.payload;
    },
    setIsOnPath(state, action) {
      state.isOnPath = action.payload;
    },
  },
});

export const getIsNavMode = state => state.navigation.isNavMode;
export const getCurrentElevation = state => state.navigation.currentElevation;
export const getDistanceLeft = state => state.navigation.distanceLeft;
export const getDistanceTraveled = state => state.navigation.distanceTraveled;
export const getTimeElapsed = state => state.navigation.timeElapsed;
export const getIsOnPath = state => state.navigation.isOnPath;

export const {
  stopNavigation,
  startNavigation,
  setCurrentElevation,
  setDistanceLeft,
  setDistanceTraveled,
  setTimeElapsed,
  setIsOnPath
} = navigationSlice.actions;

export default navigationSlice.reducer;
