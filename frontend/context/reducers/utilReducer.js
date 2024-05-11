import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  gpsAvailable: false,
  locationPermission: false,
  cameraPermission: false,
  locale: 'en',
  isConnected: false,
};

export const utilSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    setGpsAvailable: (state, action) => {
      state.gpsAvailable = action.payload;
    },
    setLocationPermission(state, action) {
      state.locationPermission = action.payload;
    },
    setCameraPermission(state, action) {
      state.cameraPermission = action.payload;
    },
    setLocale(state, action) {
      state.locale = action.payload;
    },
    setIsConnected(state, action) {
      state.isConnected = action.payload;
    }
  },
});

export const getGpsAvailability = state => state.utils.gpsAvailable;
export const getLocationPermission = state => state.utils.locationPermission;
export const getCameraPermission = state => state.utils.cameraPermission;
export const getLocale = state => state.utils.locale;
export const getIsConnected = state => state.utils.isConnected;

export const { setGpsAvailable, setLocationPermission, setCameraPermission, setLocale, setIsConnected } = utilSlice.actions;
export default utilSlice.reducer;
